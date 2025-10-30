import { ContactMethod } from '@network/contracts';
import React, { useState } from 'react';
import { BaseApiError } from '../types/ApiResult';
import { FormError } from './FormError';
import { FormInput } from './FormInput';
import { Button, HStack, VStack } from './Primitives';

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
  errors?: BaseApiError[];
}

export const TouchForm = ({
  contactName,
  initialMessage,
  onSubmit,
  onCancel,
  isLoading = false,
  errors =[]
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

        <FormError errors={errors} />

        <FormInput
          label="Method"
          id="method"
          as="select"
          value={method}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMethod(e.target.value)}
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
          label="Message"
          id="message"
          as="textarea"
          value={message}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
          placeholder="Enter the message you sent..."
          disabled={isLoading}
          errors={errors}
        />

        <FormInput
          label="Outcome (optional)"
          id="outcome"
          value={outcome}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOutcome(e.target.value)}
          placeholder="e.g., 'Had a great conversation', 'Left voicemail', 'No response'"
          disabled={isLoading}
          errors={errors}
        />

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
