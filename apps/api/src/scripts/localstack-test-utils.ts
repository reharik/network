#!/usr/bin/env node

/**
 * LocalStack Testing Utilities
 *
 * This script provides utilities to interact with LocalStack services
 * for testing email, SMS, and voice functionality.
 */

import { ConnectClient, ListInstancesCommand } from '@aws-sdk/client-connect';
import { ListIdentitiesCommand, SESClient } from '@aws-sdk/client-ses';
import { ListSubscriptionsCommand, ListTopicsCommand, SNSClient } from '@aws-sdk/client-sns';

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

const connectClient = new ConnectClient({
  region: AWS_REGION,
  endpoint: LOCALSTACK_ENDPOINT,
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
});

const checkLocalStackHealth = async () => {
  try {
    const response = await fetch(`${LOCALSTACK_ENDPOINT}/_localstack/health`);
    const health = await response.json();
    console.log('🏥 LocalStack Health Check:');
    console.log(JSON.stringify(health, null, 2));
    return health.services?.ses === 'running' && health.services?.sns === 'running';
  } catch (error) {
    console.error('❌ LocalStack is not running or not accessible:', error);
    return false;
  }
};

const setupEmailIdentities = async () => {
  console.log('\n📧 Setting up email identities...');
  try {
    const identities = await sesClient.send(new ListIdentitiesCommand({}));
    console.log('Current email identities:', identities.Identities);

    if (identities.Identities?.length === 0) {
      console.log(
        'ℹ️  No email identities found. In LocalStack, emails are sent to a mock mailbox.',
      );
      console.log('   You can view sent emails at: http://localhost:4566/_localstack/ses');
    }
  } catch (error) {
    console.error('Error checking email identities:', error);
  }
};

const checkSNSConfiguration = async () => {
  console.log('\n📱 Checking SNS configuration...');
  try {
    const topics = await snsClient.send(new ListTopicsCommand({}));
    console.log('SNS Topics:', topics.Topics);

    const subscriptions = await snsClient.send(new ListSubscriptionsCommand({}));
    console.log('SNS Subscriptions:', subscriptions.Subscriptions);
  } catch (error) {
    console.error('Error checking SNS configuration:', error);
  }
};

const checkConnectConfiguration = async () => {
  console.log('\n📞 Checking Connect configuration...');
  try {
    const instances = await connectClient.send(new ListInstancesCommand({}));
    console.log('Connect Instances:', instances.InstanceSummaryList);
  } catch (error) {
    console.error('Error checking Connect configuration:', error);
  }
};

const showLocalStackWebUI = () => {
  console.log('\n🌐 LocalStack Web UI:');
  console.log('   Main Dashboard: http://localhost:4566/_localstack/health');
  console.log('   SES Mailbox: http://localhost:4566/_localstack/ses');
  console.log('   SNS Messages: http://localhost:4566/_localstack/sns');
  console.log('   Connect Logs: http://localhost:4566/_localstack/connect');
};

const main = async () => {
  console.log('🚀 LocalStack Testing Utilities');
  console.log('================================');

  const isHealthy = await checkLocalStackHealth();

  if (!isHealthy) {
    console.log('\n❌ LocalStack is not running properly.');
    console.log(
      'Please start LocalStack with: docker-compose -f docker-compose-dev.yml up localstack',
    );
    process.exit(1);
  }

  await setupEmailIdentities();
  await checkSNSConfiguration();
  await checkConnectConfiguration();
  showLocalStackWebUI();

  console.log('\n✅ LocalStack is ready for testing!');
  console.log('\n📝 Testing Instructions:');
  console.log('1. Start your API: docker-compose -f docker-compose-dev.yml up api');
  console.log('2. Send test emails/SMS/voice calls through your application');
  console.log('3. Check the LocalStack Web UI links above to see sent messages');
  console.log('4. All messages are stored locally - no real AWS services are used');
};

// Run the main function
main().catch(console.error);
