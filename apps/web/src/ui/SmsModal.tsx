import { useEffect, useState } from 'react';
import { BaseApiError } from '../types/ApiResult';
import { FormError } from './FormError';
import { FormInput } from './FormInput';
import { Button, HStack, VStack } from './Primitives';

interface SmsModalProps {
  contactName: string;
  contactPhone: string;
  contactPhones?: string[];
  initialMessage?: string;
  onSubmit: (data: { message: string; to?: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  errors?: BaseApiError[];
}

export const SmsModal = ({
  contactName,
  contactPhone,
  contactPhones,
  initialMessage = '',
  onSubmit,
  onCancel,
  isLoading = false,
  errors = [],
}: SmsModalProps) => {
  const phones = contactPhones?.length ? contactPhones : contactPhone ? [contactPhone] : [];
  const [message, setMessage] = useState(initialMessage);
  const [selectedTo, setSelectedTo] = useState(contactPhone || phones[0] || '');

  useEffect(() => {
    setMessage(initialMessage);
  }, [initialMessage]);
  useEffect(() => {
    setSelectedTo(contactPhone || phones[0] || '');
  }, [contactPhone, phones]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ message, to: selectedTo || contactPhone });
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap={3}>
        <div>
          <strong>Send SMS to {contactName}</strong>
          {phones.length > 1 ? (
            <p style={{ color: '#a8b3c7', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
              <label>
                To:{' '}
                <select
                  value={selectedTo}
                  onChange={(e) => setSelectedTo(e.target.value)}
                  disabled={isLoading}
                  style={{ marginLeft: 4 }}
                >
                  {phones.map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </label>
            </p>
          ) : (
            <p style={{ color: '#a8b3c7', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
              To: {contactPhone}
            </p>
          )}
        </div>

        <FormError errors={errors} />

        <FormInput
          label="Message"
          id="message"
          as="textarea"
          value={message}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
          placeholder="Your SMS message here..."
          disabled={isLoading}
          errors={errors}
          rows={4}
        />

        <HStack>
          <Button type="submit" disabled={isLoading}>
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
