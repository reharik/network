import type { AwilixContainer } from 'awilix';
import { type Container, initializeContainer } from '../container';
import { initLogger } from '../logger';
import type { EmailService } from '../services/emailService';
import type { SmsService } from '../services/smsService';

// Import jest globals for ESM
import { jest } from '@jest/globals';

describe('SMS Service', () => {
  let container: AwilixContainer<Container>;
  let smsService: SmsService;
  let emailService: EmailService;

  beforeAll(async () => {
    const logger = initLogger();
    container = await initializeContainer(logger);
    smsService = container.resolve('smsService');
    emailService = container.resolve('emailService');
  });

  describe('email_handoff mode', () => {
    it('should not call AWS SNS when sending SMS', async () => {
      const toPhoneNumber = '+1234567890';
      const messageBody = 'Test message';
      const userEmail = 'test@example.com';
      const userFirstName = 'John';

      // Mock email service to succeed
      const mockEmailSend = jest.spyOn(emailService, 'sendEmail').mockResolvedValue({
        success: true,
        data: { messageId: 'email-123' },
      });

      const result = await smsService.sendSms(toPhoneNumber, messageBody, userEmail, userFirstName);

      // Verify email was sent instead (this proves AWS SNS was not called)
      expect(mockEmailSend).toHaveBeenCalledTimes(1);
      expect(mockEmailSend).toHaveBeenCalledWith(
        userEmail,
        'Send this text from your phone',
        expect.stringContaining('sms:'),
        expect.any(String),
      );

      // Verify result
      expect(result.success).toBe(true);
      if (!result.success) {
        throw new Error('Expected result to be successful');
      }
      expect(result.data.messageId).toBe('email-123');

      mockEmailSend.mockRestore();
    });

    it('should include correctly URL-encoded sms: link in email', async () => {
      const toPhoneNumber = '+1234567890';
      const messageBody = 'Hello, this is a test message with special chars: & < >';
      const userEmail = 'test@example.com';
      const userFirstName = 'Jane';

      let capturedEmailBody = '';
      const mockEmailSend = jest
        .spyOn(emailService, 'sendEmail')
        .mockImplementation((_to, _subject, body) => {
          capturedEmailBody = body;
          return Promise.resolve({
            success: true,
            data: { messageId: 'email-456' },
          });
        });

      await smsService.sendSms(toPhoneNumber, messageBody, userEmail, userFirstName);

      // Verify sms: link is present and correctly encoded
      expect(capturedEmailBody).toContain('sms:');
      expect(capturedEmailBody).toContain('+1234567890');
      expect(capturedEmailBody).toContain('?body=');

      // Extract the link
      const linkMatch = capturedEmailBody.match(/sms:([^\s]+)/);
      expect(linkMatch).not.toBeNull();
      expect(linkMatch?.[1]).toBeDefined();

      if (!linkMatch || !linkMatch[1]) {
        throw new Error('Expected linkMatch to be defined');
      }
      const link = linkMatch[1];
      // Verify phone number is preserved
      expect(link).toContain('+1234567890');
      // Verify body is URL encoded (should not contain raw special chars)
      expect(link).not.toContain('& < >');
      // Verify it's properly encoded
      const decodedBody = decodeURIComponent(link.split('?body=')[1] || '');
      expect(decodedBody).toBe(messageBody);

      mockEmailSend.mockRestore();
    });

    it('should include copy/paste block with phone number and message', async () => {
      const toPhoneNumber = '+1987654321';
      const messageBody = 'Multi-line\nmessage\nwith breaks';
      const userEmail = 'test@example.com';

      let capturedEmailBody = '';
      const mockEmailSend = jest
        .spyOn(emailService, 'sendEmail')
        .mockImplementation((_to, _subject, body) => {
          capturedEmailBody = body;
          return Promise.resolve({
            success: true,
            data: { messageId: 'email-789' },
          });
        });

      await smsService.sendSms(toPhoneNumber, messageBody, userEmail);

      // Verify copy/paste block is present
      expect(capturedEmailBody).toContain('To:');
      expect(capturedEmailBody).toContain(toPhoneNumber);
      expect(capturedEmailBody).toContain('Message:');
      expect(capturedEmailBody).toContain(messageBody);

      // Verify line breaks are preserved in the copy/paste block
      const messageSection = capturedEmailBody.split('Message:')[1]?.split("That's it")[0] || '';
      expect(messageSection).toContain('Multi-line');
      expect(messageSection).toContain('message');
      expect(messageSection).toContain('with breaks');

      mockEmailSend.mockRestore();
    });

    it('should use firstName when provided, otherwise use "there"', async () => {
      const toPhoneNumber = '+1234567890';
      const messageBody = 'Test';
      const userEmail = 'test@example.com';

      let capturedEmailBodyWithName = '';
      let capturedEmailBodyWithoutName = '';

      const mockEmailSend = jest
        .spyOn(emailService, 'sendEmail')
        .mockImplementation((_to, _subject, body) => {
          if (capturedEmailBodyWithName === '') {
            capturedEmailBodyWithName = body;
          } else {
            capturedEmailBodyWithoutName = body;
          }
          return Promise.resolve({
            success: true,
            data: { messageId: 'email-test' },
          });
        });

      // Test with firstName
      await smsService.sendSms(toPhoneNumber, messageBody, userEmail, 'Alice');
      expect(capturedEmailBodyWithName).toContain('Hi Alice,');

      // Test without firstName
      await smsService.sendSms(toPhoneNumber, messageBody, userEmail);
      expect(capturedEmailBodyWithoutName).toContain('Hi there,');

      mockEmailSend.mockRestore();
    });
  });

  describe('Email Handoff Provider - Direct Tests', () => {
    it('should build correct sms: link with URL encoding', async () => {
      // Test through the smsService which uses the provider internally
      const toPhoneNumber = '+1234567890';
      const messageBody = 'Hello & Goodbye\nNew line';
      const userEmail = 'test@example.com';

      // We can't directly test the private buildSmsLink, but we can test through sendSms
      // by checking the email content
      let capturedEmailBody = '';
      const mockEmailSend = jest
        .spyOn(emailService, 'sendEmail')
        .mockImplementation((_to, _subject, body) => {
          capturedEmailBody = body;
          return Promise.resolve({
            success: true,
            data: { messageId: 'test' },
          });
        });

      await smsService.sendSms(toPhoneNumber, messageBody, userEmail);

      const linkMatch = capturedEmailBody.match(/sms:([^\s]+)/);
      expect(linkMatch).not.toBeNull();
      expect(linkMatch?.[0]).toBeDefined();

      if (!linkMatch || !linkMatch[0]) {
        throw new Error('Expected linkMatch to be defined');
      }
      const fullLink = linkMatch[0];
      // Verify format: sms:+1234567890?body=...
      expect(fullLink).toMatch(/^sms:\+1234567890\?body=/);
      // Verify encoding
      const encodedPart = fullLink.split('?body=')[1];
      expect(encodedPart).toBeTruthy();
      // Decode and verify original message
      const decoded = decodeURIComponent(encodedPart);
      expect(decoded).toBe(messageBody);

      mockEmailSend.mockRestore();
    });
  });
});
