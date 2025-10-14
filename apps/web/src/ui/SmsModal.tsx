import { useState } from 'react';
import { Button, Field, HStack, TextArea, VStack } from './Primitives';

interface SmsModalProps {
  contactName: string;
  contactPhone: string;
  initialMessage?: string;
  onSubmit: (data: { message: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const SmsModal = ({
  contactName,
  contactPhone,
  initialMessage = '',
  onSubmit,
  onCancel,
  isLoading = false,
}: SmsModalProps) => {
  const [message, setMessage] = useState(initialMessage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ message });
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap={3}>
        <div>
          <strong>Send SMS to {contactName}</strong>
          <p style={{ color: '#a8b3c7', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
            To: {contactPhone}
          </p>
        </div>

        <Field label="Message">
          <TextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your SMS message here..."
            disabled={isLoading}
            required
            rows={4}
          />
        </Field>

        <HStack>
          <Button type="submit" disabled={isLoading || !message}>
            {isLoading ? 'Sending...' : 'Send SMS'}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};
