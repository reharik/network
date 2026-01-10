import { Contact } from '@network/contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useToast } from '../contexts/ToastContext';
import { useContactService } from '../hooks';
import { qk } from '../services/keys';
import { FormError } from '../ui/FormError';
import { FormInput } from '../ui/FormInput';

export const ContactDetail = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { showToast } = useToast();
  const { getContact, updateContact, deleteContact, addToToday } = useContactService();

  const {
    data: result,
    isLoading,
    isError,
  } = useQuery({
    queryKey: qk.contact(id),
    queryFn: () => getContact(id),
    enabled: Boolean(id),
  });

  const [form, setForm] = useState<Contact | undefined>(undefined);
  useEffect(() => {
    if (result?.success) setForm(result.data);
  }, [result]);

  const onChange = (k: keyof Contact) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => (prev ? { ...prev, [k]: e.target.value || undefined } : prev));

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

  const addToTodayMut = useMutation({
    mutationFn: addToToday,
    onSuccess: (result) => {
      if (result.success) {
        void qc.invalidateQueries({ queryKey: ['today'] });
        void qc.invalidateQueries({ queryKey: qk.contact(id) });
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

  const handleContactNow = () => {
    addToTodayMut.mutate(id);
  };

  if (isLoading) return <div>Loading…</div>;
  if (isError || !form) return <div>Contact not found.</div>;

  return (
    <Card>
      <h2>
        {form.firstName} {form.lastName}
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

      <FieldRow>
        <FormInput
          label="Email"
          id="email"
          value={form.email ?? ''}
          onChange={onChange('email')}
          errors={!saveMut.data?.success ? saveMut.data?.errors : []}
        />
        <FormInput
          label="Phone"
          id="phone"
          value={form.phone ?? ''}
          onChange={onChange('phone')}
          errors={!saveMut.data?.success ? saveMut.data?.errors : []}
        />
      </FieldRow>

      <FormInput
        label="Notes"
        id="notes"
        as="textarea"
        value={form.notes ?? ''}
        onChange={onChange('notes')}
        errors={!saveMut.data?.success ? saveMut.data?.errors : []}
      />

      <Row>
        <Button
          onClick={() => form && saveMut.mutate({ ...form, id: form.id })}
          disabled={!isDirty || saveMut.isPending}
        >
          {saveMut.isPending ? 'Saving…' : 'Save changes'}
        </Button>

        <Button onClick={handleContactNow} disabled={addToTodayMut.isPending}>
          {addToTodayMut.isPending ? 'Adding to Today...' : 'Contact Now'}
        </Button>

        <Button danger onClick={() => deleteMut.mutate()} disabled={deleteMut.isPending}>
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

const Row = styled.div`
  display: flex;
  gap: 12px;
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const Button = styled.button<{ danger?: boolean }>`
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ danger }) => (danger ? '#2a0e13' : '#0f1424')};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  &:hover {
    filter: brightness(1.1);
  }
`;
