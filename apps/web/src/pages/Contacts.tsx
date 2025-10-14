import { ContactMethod, UpdateContact } from '@network/contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContactListService, useContactService } from '../hooks';
import { Container } from '../Layout';
import { AddContactForm } from '../ui/AddContactForm';
import { Modal } from '../ui/Modal';
import { Badge, Button, Card, HStack, Input, Select, Table, VStack } from '../ui/Primitives';

export const Contacts = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { fetchContacts } = useContactListService();
  const { deleteContact, createContact, addToToday } = useContactService();
  const { data: result, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: fetchContacts,
  });
  const contacts = useMemo(
    () => (result?.success && result?.data.contacts ? result?.data.contacts : []),
    [result],
  );

  const [query, querySetter] = useState('');
  const [channel, setChannel] = useState<ContactMethod | undefined>();
  const [showAddModal, setShowAddModal] = useState(false);

  const deleteMut = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['contacts'] });
    },
  });

  const addToTodayMut = useMutation({
    mutationFn: addToToday,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['today'] });
      void qc.invalidateQueries({ queryKey: ['contacts'] });
      navigate('/');
    },
  });

  const createMut = useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['contacts'] });
      setShowAddModal(false);
    },
  });

  const handleContactNow = (contactId: string) => {
    addToTodayMut.mutate(contactId);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteMut.mutate(id);
    }
  };

  const handleAddContact = (data: UpdateContact) => {
    createMut.mutate(data);
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
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
          <Button onClick={() => setShowAddModal(true)}>Add Contact</Button>
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
                      <HStack gap={1}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleContactNow(c.id)}
                          disabled={addToTodayMut.isPending}
                        >
                          Contact Now
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDelete(c.id, `${c.firstName} ${c.lastName}`)}
                          disabled={deleteMut.isPending}
                        >
                          Delete
                        </Button>
                      </HStack>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}

        <Modal isOpen={showAddModal} onClose={handleCancelAdd} title="Add New Contact">
          <AddContactForm
            onSubmit={handleAddContact}
            onCancel={handleCancelAdd}
            isLoading={createMut.isPending}
          />
        </Modal>
      </VStack>
    </Container>
  );
};
