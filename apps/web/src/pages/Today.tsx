import { Contact, ContactMethod, UpdateTouch } from '@network/contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pascalCase } from 'case-anything';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { useCommunicationService, usePlanService, useTouchService } from '../hooks';
import {
  MakeCallRequest,
  SendEmailRequest,
  SendSmsRequest,
} from '../hooks/useCommunicationService';
import { Container } from '../Layout';
import { replaceTokens } from '../services/replaceTokens';
import { EmailModal } from '../ui/EmailModal';
import { FormInput } from '../ui/FormInput';
import { Modal } from '../ui/Modal';
import { Badge, Button, Card, Field, HStack, VStack } from '../ui/Primitives';
import { SmsModal } from '../ui/SmsModal';
import { TouchForm } from '../ui/TouchForm';

export const Today = () => {
  const qc = useQueryClient();
  const { showToast } = useToast();
  const { getTodaysContacts } = usePlanService();
  const { logTouch, snoozeContact } = useTouchService();
  const { sendMessage } = useCommunicationService();

  // State for the touch modal
  const [selectedContact, setSelectedContact] = useState<
    | {
        id: string;
        name: string;
        message: string;
      }
    | undefined
  >(undefined);

  // State for modals
  const [modal, modalSetter] = useState<{
    type?: 'email' | 'sms';
    isOpen: boolean;
    contact?: Contact;
  }>({ isOpen: false });

  const {
    data: result,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['today'],
    queryFn: () => getTodaysContacts(),
  });

  const touch = useMutation({
    mutationFn: (touchData: UpdateTouch) => logTouch(touchData),
    onSuccess: (result) => {
      if (result.success) {
        qc.invalidateQueries({ queryKey: ['today'] });
        setSelectedContact(undefined);
        showToast('Touch logged', 'success');
      }
      // Validation errors are shown in the form, no toast needed
    },
    onError: () => {
      showToast('Failed to log touch', 'error');
    },
  });

  const snooze = useMutation({
    mutationFn: ({ contactId, days }: { contactId: string; days: number }) =>
      snoozeContact(contactId, days),
    onSuccess: (result) => {
      if (result.success) {
        qc.invalidateQueries({ queryKey: ['today'] });
        showToast('Contact snoozed', 'success');
      } else {
        showToast('Failed to snooze contact', 'error');
      }
    },
    onError: () => {
      showToast('Failed to snooze contact', 'error');
    },
  });

  const handleMarkDoneClick = (contact: Contact) => {
    setSelectedContact({
      id: contact.id,
      name: `${contact.firstName} ${contact.lastName}`,
      message: replaceTokens(contact.suggestion, contact),
    });
  };

  const handleDirectContact = (contact: Contact, method: 'email' | 'sms' | 'call') => {
    if (method !== 'call') {
      modalSetter({
        type: method,
        isOpen: true,
        contact,
      });
    } else if (contact.phone) {
      // Use AWS Connect to make the call
      voiceMutation.mutate({ type: 'call', to: contact.phone });
      // Automatically mark as done after initiating call
      setTimeout(() => {
        handleMarkDoneClick(contact);
      }, 1000);
    }
  };

  const handleTouchSubmit = (data: { method: string; message: string; outcome: string }) => {
    if (!selectedContact) return;

    const methodEnum = ContactMethod.tryFromValue(data.method);
    if (!methodEnum) {
      console.error('Invalid method:', data.method);
      return;
    }

    const touchData: UpdateTouch = {
      contactId: selectedContact.id,
      method: methodEnum,
      message: data.message,
      outcome: data.outcome || undefined,
    };

    touch.mutate(touchData);
  };

  const handleTouchCancel = () => {
    setSelectedContact(undefined);
    // Clear any validation errors from previous attempts
    touch.reset();
  };

  const emailMutation = useMutation({
    mutationFn: sendMessage<SendEmailRequest>,
    onSuccess: (result) => {
      if (result.success) {
        handleCloseModal();
        showToast('Email sent', 'success');
        // Automatically mark contact as done after sending email
        if (modal.contact) {
          handleMarkDoneClick(modal.contact);
        }
      }
      // Validation errors are shown in the form, no toast needed
    },
    onError: () => {
      showToast('Failed to send email', 'error');
    },
  });

  const smsMutation = useMutation({
    mutationFn: sendMessage<SendSmsRequest>,
    onSuccess: (result) => {
      if (result.success) {
        handleCloseModal();
        showToast('SMS sent', 'success');
        // Automatically mark contact as done after sending SMS
        if (modal.contact) {
          handleMarkDoneClick(modal.contact);
        }
      }
      // Validation errors are shown in the form, no toast needed
    },
    onError: () => {
      showToast('Failed to send SMS', 'error');
    },
  });

  const voiceMutation = useMutation({
    mutationFn: sendMessage<MakeCallRequest>,
    onSuccess: (result) => {
      if (result.success) {
        showToast('Call initiated', 'success');
        // Automatically mark contact as done after initiating call
        // Note: We'll need to track which contact initiated the call
      }
      // Validation errors are shown in the form, no toast needed
    },
    onError: () => {
      showToast('Failed to initiate call', 'error');
    },
  });

  const handleEmailSubmit = (data: { subject: string; body: string }) => {
    if (!modal.contact?.email || modal.type !== 'email') {
      handleCloseModal();
      return;
    }

    // Replace tokens like {{firstName}} with actual contact values
    const subject = replaceTokens(data.subject, modal.contact);
    const body = replaceTokens(data.body, modal.contact);

    emailMutation.mutate({
      type: 'email',
      to: modal.contact.email,
      subject,
      body,
    });
  };

  const handleSmsSubmit = (data: { message: string }) => {
    if (!modal.contact?.phone || modal.type !== 'sms') {
      handleCloseModal();
      return;
    }

    // Replace tokens like {{firstName}} with actual contact values
    const message = replaceTokens(data.message, modal.contact);

    smsMutation.mutate({
      type: 'sms',
      to: modal.contact.phone,
      message,
    });
  };

  const handleCloseModal = () => {
    modalSetter({ isOpen: false, contact: undefined, type: undefined });
    // Clear any validation errors from previous attempts
    emailMutation.reset();
    smsMutation.reset();
  };

  return (
    <Container>
      <VStack gap={3}>
        <HStack>
          <h1>Today's Reach-outs</h1>
          {<Badge>{DateTime.now().toLocaleString(DateTime.DATE_FULL)}</Badge>}
        </HStack>

        {isLoading && <Card>Loading…</Card>}
        {error && <Card>Something went wrong.</Card>}

        {(result?.success && result?.data ? result?.data : []).map((c) => {
          return (
            <Card key={c.id}>
              <VStack gap={2}>
                <HStack>
                  <div>
                    <Link
                      to={`/contacts/${c.id}`}
                      style={{ fontWeight: 700, fontSize: '1.05rem' }}
                    >{`${c.firstName} ${c.lastName}`}</Link>
                    <div style={{ color: '#a8b3c7', fontSize: '.9rem' }}>
                      {c.preferredMethod.display}: {c.preferredMethod.handle(c)} · every{' '}
                      {c.intervalDays}d
                    </div>
                  </div>
                </HStack>

                <Field label="Suggested line">
                  <FormInput
                    as="textarea"
                    defaultValue={replaceTokens(c.suggestion, c)}
                    onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => e.currentTarget.select()}
                  />
                </Field>

                <HStack>
                  <Button onClick={() => handleMarkDoneClick(c)}>Mark Done</Button>

                  {/* Direct contact buttons */}
                  {c.email && (
                    <Button variant="secondary" onClick={() => handleDirectContact(c, 'email')}>
                      📧 Email
                    </Button>
                  )}
                  {c.phone && (
                    <>
                      <Button variant="secondary" onClick={() => handleDirectContact(c, 'sms')}>
                        💬 SMS
                      </Button>
                      <Button variant="secondary" onClick={() => handleDirectContact(c, 'call')}>
                        📞 Call
                      </Button>
                    </>
                  )}

                  <Button
                    variant="ghost"
                    onClick={() => snooze.mutate({ contactId: c.id, days: 7 })}
                  >
                    Snooze 7d
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => snooze.mutate({ contactId: c.id, days: 1 })}
                  >
                    Snooze 1d
                  </Button>
                </HStack>
              </VStack>
            </Card>
          );
        })}

        {(result?.success && result?.data?.length ? result?.data?.length : 0) === 0 &&
          !isLoading && <Card>you're all caught up 🎉</Card>}
      </VStack>

      {/* Mark Done Modal */}
      <Modal
        isOpen={selectedContact !== undefined}
        onClose={handleTouchCancel}
        title="Mark Contact Done"
      >
        {selectedContact && (
          <TouchForm
            contactName={selectedContact.name}
            initialMessage={selectedContact.message}
            onSubmit={handleTouchSubmit}
            onCancel={handleTouchCancel}
            isLoading={touch.isPending}
            errors={touch.data && !touch.data.success ? touch.data.errors : []}
          />
        )}
      </Modal>

      <Modal
        isOpen={modal.isOpen}
        onClose={handleCloseModal}
        title={`Send ${modal.type ? pascalCase(modal.type) : ''}`}
      >
        {/* Email Modal */}
        {modal.type === 'email' && modal.contact?.email && (
          <EmailModal
            contactName={`${modal.contact.firstName} ${modal.contact.lastName}`}
            contactEmail={modal.contact.email}
            initialSubject=""
            initialBody={replaceTokens(modal.contact.suggestion, modal.contact)}
            onSubmit={handleEmailSubmit}
            onCancel={handleCloseModal}
            isLoading={emailMutation.isPending}
            errors={
              emailMutation.data && !emailMutation.data.success ? emailMutation.data.errors : []
            }
          />
        )}

        {/* SMS Modal */}
        {modal.type === 'sms' && modal.contact?.phone && (
          <SmsModal
            contactName={`${modal.contact.firstName} ${modal.contact.lastName}`}
            contactPhone={modal.contact.phone}
            initialMessage={replaceTokens(modal.contact.suggestion, modal.contact)}
            onSubmit={handleSmsSubmit}
            onCancel={handleCloseModal}
            isLoading={smsMutation.isPending}
            errors={smsMutation.data && !smsMutation.data.success ? smsMutation.data.errors : []}
          />
        )}
      </Modal>
    </Container>
  );
};
