#!/usr/bin/env node

/**
 * Production Communication Services Tester
 *
 * This script tests the communication services against real AWS services
 * instead of LocalStack. Use this to verify your AWS setup is working.
 */

import { config } from '../config';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testEmailService = async () => {
  console.log('📧 Testing Email Service (SES)...');

  try {
    const response = await fetch('http://localhost:3000/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // You'll need to get a real JWT token from your auth system
        Authorization: 'Bearer YOUR_JWT_TOKEN_HERE',
      },
      body: JSON.stringify({
        to: 'test@example.com', // Use a verified email in SES sandbox mode
        subject: 'Production Test Email',
        body: 'This is a test email from your production setup!',
      }),
    });

    if (response.ok) {
      const result = (await response.json()) as unknown;
      console.log('✅ Email sent successfully:', result);
    } else {
      const error = await response.text();
      console.log('❌ Email failed:', response.status, error);
    }
  } catch (error) {
    console.error('❌ Email test error:', error);
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testSmsService = async () => {
  console.log('\n📱 Testing SMS Service (SNS)...');

  try {
    const response = await fetch('http://localhost:3000/sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer YOUR_JWT_TOKEN_HERE',
      },
      body: JSON.stringify({
        to: '+1234567890', // Use a verified phone number
        message: 'Production test SMS from your app!',
      }),
    });

    if (response.ok) {
      const result = (await response.json()) as unknown;
      console.log('✅ SMS sent successfully:', result);
    } else {
      const error = await response.text();
      console.log('❌ SMS failed:', response.status, error);
    }
  } catch (error) {
    console.error('❌ SMS test error:', error);
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testVoiceService = async () => {
  console.log('\n📞 Testing Voice Service (Connect)...');

  try {
    const response = await fetch('http://localhost:3000/voice/call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer YOUR_JWT_TOKEN_HERE',
      },
      body: JSON.stringify({
        to: '+1234567890', // Use a verified phone number
      }),
    });

    if (response.ok) {
      const result = (await response.json()) as unknown;
      console.log('✅ Voice call initiated successfully:', result);
    } else {
      const error = await response.text();
      console.log('❌ Voice call failed:', response.status, error);
    }
  } catch (error) {
    console.error('❌ Voice test error:', error);
  }
};

const checkConfiguration = () => {
  console.log('🔍 Checking Production Configuration...');
  console.log('=====================================');

  console.log(`Node Environment: ${config.nodeEnv}`);
  console.log(`AWS Region: ${config.awsRegion}`);
  console.log(`AWS Endpoint: ${config.awsEndpoint || 'Not set (using real AWS)'}`);
  console.log(`From Email: ${config.fromEmail}`);
  console.log(`SMS From Number: ${config.smsFromNumber}`);
  console.log(`Connect Instance ID: ${config.connectInstanceId}`);
  console.log(`Connect Contact Flow ID: ${config.connectContactFlowId}`);

  // Check for production warnings
  if (config.awsEndpoint) {
    console.log(
      '\n⚠️  WARNING: AWS_ENDPOINT is set! This will use LocalStack instead of real AWS.',
    );
  }

  if (!config.awsAccessKeyId || !config.awsSecretAccessKey) {
    console.log('\n⚠️  WARNING: AWS credentials not configured!');
  }

  if (config.connectInstanceId === '' || config.connectContactFlowId === '') {
    console.log('\n⚠️  WARNING: Connect configuration incomplete!');
  }

  console.log('\n');
};

// eslint-disable-next-line @typescript-eslint/require-await
const main = async () => {
  console.log('🚀 Production Communication Services Tester');
  console.log('============================================');

  checkConfiguration();

  console.log('📝 Instructions:');
  console.log('1. Make sure your app is running: npm run dev');
  console.log('2. Replace YOUR_JWT_TOKEN_HERE with a real JWT token');
  console.log('3. Update test phone numbers and emails to verified ones');
  console.log('4. Run this script to test your AWS services');
  console.log('\n');

  // Uncomment these lines when ready to test:
  // await testEmailService();
  // await testSmsService();
  // await testVoiceService();

  console.log('💡 To run tests, uncomment the test functions in this script.');
};

main().catch(console.error);
