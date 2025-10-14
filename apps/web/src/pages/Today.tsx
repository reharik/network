import { Contact, ContactMethod, UpdateTouch } from '@network/contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pascalCase } from 'case-anything';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { Container } from '../Layout';
import { useCommunicationService, usePlanService, useTouchService } from '../hooks';
import {
  MakeCallRequest,
  SendEmailRequest,
  SendSmsRequest,
} from '../hooks/useCommunicationService';
import { EmailModal } from '../ui/EmailModal';
import { Modal } from '../ui/Modal';
import { Badge, Button, Card, Field, HStack, TextArea, VStack } from '../ui/Primitives';
import { SmsModal } from '../ui/SmsModal';
import { TouchForm } from '../ui/TouchForm';

export const Today = () => {
  const qc = useQueryClient();
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['today'] });
      setSelectedContact(undefined);
    },
  });

  const snooze = useMutation({
    mutationFn: ({ contactId, days }: { contactId: string; days: number }) =>
      snoozeContact(contactId, days),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['today'] }),
  });

  const handleMarkDoneClick = (contact: any) => {
    setSelectedContact({
      id: contact.id,
      name: `${contact.firstName} ${contact.lastName}`,
      message: contact.suggestion,
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
  };

  const emailMutation = useMutation({
    mutationFn: sendMessage<SendEmailRequest>,
    onSuccess: () => {
      handleCloseModal();
      // Automatically mark contact as done after sending email
      if (modal.contact) {
        handleMarkDoneClick(modal.contact);
      }
    },
  });

  const smsMutation = useMutation({
    mutationFn: sendMessage<SendSmsRequest>,
    onSuccess: () => {
      handleCloseModal();
      // Automatically mark contact as done after sending email
      if (modal.contact) {
        handleMarkDoneClick(modal.contact);
      }
    },
  });

  const voiceMutation = useMutation({
    mutationFn: sendMessage<MakeCallRequest>,
    onSuccess: () => {
      // Automatically mark contact as done after initiating call
      // Note: We'll need to track which contact initiated the call
    },
  });

  const handleEmailSubmit = (data: { subject: string; body: string }) => {
    if (!modal.contact?.email || modal.type !== 'email') {
      handleCloseModal();
      return;
    }

    emailMutation.mutate({
      type: 'email',
      to: modal.contact.email,
      subject: data.subject,
      body: data.body,
    });
  };

  const handleSmsSubmit = (data: { message: string }) => {
    if (!modal.contact?.phone || modal.type !== 'sms') {
      handleCloseModal();
      return;
    }

    smsMutation.mutate({
      type: 'sms',
      to: modal.contact.phone,
      message: data.message,
    });
  };

  const handleCloseModal = () => {
    modalSetter({ isOpen: false, contact: undefined, type: undefined });
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
                    <div
                      style={{ fontWeight: 700, fontSize: '1.05rem' }}
                    >{`${c.firstName} ${c.lastName}`}</div>
                    <div style={{ color: '#a8b3c7', fontSize: '.9rem' }}>
                      {c.preferredMethod.display}: {c.preferredMethod.handle(c)} · every{' '}
                      {c.intervalDays}d
                    </div>
                  </div>
                </HStack>

                <Field label="Suggested line">
                  <TextArea defaultValue={c.suggestion} onFocus={(e) => e.currentTarget.select()} />
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
            initialBody={modal.contact.suggestion}
            onSubmit={handleEmailSubmit}
            onCancel={handleCloseModal}
            isLoading={emailMutation.isPending}
          />
        )}

        {/* SMS Modal */}
        {modal.type === 'sms' && modal.contact?.phone && (
          <SmsModal
            contactName={`${modal.contact.firstName} ${modal.contact.lastName}`}
            contactPhone={modal.contact.phone}
            initialMessage={modal.contact.suggestion}
            onSubmit={handleSmsSubmit}
            onCancel={handleCloseModal}
            isLoading={smsMutation.isPending}
          />
        )}
      </Modal>
    </Container>
  );
};
