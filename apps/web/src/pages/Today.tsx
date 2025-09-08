// src/pages/Today.tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Container } from '../Layout';
import { usePlanService, useTouchService } from '../hooks';
import { Badge, Button, Card, Field, HStack, TextArea, VStack } from '../ui/Primitives';

export const Today = ({ count = 3 }: { count?: number }) => {
  const qc = useQueryClient();
  const { getTodayReachOuts } = usePlanService();
  const { logTouch, snoozeContact } = useTouchService();

  const { data, isLoading, error } = useQuery({
    queryKey: ['today', count],
    queryFn: () => getTodayReachOuts(count),
  });

  const touch = useMutation({
    mutationFn: (contactId: string) => logTouch(contactId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['today'] }),
  });

  const snooze = useMutation({
    mutationFn: ({ contactId, days }: { contactId: string; days: number }) =>
      snoozeContact(contactId, days),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['today'] }),
  });

  return (
    <Container>
      <VStack gap={3}>
        <HStack>
          <h1>Today’s Reach-outs</h1>
          {data?.date && <Badge>{data.date}</Badge>}
        </HStack>

        {isLoading && <Card>Loading…</Card>}
        {error && <Card>Something went wrong.</Card>}

        {(data?.picks ?? []).map((c) => (
          <Card key={c.id}>
            <VStack gap={2}>
              <HStack>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{c.name}</div>
                  <div style={{ color: '#a8b3c7', fontSize: '.9rem' }}>
                    {c.preferredChannel.display}: {c.handle} · every {c.intervalDays}d
                  </div>
                </div>
                <a href={c.link}>Open {c.preferredChannel.display}</a>
              </HStack>

              <Field label="Suggested line">
                <TextArea defaultValue={c.suggestion} onFocus={(e) => e.currentTarget.select()} />
              </Field>

              <HStack>
                <Button onClick={() => touch.mutate(c.id)}>Mark Done</Button>
                <Button
                  variant="secondary"
                  onClick={() => snooze.mutate({ contactId: c.id, days: 7 })}
                >
                  Snooze 7d
                </Button>
                <Button variant="ghost" onClick={() => snooze.mutate({ contactId: c.id, days: 1 })}>
                  Snooze 1d
                </Button>
              </HStack>
            </VStack>
          </Card>
        ))}

        {(data?.picks?.length ?? 0) === 0 && !isLoading && <Card>you’re all caught up 🎉</Card>}
      </VStack>
    </Container>
  );
};
