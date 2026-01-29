import { ContactMethod, CreateTouchInput, DailyContact } from '@network/contracts';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { pascalCase } from 'case-anything';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useToast } from '../contexts/ToastContext';
import {
  useCommunicationService,
  useContactService,
  usePlanService,
  useTouchService,
  useUserService,
} from '../hooks';
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
import { getTodayPinnedIds, removeFromTodayPinned } from '../utils/todayPinnedStore';

export const Today = () => {
  const qc = useQueryClient();
  const { showToast } = useToast();
  const { getTodaysContacts } = usePlanService();
  const { getMe } = useUserService();
  const { getContact } = useContactService();
  const { logTouch, snoozeContact } = useTouchService();
  const { suspendContact } = useContactService();
  const { sendMessage } = useCommunicationService();

  const { data: userResult } = useQuery({ queryKey: ['user'], queryFn: getMe });
  const userDefaultMessage = userResult?.success
    ? userResult.data?.defaultContactMessage
    : undefined;

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
    contact?: DailyContact;
  }>({ isOpen: false });

  // Track custom messages for each contact
  const [customMessages, setCustomMessages] = useState<Record<string, string>>({});

  // Track snooze/suspend dropdown value per contact (reset after selection)
  const [snoozeSuspendValue, setSnoozeSuspendValue] = useState<Record<string, string>>({});

  // Pinned "Contact Now" IDs — read from store every render so we see latest after navigating back from Contact Now
  const pinnedIds = getTodayPinnedIds();

  const {
    data: result,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['today'],
    queryFn: () => getTodaysContacts(),
    refetchOnMount: 'always',
  });

  const apiList = result?.success && result?.data ? result.data : [];
  const pinnedIdsToFetch = pinnedIds.filter((id) => !apiList.some((c) => c.id === id));

  const pinnedQueries = useQueries({
    queries: pinnedIdsToFetch.map((id) => ({
      queryKey: ['contact', id] as const,
      queryFn: () => getContact(id),
    })),
  });

  const pinnedContacts: DailyContact[] = pinnedQueries
    .map((q) => q.data)
    .filter((r): r is NonNullable<typeof r> => r != null)
    .filter((r) => r.success === true && r.data != null)
    .map((r) => ({ ...(r as { success: true; data: DailyContact }).data, touchedToday: false }));

  // Pinned ("Contact Now") on top of daily goal: e.g. goal 3 + 1 pinned = 4 total
  const displayList = [...pinnedContacts, ...apiList];

  const touch = useMutation({
    mutationFn: (touchData: CreateTouchInput) => logTouch(touchData),
    onSuccess: (result, variables) => {
      if (result.success) {
        removeFromTodayPinned(variables.contactId);
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

  const suspend = useMutation({
    mutationFn: (contactId: string) => suspendContact(contactId),
    onSuccess: (result) => {
      if (result.success) {
        qc.invalidateQueries({ queryKey: ['today'] });
        showToast('Contact suspended', 'success');
      } else {
        showToast('Failed to suspend contact', 'error');
      }
    },
    onError: () => {
      showToast('Failed to suspend contact', 'error');
    },
  });

  const handleMarkDoneClick = (contact: DailyContact) => {
    setSelectedContact({
      id: contact.id,
      name: `${contact.firstName} ${contact.lastName}`,
      message: replaceTokens(contact.suggestion, contact),
    });
  };

  const handleDirectContact = (contact: DailyContact, method: 'email' | 'sms' | 'call') => {
    if (method !== 'call') {
      modalSetter({
        type: method,
        isOpen: true,
        contact,
      });
    } else if (contact.phone) {
      // Use AWS Connect to make the call
      voiceMutation.mutate({ type: 'call', to: contact.phone });
      // Auto-log touch for the call
      autoLogTouch(contact.id, 'call', `Called ${contact.phone}`);
    }
  };

  const handleMessageChange = (contactId: string, message: string) => {
    setCustomMessages((prev) => ({
      ...prev,
      [contactId]: message,
    }));
  };

  const getMessageForContact = (contact: DailyContact): string => {
    const customMessage = customMessages[contact.id];
    if (customMessage !== undefined) {
      return customMessage;
    }
    const template = userDefaultMessage ?? contact.suggestion;
    return replaceTokens(template, contact);
  };

  const handleTouchSubmit = (data: { method: string; message: string; outcome: string }) => {
    if (!selectedContact) return;

    const methodEnum = ContactMethod.tryFromValue(data.method);
    if (!methodEnum) {
      console.error('Invalid method:', data.method);
      return;
    }

    const touchData: CreateTouchInput = {
      contactId: selectedContact.id,
      method: methodEnum,
      message: data.message,
      outcome: data.outcome || undefined,
      fromContactNow: pinnedIds.includes(selectedContact.id),
    };

    touch.mutate(touchData);
  };

  const handleTouchCancel = () => {
    setSelectedContact(undefined);
    // Clear any validation errors from previous attempts
    touch.reset();
  };

  // Auto-log a touch after communication (persists to database)
  const autoLogTouch = (contactId: string, method: 'email' | 'sms' | 'call', message: string) => {
    const methodEnum = ContactMethod.tryFromKey(method);
    if (!methodEnum) return;

    logTouch({
      contactId,
      method: methodEnum,
      message,
      outcome: `Sent via ${method}`,
      fromContactNow: pinnedIds.includes(contactId),
    }).then((result) => {
      if (result.success) {
        // Re-fetch today's contacts - the backend will return the contact with touchedToday: true
        qc.invalidateQueries({ queryKey: ['today'] });
      }
    });
  };

  const emailMutation = useMutation({
    mutationFn: (request: SendEmailRequest) => sendMessage(request),
    onError: () => {
      showToast('Failed to send email', 'error');
    },
  });

  const smsMutation = useMutation({
    mutationFn: (request: SendSmsRequest) => sendMessage(request),
    onError: () => {
      showToast('Failed to send SMS', 'error');
    },
  });

  const voiceMutation = useMutation({
    mutationFn: (request: MakeCallRequest) => sendMessage(request),
    onSuccess: (result) => {
      if (result.success) {
        showToast('Call initiated', 'success');
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

    // Capture contact info before async operation
    const contactId = modal.contact.id;

    // Replace tokens like {{firstName}} with actual contact values
    const subject = replaceTokens(data.subject, modal.contact);
    const body = replaceTokens(data.body, modal.contact);

    emailMutation.mutate(
      {
        type: 'email',
        to: modal.contact.email,
        subject,
        body,
      },
      {
        onSuccess: (result) => {
          if (result.success) {
            autoLogTouch(contactId, 'email', body);
            handleCloseModal();
            showToast('Email sent', 'success');
          }
        },
      },
    );
  };

  const handleSmsSubmit = (data: { message: string }) => {
    if (!modal.contact?.phone || modal.type !== 'sms') {
      handleCloseModal();
      return;
    }

    // Capture contact info before async operation
    const contactId = modal.contact.id;

    // Replace tokens like {{firstName}} with actual contact values
    const message = replaceTokens(data.message, modal.contact);

    smsMutation.mutate(
      {
        type: 'sms',
        to: modal.contact.phone,
        message,
      },
      {
        onSuccess: (result) => {
          if (result.success) {
            autoLogTouch(contactId, 'sms', message);
            handleCloseModal();
            showToast('SMS sent', 'success');
          }
        },
      },
    );
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

        {displayList.map((c) => (
          <ContactCard key={c.id} $isDone={c.touchedToday}>
            <VStack gap={2}>
              <HStack>
                <div>
                  <HStack gap={1}>
                    <Link
                      to={`/contacts/${c.id}`}
                      style={{ fontWeight: 700, fontSize: '1.05rem' }}
                    >{`${c.firstName} ${c.lastName}`}</Link>
                    {c.touchedToday && <DoneBadge>✓ Done</DoneBadge>}
                  </HStack>
                  <div style={{ color: '#a8b3c7', fontSize: '.9rem' }}>
                    {c.preferredMethod.display}: {c.preferredMethod.handle(c)} · every{' '}
                    {c.intervalDays}d
                  </div>
                </div>
              </HStack>

              <Field label="Suggested line">
                <FormInput
                  as="textarea"
                  value={
                    customMessages[c.id] ?? replaceTokens(userDefaultMessage ?? c.suggestion, c)
                  }
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleMessageChange(c.id, e.target.value)
                  }
                  onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => e.currentTarget.select()}
                />
              </Field>

              <HStack>
                {!c.touchedToday && (
                  <Button onClick={() => handleMarkDoneClick(c)}>Mark Done</Button>
                )}

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

                <FormInput
                  as="select"
                  value={snoozeSuspendValue[c.id] ?? ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const v = e.target.value;
                    if (!v) return;
                    if (v === 'suspend') {
                      suspend.mutate(c.id);
                    } else {
                      const weeks = Number(v);
                      if (weeks >= 1 && weeks <= 6) {
                        snooze.mutate({ contactId: c.id, days: weeks * 7 });
                      }
                    }
                    setSnoozeSuspendValue((prev) => ({ ...prev, [c.id]: '' }));
                  }}
                  disabled={snooze.isPending || suspend.isPending}
                  style={{ width: 'auto', minWidth: 140 }}
                >
                  <option value="">Snooze / Suspend</option>
                  {[1, 2, 3, 4, 5, 6].map((w) => (
                    <option key={w} value={w}>
                      Snooze {w} {w === 1 ? 'week' : 'weeks'}
                    </option>
                  ))}
                  <option value="suspend">Suspend</option>
                </FormInput>
              </HStack>
            </VStack>
          </ContactCard>
        ))}

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
            initialBody={getMessageForContact(modal.contact)}
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
            initialMessage={getMessageForContact(modal.contact)}
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

// Styled Components
const ContactCard = styled(Card)<{ $isDone: boolean }>`
  opacity: ${({ $isDone }) => ($isDone ? 0.7 : 1)};
  border-left: 3px solid ${({ $isDone, theme }) => ($isDone ? '#22c55e' : 'transparent')};
`;

const DoneBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
  font-size: 12px;
  font-weight: 600;
`;
