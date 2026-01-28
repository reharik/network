import { ContactMethod, UpdateContact } from '@network/contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useToast } from '../contexts/ToastContext';
import { useContactListService, useContactService, useUserService } from '../hooks';
import { Container } from '../Layout';
import { AddContactForm } from '../ui/AddContactForm';
import { FormInput } from '../ui/FormInput';
import { Modal } from '../ui/Modal';
import { Badge, Button, Card, HStack, Table, VStack } from '../ui/Primitives';

export const Contacts = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { fetchContacts } = useContactListService();
  const { deleteContact, createContact, addToToday, suspendContact, unsuspendContact } =
    useContactService();
  const { getMe } = useUserService();
  const { data: userResult } = useQuery({ queryKey: ['user'], queryFn: getMe });
  const user = userResult?.success ? userResult.data : undefined;
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
    onSuccess: (result) => {
      if (result.success) {
        void qc.invalidateQueries({ queryKey: ['contacts'] });
        showToast('Contact deleted', 'success');
      } else {
        showToast('Failed to delete contact', 'error');
      }
    },
    onError: () => {
      showToast('Failed to delete contact', 'error');
    },
  });

  const addToTodayMut = useMutation({
    mutationFn: addToToday,
    onSuccess: (result) => {
      if (result.success) {
        void qc.invalidateQueries({ queryKey: ['today'] });
        void qc.invalidateQueries({ queryKey: ['contacts'] });
        showToast('Added to today', 'success');
        navigate('/');
      } else {
        showToast('Failed to add to today', 'error');
      }
    },
    onError: () => {
      showToast('Failed to add to today', 'error');
    },
  });

  const suspendMut = useMutation({
    mutationFn: suspendContact,
    onSuccess: (result) => {
      if (result.success) {
        void qc.invalidateQueries({ queryKey: ['contacts'] });
        void qc.invalidateQueries({ queryKey: ['today'] });
        showToast('Contact suspended', 'success');
      } else {
        showToast('Failed to suspend contact', 'error');
      }
    },
    onError: () => {
      showToast('Failed to suspend contact', 'error');
    },
  });

  const unsuspendMut = useMutation({
    mutationFn: unsuspendContact,
    onSuccess: (result) => {
      if (result.success) {
        void qc.invalidateQueries({ queryKey: ['contacts'] });
        void qc.invalidateQueries({ queryKey: ['today'] });
        showToast('Contact unsuspended', 'success');
      } else {
        showToast('Failed to unsuspend contact', 'error');
      }
    },
    onError: () => {
      showToast('Failed to unsuspend contact', 'error');
    },
  });

  const createMut = useMutation({
    mutationFn: createContact,
    onSuccess: (result) => {
      if (result.success) {
        void qc.invalidateQueries({ queryKey: ['contacts'] });
        setShowAddModal(false);
        showToast('Contact created', 'success');
      }
      // Validation errors are shown in the form, no toast needed
    },
    onError: () => {
      showToast('Failed to create contact', 'error');
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
    // Clear any validation errors from previous attempts
    createMut.reset();
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
            <FormInput
              id="contactFilter"
              placeholder="Search name or handle…"
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => querySetter(e.target.value)}
            />
            <FormInput
              as="select"
              id="channelFilter"
              value={channel?.value}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const value = e.target.value;
                setChannel(value ? ContactMethod.tryFromValue(value) : undefined);
              }}
            >
              <option value="">All channels</option>
              {ContactMethod.toOptions().map((x) => (
                <option value={x.value}>{x.label}</option>
              ))}
            </FormInput>
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
                      <HStack gap={1}>
                        <Link to={`/contacts/${c.id}`}>{`${c.firstName} ${c.lastName}`}</Link>
                        {c.paused && (
                          <SuspendedBadge title="Suspended – contact will not appear on daily list">
                            Suspended
                          </SuspendedBadge>
                        )}
                      </HStack>
                    </td>
                    <td>{c.preferredMethod.display}</td>
                    <td>{c.intervalDays} days</td>
                    <td>
                      <HStack gap={1}>
                        {c.paused ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => unsuspendMut.mutate(c.id)}
                            disabled={unsuspendMut.isPending}
                          >
                            Unsuspend
                          </Button>
                        ) : (
                          <>
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
                              onClick={() => suspendMut.mutate(c.id)}
                              disabled={suspendMut.isPending}
                            >
                              Suspend
                            </Button>
                          </>
                        )}
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
            errors={createMut.data && !createMut.data.success ? createMut.data.errors : undefined}
            defaultContactMessage={user?.defaultContactMessage}
            defaultIntervalDays={user?.defaultIntervalDays}
            defaultPreferredMethod={user?.defaultPreferredMethod}
          />
        </Modal>
      </VStack>
    </Container>
  );
};

const SuspendedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(234, 179, 8, 0.15);
  color: #eab308;
  font-size: 11px;
  font-weight: 600;
`;
