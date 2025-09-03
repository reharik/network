import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Contact } from '../types';
import {
  deleteContact,
  getContact,
  updateContact,
} from '../services/contactService';
import { qk } from '../services/keys';

const Card = styled.section`
  background: #0e1220;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 20px;
  display: grid;
  gap: 16px;
`;
const Field = styled.div`
  display: grid;
  gap: 6px;
`;
const Label = styled.label`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.subtext};
  letter-spacing: 0.4px;
  text-transform: uppercase;
`;
const Input = styled.input`
  background: #0a0d17;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 10px 12px;
  color: ${({ theme }) => theme.colors.text};
`;
const TextArea = styled.textarea`
  background: #0a0d17;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 10px 12px;
  color: ${({ theme }) => theme.colors.text};
  min-height: 96px;
`;
const Row = styled.div`
  display: flex;
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

export const ContactDetail = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: qk.contact(id),
    queryFn: () => getContact(id),
    enabled: Boolean(id),
  });

  const [form, setForm] = useState<Contact | null>(null);
  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const onChange =
    (k: keyof Contact) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => (prev ? { ...prev, [k]: e.target.value } : prev));

  const isDirty = useMemo(
    () => JSON.stringify(data ?? {}) !== JSON.stringify(form ?? {}),
    [data, form],
  );

  const saveMut = useMutation({
    mutationFn: updateContact,
    onSuccess: (updated) => {
      qc.setQueryData(qk.contact(updated.id), updated);
      void qc.invalidateQueries({ queryKey: qk.contacts });
    },
  });

  const deleteMut = useMutation({
    mutationFn: () => deleteContact(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: qk.contacts });
      void navigate('/contacts');
    },
  });

  if (isLoading) return <div>Loading…</div>;
  if (isError || !form) return <div>Contact not found.</div>;

  return (
    <Card>
      <h2>
        {form.firstName} {form.lastName}
      </h2>

      <Row>
        <Field>
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            value={form.firstName}
            onChange={onChange('firstName')}
          />
        </Field>
        <Field>
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            value={form.lastName}
            onChange={onChange('lastName')}
          />
        </Field>
      </Row>

      <Row>
        <Field style={{ flex: 1 }}>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={form.email ?? ''}
            onChange={onChange('email')}
          />
        </Field>
        <Field style={{ flex: 1 }}>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={form.phone ?? ''}
            onChange={onChange('phone')}
          />
        </Field>
      </Row>

      <Field>
        <Label htmlFor="notes">Notes</Label>
        <TextArea
          id="notes"
          value={form.notes ?? ''}
          onChange={onChange('notes')}
        />
      </Field>

      <Row>
        <Button
          onClick={() => form && saveMut.mutate({ ...form, id: form.id })}
          disabled={!isDirty || saveMut.isPending}
        >
          {saveMut.isPending ? 'Saving…' : 'Save changes'}
        </Button>

        <Button
          danger
          onClick={() => deleteMut.mutate()}
          disabled={deleteMut.isPending}
        >
          {deleteMut.isPending ? 'Deleting…' : 'Delete contact'}
        </Button>

        <Button onClick={() => navigate('/contacts')}>Back to contacts</Button>
      </Row>
    </Card>
  );
};
