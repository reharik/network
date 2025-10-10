import { ContactMethod, UpdateTouch } from '@network/contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { Container } from '../Layout';
import { usePlanService, useTouchService } from '../hooks';
import { Modal } from '../ui/Modal';
import { Badge, Button, Card, Field, HStack, TextArea, VStack } from '../ui/Primitives';
import { TouchForm } from '../ui/TouchForm';

export const Today = () => {
  const qc = useQueryClient();
  const { getTodaysContacts } = usePlanService();
  const { logTouch, snoozeContact } = useTouchService();

  // State for the touch modal
  const [selectedContact, setSelectedContact] = useState<
    | {
        id: string;
        name: string;
        message: string;
      }
    | undefined
  >(undefined);

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

  return (
    <Container>
      <VStack gap={3}>
        <HStack>
          <h1>Today’s Reach-outs</h1>
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
                  <a href={c.preferredMethod.link(c)}>Open {c.preferredMethod.display}</a>
                </HStack>

                <Field label="Suggested line">
                  <TextArea defaultValue={c.suggestion} onFocus={(e) => e.currentTarget.select()} />
                </Field>

                <HStack>
                  <Button onClick={() => handleMarkDoneClick(c)}>Mark Done</Button>
                  <Button
                    variant="secondary"
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
    </Container>
  );
};
