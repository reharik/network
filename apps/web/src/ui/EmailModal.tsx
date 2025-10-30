import { useState } from 'react';
import { FormInput } from './FormInput';
import { Button, Field, HStack, VStack } from './Primitives';

interface EmailModalProps {
  contactName: string;
  contactEmail: string;
  initialSubject?: string;
  initialBody?: string;
  onSubmit: (data: { subject: string; body: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const EmailModal = ({
  contactName,
  contactEmail,
  initialSubject = '',
  initialBody = '',
  onSubmit,
  onCancel,
  isLoading = false,
}: EmailModalProps) => {
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ subject, body });
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap={3}>
        <div>
          <strong>Send Email to {contactName}</strong>
          <p style={{ color: '#a8b3c7', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
            To: {contactEmail}
          </p>
        </div>

        <Field label="Subject">
          <FormInput
            value={subject}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
            placeholder="Email subject"
            disabled={isLoading}
            required
          />
        </Field>

        <Field label="Message">
          <FormInput
            as="textarea"
            value={body}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value)}
            placeholder="Your message here..."
            disabled={isLoading}
            required
            rows={6}
          />
        </Field>

        <HStack>
          <Button type="submit" disabled={isLoading || !subject || !body}>
            {isLoading ? 'Sending...' : 'Send Email'}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};
