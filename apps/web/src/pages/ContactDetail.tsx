import { Contact, ContactEmail, ContactPhone, ContactMethod } from '@network/contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import { ChangeEvent, Fragment, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useToast } from '../contexts/ToastContext';
import { useContactService, useTouchService } from '../hooks';
import { qk } from '../services/keys';
import { FormError } from '../ui/FormError';
import { FormInput } from '../ui/FormInput';
import { IconButton, PlusIcon, TrashIcon } from '../ui/IconButton';
import { PhoneInput } from '../ui/PhoneInput';
import { Button, HStack, Table, VStack } from '../ui/Primitives';
import { addToTodayPinned } from '../utils/todayPinnedStore';

export const ContactDetail = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { showToast } = useToast();
  const { getContact, updateContact, deleteContact, suspendContact, unsuspendContact } =
    useContactService();
  const { getContactTouches } = useTouchService();

  const {
    data: result,
    isLoading,
    isError,
  } = useQuery({
    queryKey: qk.contact(id),
    queryFn: () => getContact(id),
    enabled: Boolean(id),
  });

  const { data: touchesResult } = useQuery({
    queryKey: ['contact', id, 'touches'],
    queryFn: () => getContactTouches(id),
    enabled: Boolean(id),
  });
  const touches = touchesResult?.success ? touchesResult.data.touches : [];

  const [form, setForm] = useState<Contact | undefined>(undefined);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [expandedTouchId, setExpandedTouchId] = useState<string | null>(null);
  useEffect(() => {
    if (result?.success) setForm(result.data);
  }, [result]);

  const onChange = (k: keyof Contact) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => (prev ? { ...prev, [k]: e.target.value || undefined } : prev));

  const setEmails = (emails: ContactEmail[]) =>
    setForm((prev) => (prev ? { ...prev, emails } : prev));
  const setPhones = (phones: ContactPhone[]) =>
    setForm((prev) => (prev ? { ...prev, phones } : prev));

  const emailsList = form?.emails?.length
    ? form.emails
    : form?.email
      ? [{ id: '', contactId: form.id, email: form.email, isDefault: true }]
      : [];
  const phonesList = form?.phones?.length
    ? form.phones
    : form?.phone
      ? [{ id: '', contactId: form.id, phone: form.phone, isDefault: true }]
      : [];

  const isDirty = useMemo(
    () => result?.success && JSON.stringify(result?.data ?? {}) !== JSON.stringify(form ?? {}),
    [result, form],
  );

  const saveMut = useMutation({
    mutationFn: updateContact,
    onSuccess: (updated) => {
      if (updated.success) {
        qc.setQueryData(qk.contact(updated.data.id), updated);
        void qc.invalidateQueries({ queryKey: qk.contacts });
        void qc.invalidateQueries({ queryKey: ['today'] });
        showToast('Contact saved', 'success');
        navigate(-1); // Go back to previous page (Today or Contacts)
      }
      // Validation errors are shown in the form, no toast needed
    },
    onError: () => {
      showToast('Failed to save contact', 'error');
    },
  });

  const handleContactNow = () => {
    addToTodayPinned(id);
    void qc.invalidateQueries({ queryKey: ['today'] });
    showToast('Added to today', 'success');
    navigate('/');
  };

  const deleteMut = useMutation({
    mutationFn: () => deleteContact(id),
    onSuccess: (result) => {
      if (result.success) {
        void qc.invalidateQueries({ queryKey: qk.contacts });
        void qc.invalidateQueries({ queryKey: ['today'] });
        showToast('Contact deleted', 'success');
        navigate(-1); // Go back to previous page (Today or Contacts)
      } else {
        showToast('Failed to delete contact', 'error');
      }
    },
    onError: () => {
      showToast('Failed to delete contact', 'error');
    },
  });

  const suspendMut = useMutation({
    mutationFn: () => suspendContact(id),
    onSuccess: (result) => {
      if (result.success) {
        void qc.invalidateQueries({ queryKey: qk.contacts });
        void qc.invalidateQueries({ queryKey: qk.contact(id) });
        void qc.invalidateQueries({ queryKey: ['today'] });
        showToast('Contact suspended', 'success');
        if (form) setForm({ ...form, paused: true });
      } else {
        showToast('Failed to suspend contact', 'error');
      }
    },
    onError: () => {
      showToast('Failed to suspend contact', 'error');
    },
  });

  const unsuspendMut = useMutation({
    mutationFn: () => unsuspendContact(id),
    onSuccess: (result) => {
      if (result.success) {
        void qc.invalidateQueries({ queryKey: qk.contacts });
        void qc.invalidateQueries({ queryKey: qk.contact(id) });
        void qc.invalidateQueries({ queryKey: ['today'] });
        showToast('Contact unsuspended', 'success');
        if (form) setForm({ ...form, paused: false });
      } else {
        showToast('Failed to unsuspend contact', 'error');
      }
    },
    onError: () => {
      showToast('Failed to unsuspend contact', 'error');
    },
  });

  if (isLoading) return <div>Loading…</div>;
  if (isError || !form) return <div>Contact not found.</div>;

  return (
    <Card>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {form.firstName} {form.lastName}
        {form.paused && (
          <SuspendedBadge title="Suspended – contact will not appear on daily list">
            Suspended
          </SuspendedBadge>
        )}
      </h2>

      <FormError errors={saveMut.data && !saveMut.data.success ? saveMut.data.errors : []} />

      <FieldRow>
        <FormInput
          label="First name"
          id="firstName"
          value={form.firstName}
          onChange={onChange('firstName')}
          errors={!saveMut.data?.success ? saveMut.data?.errors : []}
        />
        <FormInput
          label="Last name"
          id="lastName"
          value={form.lastName}
          onChange={onChange('lastName')}
          errors={!saveMut.data?.success ? saveMut.data?.errors : []}
        />
      </FieldRow>

      <VStack gap={2}>
        <SectionHeader>
          <strong style={{ fontSize: '0.9rem' }}>Emails</strong>
          <IconButton
            type="button"
            onClick={() =>
              setEmails([
                ...emailsList,
                { id: '', contactId: form!.id, email: '', isDefault: false },
              ])
            }
            disabled={!form}
            aria-label="Add email"
            title="Add email address"
          >
            <PlusIcon />
          </IconButton>
        </SectionHeader>
        {emailsList.map((entry, index) => (
          <EntryRow key={entry.id || `e-${index}`}>
            <InputCell>
              <FormInput
                type="email"
                value={entry.email}
                onChange={(ev: ChangeEvent<HTMLInputElement>) =>
                  setEmails(
                    emailsList.map((entry, i) =>
                      i === index ? { ...entry, email: ev.target.value } : entry,
                    ),
                  )
                }
                disabled={!form}
                errors={!saveMut.data?.success ? saveMut.data?.errors : []}
              />
            </InputCell>
            <DefaultLabel>
              <input
                type="radio"
                name="defaultEmail"
                checked={entry.isDefault}
                onChange={() =>
                  setEmails(emailsList.map((e, i) => ({ ...e, isDefault: i === index })))
                }
                disabled={!form}
              />
              Default
            </DefaultLabel>
            <IconButton
              type="button"
              variant="danger"
              size="sm"
              onClick={() =>
                setEmails(
                  emailsList.length > 1 ? emailsList.filter((_, i) => i !== index) : emailsList,
                )
              }
              disabled={!form || emailsList.length <= 1}
              aria-label="Remove email"
              title="Remove this email"
            >
              <TrashIcon />
            </IconButton>
          </EntryRow>
        ))}
      </VStack>

      <VStack gap={2}>
        <SectionHeader>
          <strong style={{ fontSize: '0.9rem' }}>Phones</strong>
          <IconButton
            type="button"
            onClick={() =>
              setPhones([
                ...phonesList,
                { id: '', contactId: form!.id, phone: '', isDefault: false },
              ])
            }
            disabled={!form}
            aria-label="Add phone"
            title="Add phone number"
          >
            <PlusIcon />
          </IconButton>
        </SectionHeader>
        {phonesList.map((entry, index) => (
          <EntryRow key={entry.id || `p-${index}`}>
            <InputCell>
              <PhoneInput
                value={entry.phone}
                onChange={(ev: ChangeEvent<HTMLInputElement>) =>
                  setPhones(
                    phonesList.map((entry, i) =>
                      i === index ? { ...entry, phone: ev.target.value } : entry,
                    ),
                  )
                }
                disabled={!form}
                errors={!saveMut.data?.success ? saveMut.data?.errors : []}
              />
            </InputCell>
            <DefaultLabel>
              <input
                type="radio"
                name="defaultPhone"
                checked={entry.isDefault}
                onChange={() =>
                  setPhones(phonesList.map((p, i) => ({ ...p, isDefault: i === index })))
                }
                disabled={!form}
              />
              Default
            </DefaultLabel>
            <IconButton
              type="button"
              variant="danger"
              size="sm"
              onClick={() =>
                setPhones(
                  phonesList.length > 1 ? phonesList.filter((_, i) => i !== index) : phonesList,
                )
              }
              disabled={!form || phonesList.length <= 1}
              aria-label="Remove phone"
              title="Remove this phone number"
            >
              <TrashIcon />
            </IconButton>
          </EntryRow>
        ))}
      </VStack>

      <FormInput
        label="Notes"
        id="notes"
        as="textarea"
        value={form.notes ?? ''}
        onChange={onChange('notes')}
        errors={!saveMut.data?.success ? saveMut.data?.errors : []}
      />

      <HistorySection>
        <HistoryHeader
          type="button"
          onClick={() => setHistoryExpanded((prev) => !prev)}
          aria-expanded={historyExpanded}
        >
          <span className="chevron">{historyExpanded ? '▼' : '▶'}</span>
          <strong style={{ fontSize: '0.9rem' }}>Contact history</strong>
          {touches.length > 0 && (
            <span style={{ color: '#a8b3c7', fontSize: '0.85rem', fontWeight: 400 }}>
              {' '}({touches.length})
            </span>
          )}
        </HistoryHeader>
        {historyExpanded && (
          <>
            {touches.length === 0 ? (
              <p style={{ color: '#a8b3c7', fontSize: '0.9rem', margin: '8px 0 0 0' }}>
                No reach-outs recorded yet.
              </p>
            ) : (
              <HistoryTable>
                <thead>
                  <tr>
                    <th style={{ width: 28 }} aria-label="Expand" />
                    <th>Date</th>
                    <th>Method</th>
                  </tr>
                </thead>
                <tbody>
                  {touches.map((t) => {
                    const isExpanded = expandedTouchId === t.id;
                    const hasContent = !!(t.message || t.subject);
                    const methodDisplay =
                      t.method && typeof t.method === 'object' && 'display' in t.method
                        ? String((t.method as { display: string }).display)
                        : typeof t.method === 'string'
                          ? ContactMethod.tryFromValue(t.method)?.display ?? t.method
                          : (t.method as { value?: string })?.value ?? '—';
                    return (
                      <Fragment key={t.id}>
                        <tr>
                          <td>
                            {hasContent ? (
                              <HistoryRowToggle
                                type="button"
                                onClick={() =>
                                  setExpandedTouchId((prev) => (prev === t.id ? null : t.id))
                                }
                                aria-expanded={isExpanded}
                                title={isExpanded ? 'Collapse' : 'Show message'}
                              >
                                {isExpanded ? '▼' : '▶'}
                              </HistoryRowToggle>
                            ) : (
                              <span style={{ color: 'transparent' }}>—</span>
                            )}
                          </td>
                          <td>
                            {t.createdAt
                              ? DateTime.fromISO(t.createdAt).toLocaleString(DateTime.DATETIME_MED)
                              : '—'}
                          </td>
                          <td>{methodDisplay}</td>
                        </tr>
                        {isExpanded && hasContent && (
                          <tr>
                            <td colSpan={3} style={{ paddingTop: 0, paddingBottom: 12 }}>
                              <HistoryDetail>
                                {t.subject != null && t.subject !== '' && (
                                  <div className="subject">
                                    <strong>Subject:</strong> {t.subject}
                                  </div>
                                )}
                                {t.message != null && t.message !== '' && (
                                  <div className="message">
                                    {t.subject != null && t.subject !== '' ? (
                                      <>
                                        <strong>Message:</strong> {t.message}
                                      </>
                                    ) : (
                                      t.message
                                    )}
                                  </div>
                                )}
                                {!t.message && !t.subject && (
                                  <span style={{ color: '#a8b3c7' }}>No message stored.</span>
                                )}
                              </HistoryDetail>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </HistoryTable>
            )}
          </>
        )}
      </HistorySection>

      <Row>
        <Button
          onClick={() => form && saveMut.mutate({ ...form, id: form.id })}
          disabled={!isDirty || saveMut.isPending}
        >
          {saveMut.isPending ? 'Saving…' : 'Save changes'}
        </Button>

        {form.paused ? (
          <Button onClick={() => unsuspendMut.mutate()} disabled={unsuspendMut.isPending}>
            {unsuspendMut.isPending ? 'Unsuspending…' : 'Unsuspend'}
          </Button>
        ) : (
          <>
            <Button onClick={handleContactNow}>Contact Now</Button>
            <Button onClick={() => suspendMut.mutate()} disabled={suspendMut.isPending}>
              {suspendMut.isPending ? 'Suspending…' : 'Suspend'}
            </Button>
          </>
        )}

        <Button variant="danger" onClick={() => deleteMut.mutate()} disabled={deleteMut.isPending}>
          {deleteMut.isPending ? 'Deleting…' : 'Delete contact'}
        </Button>

        <Button onClick={() => navigate(-1)}>Back</Button>
      </Row>
    </Card>
  );
};

// Styled Components
const Card = styled.section`
  background: #0e1220;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 20px;
  display: grid;
  gap: 16px;
`;

const HistorySection = styled.div`
  display: block;

  @media (max-width: 768px) {
    display: none;
  }
`;

const HistoryHeader = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  font: inherit;
  text-align: left;

  .chevron {
    font-size: 0.7rem;
    color: ${({ theme }) => theme.colors.subtext};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    .chevron {
      color: ${({ theme }) => theme.colors.text};
    }
  }
`;

const HistoryTable = styled(Table)`
  margin-top: 8px;
`;

const HistoryRowToggle = styled.button`
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.subtext};
  cursor: pointer;
  font-size: 0.7rem;
  line-height: 1;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const HistoryDetail = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.subtext};
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: ${({ theme }) => theme.radius.sm};
  margin-left: 28px;
  white-space: pre-wrap;
  word-break: break-word;

  .subject {
    margin-bottom: 6px;
  }
  .message {
    margin: 0;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DefaultLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.subtext};
`;

const EntryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: nowrap;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const InputCell = styled.div`
  flex: 1;
  min-width: 0;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SuspendedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(234, 179, 8, 0.15);
  color: #eab308;
  font-size: 12px;
  font-weight: 600;
`;
