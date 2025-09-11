import { ContactMethod } from '@network/contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContactListService, useContactService } from '../hooks';
import { Container } from '../Layout';
import { Badge, Button, Card, HStack, Input, Select, Table, VStack } from '../ui/Primitives';

export const Contacts = () => {
  const qc = useQueryClient();
  const { fetchContacts } = useContactListService();
  const { deleteContact } = useContactService();
  const { data, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: fetchContacts,
  });
  const contacts = useMemo(() => data?.contacts ?? [], [data]);

  const [query, querySetter] = useState('');
  const [channel, setChannel] = useState<ContactMethod | undefined>();

  const deleteMut = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['contacts'] });
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteMut.mutate(id);
    }
  };

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      const byName = query
        ? c.firstName.toLowerCase().includes(query.toLowerCase()) ||
          c.lastName.toLowerCase().includes(query.toLowerCase())
        : true;
      const byChannel = !!channel ? c.preferredMethod === channel : true;
      return byName && byChannel;
    });
  }, [contacts, query, channel]);
  return (
    <Container>
      <VStack gap={3}>
        <HStack>
          <h1>Contacts</h1>
          <Badge>{contacts.length} total</Badge>
        </HStack>

        <Card>
          <HStack wrap gap={2}>
            <Input
              placeholder="Search name or handle…"
              value={query}
              onChange={(e) => querySetter(e.target.value)}
            />
            <Select
              value={channel?.value}
              onChange={(e) => {
                const value = e.target.value;
                setChannel(value ? ContactMethod.tryFromValue(value) : undefined);
              }}
            >
              <option value="">All channels</option>
              {ContactMethod.toOptions().map((x) => (
                <option value={x.value}>{x.label}</option>
              ))}
            </Select>
          </HStack>
        </Card>

        {isLoading ? (
          <Card>Loading…</Card>
        ) : (
          <Card>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Preferred Method</th>
                  <th>Interval</th>
                  <th style={{ width: 1 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link to={`/contacts/${c.id}`}>{`${c.firstName} ${c.lastName}`}</Link>
                    </td>
                    <td>{c.preferredMethod.display}</td>
                    <td>{c.intervalDays} days</td>
                    <td>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDelete(c.id, `${c.firstName} ${c.lastName}`)}
                        disabled={deleteMut.isPending}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}
      </VStack>
    </Container>
  );
};
