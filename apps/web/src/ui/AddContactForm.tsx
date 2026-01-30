import { ContactMethod, UpdateContact } from '@network/contracts';
import React, { useState } from 'react';
import { config } from '../config';
import { BaseApiError } from '../types/ApiResult';
import { FormError } from './FormError';
import { FormInput } from './FormInput';
import { PhoneInput } from './PhoneInput';
import { Button, HStack, VStack } from './Primitives';

interface AddContactFormProps {
  onSubmit: (data: UpdateContact) => void;
  onCancel: () => void;
  isLoading?: boolean;
  errors?: BaseApiError[];
  /** User defaults from Settings (overrides config when provided) */
  defaultContactMessage?: string;
  defaultIntervalDays?: number;
  defaultPreferredMethod?: string;
}

type EmailEntry = { value: string; isDefault: boolean };
type PhoneEntry = { value: string; isDefault: boolean };

export const AddContactForm = ({
  onSubmit,
  onCancel,
  isLoading = false,
  errors = [],
  defaultContactMessage: userDefaultMessage,
  defaultIntervalDays: userDefaultInterval,
  defaultPreferredMethod: userDefaultMethod,
}: AddContactFormProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emails, setEmails] = useState<EmailEntry[]>([{ value: '', isDefault: true }]);
  const [phones, setPhones] = useState<PhoneEntry[]>([{ value: '', isDefault: true }]);
  const [notes, setNotes] = useState('');
  const [suggestion, setSuggestion] = useState(userDefaultMessage ?? config.defaultContactMessage);
  const [preferredMethod, setPreferredMethod] = useState<ContactMethod>(
    ContactMethod.fromValue(userDefaultMethod ?? config.defaultPreferredMethod) ||
      ContactMethod.email,
  );
  const [intervalDays, setIntervalDays] = useState(
    userDefaultInterval ?? config.defaultIntervalDays,
  );

  const setEmailDefault = (index: number) => {
    setEmails((prev) => prev.map((e, i) => ({ ...e, isDefault: i === index })));
  };
  const setPhoneDefault = (index: number) => {
    setPhones((prev) => prev.map((p, i) => ({ ...p, isDefault: i === index })));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailList = emails
      .map((e) => e.value.trim())
      .filter(Boolean)
      .map((value, i) => ({ email: value, isDefault: i === 0 || emails[i]?.isDefault }));
    const phoneList = phones
      .map((p) => p.value.trim())
      .filter(Boolean)
      .map((value, i) => ({ phone: value, isDefault: i === 0 || phones[i]?.isDefault }));
    if (emailList.length === 1) emailList[0].isDefault = true;
    if (phoneList.length === 1) phoneList[0].isDefault = true;

    const contactData = {
      firstName,
      lastName,
      ...(emailList.length && { emails: emailList }),
      ...(phoneList.length && { phones: phoneList }),
      notes: notes || undefined,
      suggestion,
      preferredMethod,
      intervalDays,
      paused: false,
    } as UpdateContact;

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

        <VStack gap={2}>
          <strong style={{ fontSize: '0.9rem' }}>Emails</strong>
          {emails.map((entry, index) => (
            <HStack key={index} gap={2} wrap>
              <FormInput
                type="email"
                value={entry.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmails((prev) =>
                    prev.map((entry, i) =>
                      i === index ? { ...entry, value: e.target.value } : entry,
                    ),
                  )
                }
                placeholder="email@example.com"
                disabled={isLoading}
                errors={errors}
              />
              <label
                style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
              >
                <input
                  type="radio"
                  name="defaultEmail"
                  checked={entry.isDefault}
                  onChange={() => setEmailDefault(index)}
                  disabled={isLoading}
                />
                Default
              </label>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  setEmails((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))
                }
                disabled={isLoading || emails.length <= 1}
              >
                Remove
              </Button>
            </HStack>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setEmails((prev) => [...prev, { value: '', isDefault: false }])}
            disabled={isLoading}
          >
            + Add email
          </Button>
        </VStack>

        <VStack gap={2}>
          <strong style={{ fontSize: '0.9rem' }}>Phones</strong>
          {phones.map((entry, index) => (
            <HStack key={index} gap={2} wrap>
              <PhoneInput
                value={entry.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPhones((prev) =>
                    prev.map((entry, i) =>
                      i === index ? { ...entry, value: e.target.value } : entry,
                    ),
                  )
                }
                disabled={isLoading}
                errors={errors}
              />
              <label
                style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
              >
                <input
                  type="radio"
                  name="defaultPhone"
                  checked={entry.isDefault}
                  onChange={() => setPhoneDefault(index)}
                  disabled={isLoading}
                />
                Default
              </label>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  setPhones((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))
                }
                disabled={isLoading || phones.length <= 1}
              >
                Remove
              </Button>
            </HStack>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setPhones((prev) => [...prev, { value: '', isDefault: false }])}
            disabled={isLoading}
          >
            + Add phone
          </Button>
        </VStack>

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
              setIntervalDays(
                (parseInt(e.target.value, 10) || userDefaultInterval) ?? config.defaultIntervalDays,
              )
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
