import { ContactMethod } from '@network/contracts';
import React, { useState } from 'react';
import { Button, Field, HStack, Input, Select, TextArea, VStack } from './Primitives';

interface TouchFormData {
  method: string;
  message: string;
  outcome: string;
}

interface TouchFormProps {
  contactName: string;
  initialMessage: string;
  onSubmit: (data: TouchFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TouchForm = ({
  contactName,
  initialMessage,
  onSubmit,
  onCancel,
  isLoading = false,
}: TouchFormProps) => {
  const [method, setMethod] = useState<string>('EMAIL');
  const [message, setMessage] = useState(initialMessage);
  const [outcome, setOutcome] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ method, message, outcome });
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap={3}>
        <div>
          <strong>Mark Done: {contactName}</strong>
        </div>

        <Field label="Method">
          <Select value={method} onChange={(e) => setMethod(e.target.value)} disabled={isLoading}>
            {ContactMethod.toOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Message">
          <TextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter the message you sent..."
            disabled={isLoading}
          />
        </Field>

        <Field label="Outcome (optional)">
          <Input
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            placeholder="e.g., 'Had a great conversation', 'Left voicemail', 'No response'"
            disabled={isLoading}
          />
        </Field>

        <HStack>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Mark Done'}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};
