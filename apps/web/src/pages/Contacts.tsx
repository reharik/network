// src/pages/Contacts.tsx
import { useQuery } from '@tanstack/react-query';
import { fetchContacts } from '../services/contactListService';
import {
  Badge,
  Card,
  HStack,
  Input,
  Select,
  Table,
  VStack,
  Button,
} from '../ui/Primitives';
import { Container } from '../Layout';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ContactMethod } from '@network/contracts';

export const Contacts = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: fetchContacts,
  });
  const contacts = data?.contacts ?? [];

  const [q, setQ] = useState('');
  const [channel, setChannel] = useState<ContactMethod>(ContactMethod.sms);

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      const byQ = q
        ? c.name.toLowerCase().includes(q.toLowerCase()) ||
          c.handle.toLowerCase().includes(q.toLowerCase())
        : true;
      const byCh = channel ? c.preferredChannel === channel : true;
      return byQ && byCh;
    });
  }, [contacts, q, channel]);

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
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Select
              value={channel.value}
              onChange={(e) =>
                setChannel(ContactMethod.fromValue(e.target.value))
              }
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
                  <th>Preferred</th>
                  <th>Handle</th>
                  <th>Interval</th>
                  <th style={{ width: 1 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link to={`/contacts/${c.id}`}>{c.name}</Link>
                    </td>
                    <td>{c.preferredChannel.display}</td>
                    <td>{c.handle}</td>
                    <td>{c.intervalDays} days</td>
                    <td>
                      <Button variant="secondary" size="sm">
                        Edit
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
