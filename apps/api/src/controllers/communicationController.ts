import { RESOLVER } from 'awilix';
import type { Context } from 'koa';
import { config } from '../config';
import type { Container } from '../container';

export interface CommunicationController {
  sendEmail: (ctx: Context) => Promise<Context>;
  sendSms: (ctx: Context) => Promise<Context>;
  makeCall: (ctx: Context) => Promise<Context>;
}

export const createCommunicationController = ({
  emailService,
  smsService,
  voiceService,
  userRepository,
}: Container): CommunicationController => ({
  sendEmail: async (ctx: Context): Promise<Context> => {
    const { to, subject, body } = ctx.request.body as {
      to: string;
      subject: string;
      body: string;
    };

    if (!to || !subject || !body) {
      ctx.status = 400;
      ctx.body = { error: 'Missing required fields: to, subject, body' };
      return ctx;
    }

    // Get user's email to use as from address
    const user = await userRepository.getUser(ctx.user.id);
    const fromEmail = user?.email;

    const result = await emailService.sendEmail(to, subject, body, fromEmail);

    if (result.success) {
      ctx.status = 200;
      ctx.body = { message: 'Email sent successfully', messageId: result.data.messageId };
    } else {
      ctx.status = 500;
      ctx.body = { error: 'Failed to send email', details: result.errors };
    }

    return ctx;
  },

  sendSms: async (ctx: Context): Promise<Context> => {
    const { to, message } = ctx.request.body as {
      to: string;
      message: string;
    };

    if (!to || !message) {
      ctx.status = 400;
      ctx.body = { error: 'Missing required fields: to, message' };
      return ctx;
    }

    // Get user's email and name to use for email handoff
    const user = await userRepository.getUser(ctx.user.id);
    const userEmail = user?.email;
    const userFirstName = user?.firstName;

    if (!userEmail) {
      ctx.status = 400;
      ctx.body = { error: 'User email not found. Cannot send SMS handoff email.' };
      return ctx;
    }

    const result = await smsService.sendSms(to, message, userEmail, userFirstName);

    if (result.success) {
      ctx.status = 200;
      ctx.body = { message: 'SMS sent successfully', messageId: result.data.messageId };
    } else {
      ctx.status = 500;
      ctx.body = { error: 'Failed to send SMS', details: result.errors };
    }

    return ctx;
  },
  makeCall: async (ctx: Context): Promise<Context> => {
    const { to, from } = ctx.request.body as {
      to: string;
      from?: string;
    };

    if (!to) {
      ctx.status = 400;
      ctx.body = { error: 'Missing required field: to' };
      return ctx;
    }

    // Get user's phone number to use as from address, or use provided from
    let fromNumber = from;
    if (!fromNumber) {
      // Use the configured SMS from number as fallback since User doesn't have phone
      fromNumber = config.smsFromNumber;
    }

    const result = await voiceService.makeCall(to, fromNumber);

    if (result.success) {
      ctx.status = 200;
      ctx.body = { message: 'Voice call initiated successfully', contactId: result.data.contactId };
    } else {
      ctx.status = 500;
      ctx.body = { error: 'Failed to initiate voice call', details: result.errors };
    }

    return ctx;
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
(createCommunicationController as any)[RESOLVER] = { lifetime: 'SINGLETON' };
