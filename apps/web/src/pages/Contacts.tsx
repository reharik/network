import { ContactMethod, UpdateContact } from '@network/contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useToast } from '../contexts/ToastContext';
import { useContactListService, useContactService, useUserService } from '../hooks';
import { Container } from '../Layout';
import { AddContactForm } from '../ui/AddContactForm';
import { FormInput } from '../ui/FormInput';
import {
  CalendarPlusIcon,
  IconButton,
  PauseIcon,
  PlayIcon,
  TrashIcon,
} from '../ui/IconButton';
import { Modal } from '../ui/Modal';
import { Badge, Button, Card, HStack, Table, VStack } from '../ui/Primitives';
import { addToTodayPinned } from '../utils/todayPinnedStore';

export const Contacts = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();
  const { fetchContacts } = useContactListService();
  const { deleteContact, createContact, suspendContact, unsuspendContact } = useContactService();
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

  // Search and channel from URL for deep linking (return to same search after editing a contact)
  const query = searchParams.get('q') ?? '';
  const channelParam = searchParams.get('channel');
  const channel = useMemo(
    () => (channelParam ? ContactMethod.tryFromValue(channelParam) : undefined),
    [channelParam],
  );

  const setQuery = (value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set('q', value);
        else next.delete('q');
        return next;
      },
      { replace: true },
    );
  };

  const setChannelFilter = (value: ContactMethod | undefined) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value?.value) next.set('channel', value.value);
        else next.delete('channel');
        return next;
      },
      { replace: true },
    );
  };

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

  const handleContactNow = (contactId: string) => {
    addToTodayPinned(contactId);
    void qc.invalidateQueries({ queryKey: ['today'] });
    showToast('Added to today', 'success');
    navigate('/');
  };

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
        <HStack stackOnMobile>
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            />
            <FormInput
              as="select"
              id="channelFilter"
              value={channel?.value ?? ''}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const value = e.target.value;
                setChannelFilter(value ? ContactMethod.tryFromValue(value) : undefined);
              }}
            >
              <option value="">All channels</option>
              {ContactMethod.toOptions().map((x: { value: string; label: string }) => (
                <option value={x.value}>{x.label}</option>
              ))}
            </FormInput>
          </HStack>
        </Card>

        {isLoading ? (
          <Card>Loading…</Card>
        ) : (
          <>
            <TableSection>
              <Card>
                <TableWrapper>
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
                            <ActionCell>
                              {c.paused ? (
                                <IconButton
                                  onClick={() => unsuspendMut.mutate(c.id)}
                                  disabled={unsuspendMut.isPending}
                                  aria-label="Unsuspend"
                                  title="Unsuspend contact"
                                >
                                  <PlayIcon />
                                </IconButton>
                              ) : (
                                <>
                                  <IconButton
                                    onClick={() => handleContactNow(c.id)}
                                    aria-label="Contact Now"
                                    title="Add to today"
                                  >
                                    <CalendarPlusIcon />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => suspendMut.mutate(c.id)}
                                    disabled={suspendMut.isPending}
                                    aria-label="Suspend"
                                    title="Suspend contact"
                                  >
                                    <PauseIcon />
                                  </IconButton>
                                </>
                              )}
                              <IconButton
                                variant="danger"
                                onClick={() => handleDelete(c.id, `${c.firstName} ${c.lastName}`)}
                                disabled={deleteMut.isPending}
                                aria-label="Delete"
                                title="Delete contact"
                              >
                                <TrashIcon />
                              </IconButton>
                            </ActionCell>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </TableWrapper>
              </Card>
            </TableSection>

            <CardListSection>
              <VStack gap={2}>
                {filtered.map((c) => (
                  <ContactListCard key={c.id} $paused={!!c.paused}>
                    <CardTop>
                      <CardTopRow>
                        <HStack gap={1}>
                          <Link to={`/contacts/${c.id}`} className="contact-name">
                            {c.firstName} {c.lastName}
                          </Link>
                          {c.paused && (
                            <SuspendedBadge title="Suspended – contact will not appear on daily list">
                              Suspended
                            </SuspendedBadge>
                          )}
                        </HStack>
                        <CardActions>
                          {c.paused ? (
                            <IconButton
                              onClick={() => unsuspendMut.mutate(c.id)}
                              disabled={unsuspendMut.isPending}
                              aria-label="Unsuspend"
                              title="Unsuspend contact"
                            >
                              <PlayIcon />
                            </IconButton>
                          ) : (
                            <>
                              <IconButton
                                onClick={() => handleContactNow(c.id)}
                                aria-label="Contact Now"
                                title="Add to today"
                              >
                                <CalendarPlusIcon />
                              </IconButton>
                              <IconButton
                                onClick={() => suspendMut.mutate(c.id)}
                                disabled={suspendMut.isPending}
                                aria-label="Suspend"
                                title="Suspend contact"
                              >
                                <PauseIcon />
                              </IconButton>
                            </>
                          )}
                          <IconButton
                            variant="danger"
                            onClick={() => handleDelete(c.id, `${c.firstName} ${c.lastName}`)}
                            disabled={deleteMut.isPending}
                            aria-label="Delete"
                            title="Delete contact"
                          >
                            <TrashIcon />
                          </IconButton>
                        </CardActions>
                      </CardTopRow>
                      <MetaLine>
                        {c.preferredMethod.display} · every {c.intervalDays} days
                      </MetaLine>
                    </CardTop>
                  </ContactListCard>
                ))}
              </VStack>
            </CardListSection>
          </>
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

const TableSection = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  width: 100%;
  -webkit-overflow-scrolling: touch;
`;

const ActionCell = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: nowrap;
`;

const CardListSection = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const ContactListCard = styled(Card)<{ $paused: boolean }>`
  opacity: ${({ $paused }) => ($paused ? 0.85 : 1)};
  border-left: 3px solid
    ${({ $paused, theme }) => ($paused ? 'rgba(234, 179, 8, 0.6)' : 'transparent')};
`;

const CardTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const CardTop = styled.div`
  .contact-name {
    font-weight: 700;
    font-size: 1.05rem;
    text-decoration: none;
    color: ${({ theme }) => theme.colors.text};
  }
  .contact-name:hover {
    text-decoration: underline;
  }
`;

const MetaLine = styled.div`
  color: #a8b3c7;
  font-size: 0.9rem;
  margin-top: 6px;
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

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
