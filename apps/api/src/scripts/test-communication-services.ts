#!/usr/bin/env node

/**
 * Communication Services Test Script
 *
 * This script tests the email, SMS, and voice services
 * to ensure they work correctly with LocalStack.
 */

import { SESClient, SendEmailCommand, VerifyEmailIdentityCommand } from '@aws-sdk/client-ses';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { testContainer } from '../tests/testContainer';

const LOCALSTACK_ENDPOINT = 'http://localhost:4566';
const AWS_REGION = 'us-east-1';

// Create clients with LocalStack configuration
const sesClient = new SESClient({
  region: AWS_REGION,
  endpoint: LOCALSTACK_ENDPOINT,
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
});

const snsClient = new SNSClient({
  region: AWS_REGION,
  endpoint: LOCALSTACK_ENDPOINT,
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
});

// Voice service will be tested through the container using mock implementation

const testEmailService = async () => {
  console.log('📧 Testing Email Service...');
  try {
    // First verify the email address in LocalStack
    const verifyCommand = new VerifyEmailIdentityCommand({
      EmailAddress: 'test@example.com',
    });
    await sesClient.send(verifyCommand);
    console.log('✅ Email address verified in LocalStack');

    const command = new SendEmailCommand({
      Source: 'test@example.com',
      Destination: {
        ToAddresses: ['recipient@example.com'],
      },
      Message: {
        Subject: {
          Data: 'Test Email from LocalStack',
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: 'This is a test email sent through LocalStack. No real email was sent!',
            Charset: 'UTF-8',
          },
        },
      },
    });

    const result = await sesClient.send(command);
    console.log('✅ Email sent successfully!');
    console.log('   Message ID:', result.MessageId);
    console.log('   Note: Email stored in LocalStack (no web UI available)');
  } catch (error) {
    console.error('❌ Email test failed:', error);
  }
};

const testSMSService = async () => {
  console.log('\n📱 Testing SMS Service...');
  try {
    const command = new PublishCommand({
      PhoneNumber: '+1234567890',
      Message: 'Test SMS from LocalStack. No real SMS was sent!',
    });

    const result = await snsClient.send(command);
    console.log('✅ SMS sent successfully!');
    console.log('   Message ID:', result.MessageId);
    console.log('   Note: SMS stored in LocalStack (no web UI available)');
  } catch (error) {
    console.error('❌ SMS test failed:', error);
  }
};

const testVoiceService = async () => {
  console.log('\n📞 Testing Voice Service...');
  try {
    // Use the test container which has the mock voice service
    const voiceService = testContainer.resolve('voiceService');

    console.log('📞 Testing voice service through container (using mock)...');

    const result = await voiceService.makeCall('+1234567890', '+0987654321');

    if (result.success && result.data) {
      console.log(`✅ Voice call successful! Contact ID: ${result.data.contactId}`);
    } else if (!result.success) {
      console.log(`❌ Voice call failed: ${result.errors.join(', ')}`);
    } else {
      console.log('❌ Voice call failed: Unknown error');
    }
  } catch (error) {
    console.error('❌ Voice test failed:', error);
  }
};

const checkLocalStackConnection = async () => {
  console.log('🔍 Checking LocalStack connection...');
  try {
    const response = await fetch(`${LOCALSTACK_ENDPOINT}/_localstack/health`);
    const health = (await response.json()) as { services?: { ses?: string; sns?: string } };

    // Check for SES and SNS (Connect is not supported by LocalStack)
    if (health.services?.ses === 'running' && health.services?.sns === 'running') {
      console.log('✅ LocalStack is running and healthy');
      console.log('📧 SES: Available');
      console.log('📱 SNS: Available');
      console.log('📞 Connect: Not supported by LocalStack (will use mock)');
      return true;
    } else {
      console.log('❌ LocalStack services not ready:', health);
      return false;
    }
  } catch (error) {
    console.error('❌ Cannot connect to LocalStack:', error);
    console.log('   Make sure LocalStack is running: npm run localstack:setup');
    return false;
  }
};

const main = async () => {
  console.log('🧪 Communication Services Test Suite');
  console.log('=====================================');

  const isConnected = await checkLocalStackConnection();

  if (!isConnected) {
    console.log('\n❌ Cannot proceed with tests. Please start LocalStack first.');
    process.exit(1);
  }

  await testEmailService();
  await testSMSService();
  await testVoiceService();

  console.log('\n🎉 All tests completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Check the LocalStack Web UI to see your test messages');
  console.log('2. Start your application: docker-compose -f docker-compose-dev.yml up');
  console.log('3. Test the communication features through your application UI');
  console.log('4. All messages will be stored locally - no real AWS services used!');
};

// Run the tests
main().catch(console.error);
