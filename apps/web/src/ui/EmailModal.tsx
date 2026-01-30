import { useEffect, useState } from 'react';
import { BaseApiError } from '../types/ApiResult';
import { FormError } from './FormError';
import { FormInput } from './FormInput';
import { Button, HStack, VStack } from './Primitives';

interface EmailModalProps {
  contactName: string;
  /** Primary (default) email */
  contactEmail: string;
  /** All emails for this contact (when multiple, user can choose) */
  contactEmails?: string[];
  initialSubject?: string;
  initialBody?: string;
  onSubmit: (data: { subject: string; body: string; sendCopyToMe?: boolean; to?: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  errors?: BaseApiError[];
}

export const EmailModal = ({
  contactName,
  contactEmail,
  contactEmails,
  initialSubject = '',
  initialBody = '',
  onSubmit,
  onCancel,
  isLoading = false,
  errors = [],
}: EmailModalProps) => {
  const emails = contactEmails?.length ? contactEmails : contactEmail ? [contactEmail] : [];
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [sendCopyToMe, setSendCopyToMe] = useState(false);
  const [selectedTo, setSelectedTo] = useState(contactEmail || emails[0] || '');

  useEffect(() => {
    setSubject(initialSubject);
  }, [initialSubject]);
  useEffect(() => {
    setBody(initialBody);
  }, [initialBody]);
  useEffect(() => {
    setSelectedTo(contactEmail || emails[0] || '');
  }, [contactEmail, emails]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ subject, body, sendCopyToMe, to: selectedTo || contactEmail });
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap={3}>
        <div>
          <strong>Send Email to {contactName}</strong>
          {emails.length > 1 ? (
            <p style={{ color: '#a8b3c7', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
              <label>
                To:{' '}
                <select
                  value={selectedTo}
                  onChange={(e) => setSelectedTo(e.target.value)}
                  disabled={isLoading}
                  style={{ marginLeft: 4 }}
                >
                  {emails.map((addr) => (
                    <option key={addr} value={addr}>
                      {addr}
                    </option>
                  ))}
                </select>
              </label>
            </p>
          ) : (
            <p style={{ color: '#a8b3c7', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
              To: {contactEmail}
            </p>
          )}
        </div>

        <FormError errors={errors} />

        <FormInput
          label="Subject"
          id="subject"
          value={subject}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
          placeholder="Email subject"
          disabled={isLoading}
          errors={errors}
        />

        <FormInput
          label="Message"
          id="body"
          as="textarea"
          value={body}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value)}
          placeholder="Your message here..."
          disabled={isLoading}
          errors={errors}
          rows={6}
        />

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={sendCopyToMe}
            onChange={(e) => setSendCopyToMe(e.target.checked)}
            disabled={isLoading}
          />
          <span>Send me a copy</span>
        </label>

        <HStack>
          <Button type="submit" disabled={isLoading}>
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
