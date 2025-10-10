import { ContactMethod, UpdateContact } from '@network/contracts';
import React, { useState } from 'react';
import { Button, Field, HStack, Input, Select, TextArea, VStack } from './Primitives';

interface AddContactFormProps {
  onSubmit: (data: UpdateContact) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AddContactForm = ({ onSubmit, onCancel, isLoading = false }: AddContactFormProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [suggestion, setSuggestion] = useState(
    `Hi ${firstName ? firstName : '{{firstName}}'}, just checking in to see how you're doing.`,
  );
  const [preferredMethod, setPreferredMethod] = useState<ContactMethod>(ContactMethod.email);
  const [intervalDays, setIntervalDays] = useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const contactData: UpdateContact = {
      firstName,
      lastName,
      email: email || undefined,
      phone: phone || undefined,
      notes: notes || undefined,
      suggestion,
      preferredMethod,
      intervalDays,
      paused: false,
    };

    onSubmit(contactData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap={3}>
        <div>
          <strong>Add New Contact</strong>
        </div>

        <HStack gap={2}>
          <Field label="First Name">
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              required
              disabled={isLoading}
            />
          </Field>
          <Field label="Last Name">
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              required
              disabled={isLoading}
            />
          </Field>
        </HStack>

        <HStack gap={2}>
          <Field label="Email">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              disabled={isLoading}
            />
          </Field>
          <Field label="Phone">
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
              disabled={isLoading}
            />
          </Field>
        </HStack>

        <HStack gap={2}>
          <Field label="Preferred Method">
            <Select
              value={preferredMethod.value}
              onChange={(e) => setPreferredMethod(ContactMethod.fromValue(e.target.value))}
              disabled={isLoading}
            >
              {ContactMethod.toOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Interval (days)">
            <Input
              type="number"
              min="1"
              max="365"
              value={intervalDays}
              onChange={(e) => setIntervalDays(parseInt(e.target.value) || 30)}
              disabled={isLoading}
            />
          </Field>
        </HStack>

        <Field label="Notes">
          <TextArea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes about this contact..."
            disabled={isLoading}
          />
        </Field>

        <Field label="Default Message">
          <TextArea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="Default message template (use {{firstName}} for personalization)"
            disabled={isLoading}
          />
        </Field>

        <HStack>
          {/* TODO: validate the form using validator */}
          <Button type="submit" disabled={isLoading || !firstName || !lastName}>
            {isLoading ? 'Creating...' : 'Add Contact'}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};
