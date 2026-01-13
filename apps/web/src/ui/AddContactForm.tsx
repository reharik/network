import { ContactMethod, UpdateContact } from '@network/contracts';
import React, { useState } from 'react';
import { BaseApiError } from '../types/ApiResult';
import { FormError } from './FormError';
import { FormInput } from './FormInput';
import { Button, HStack, VStack } from './Primitives';

interface AddContactFormProps {
  onSubmit: (data: UpdateContact) => void;
  onCancel: () => void;
  isLoading?: boolean;
  errors?: BaseApiError[];
}

export const AddContactForm = ({
  onSubmit,
  onCancel,
  isLoading = false,
  errors = [],
}: AddContactFormProps) => {
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

        <FormError errors={errors} />

        <HStack gap={2}>
          <FormInput
            label="First Name"
            id="firstName"
            value={firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
            placeholder="First name"
            required
            disabled={isLoading}
            errors={errors}
          />
          <FormInput
            label="Last Name"
            id="lastName"
            value={lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
            placeholder="Last name"
            required
            disabled={isLoading}
            errors={errors}
          />
        </HStack>

        <HStack gap={2}>
          <FormInput
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="email@example.com"
            disabled={isLoading}
            errors={errors}
          />
          <FormInput
            label="Phone"
            id="phone"
            type="tel"
            value={phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
            placeholder="+1 (555) 123-4567"
            disabled={isLoading}
            errors={errors}
          />
        </HStack>

        <HStack gap={2}>
          <FormInput
            label="Preferred Method"
            id="preferredMethod"
            as="select"
            value={preferredMethod.value}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setPreferredMethod(ContactMethod.fromValue(e.target.value))
            }
            disabled={isLoading}
            errors={errors}
          >
            {ContactMethod.toOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FormInput>
          <FormInput
            label="Interval (days)"
            id="intervalDays"
            type="number"
            min="1"
            max="365"
            value={intervalDays}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setIntervalDays(parseInt(e.target.value) || 30)
            }
            disabled={isLoading}
            errors={errors}
          />
        </HStack>

        <FormInput
          label="Notes"
          id="notes"
          as="textarea"
          value={notes}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
          placeholder="Any additional notes about this contact..."
          disabled={isLoading}
          errors={errors}
        />

        <FormInput
          label="Default Message"
          id="suggestion"
          as="textarea"
          value={suggestion}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSuggestion(e.target.value)}
          placeholder="Default message template (use {{firstName}} for personalization)"
          disabled={isLoading}
          errors={errors}
        />

        <HStack>
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
