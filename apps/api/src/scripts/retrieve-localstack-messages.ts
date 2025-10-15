#!/usr/bin/env node

/**
 * LocalStack Message Retriever
 *
 * This script retrieves actual messages from LocalStack
 * to verify that SES and SNS are working correctly.
 */

const LOCALSTACK_ENDPOINT = 'http://localhost:4566';

const retrieveSESMessages = async () => {
  console.log('📧 Retrieving SES (Email) Messages from LocalStack...');
  try {
    // Try the correct LocalStack SES endpoint
    const response = await fetch(`${LOCALSTACK_ENDPOINT}/_aws/ses`);

    if (response.status === 404) {
      console.log(
        '❌ SES endpoint not available - LocalStack might not be running or SES not enabled',
      );
      return;
    }

    if (!response.ok) {
      console.log(`❌ Failed to retrieve SES messages: ${response.status} ${response.statusText}`);
      console.log(`   Response text: ${await response.text()}`);
      return;
    }

    const data = await response.json();
    console.log('✅ SES Messages retrieved successfully');
    console.log('📧 SES Messages:', JSON.stringify(data, null, 2));
    if (Array.isArray(data.messages) && data.messages.length > 0) {
      console.log(`📧 Found ${data.messages.length} email(s)`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.messages.forEach((email: any, index: number) => {
        console.log(`  ${index + 1}. From: ${email.Source}`);
        console.log(`     To: ${email.Destination?.ToAddresses?.join(', ')}`);
        console.log(`     Subject: ${email.Message?.Subject?.Data}`);
        console.log(`     Message ID: ${email.MessageId}`);
        console.log('');
      });
    } else {
      console.log('📧 No emails found in LocalStack');
      console.log('   This could mean:');
      console.log('   - No emails have been sent yet');
      console.log('   - Emails were sent but not stored');
      console.log('   - Try sending a test email first with: npm run test:communication');
    }
  } catch (error) {
    console.error('❌ Error retrieving SES messages:', error);
  }
};

const retrieveSNSMessages = async () => {
  console.log('\n📱 Retrieving SNS (SMS) Messages from LocalStack...');
  try {
    const response = await fetch(`${LOCALSTACK_ENDPOINT}/_aws/sns/sms-messages`);

    if (response.status === 404) {
      console.log(
        '❌ SNS SMS endpoint not available - LocalStack might not be running or SNS not enabled',
      );
      return;
    }

    if (!response.ok) {
      console.log(`❌ Failed to retrieve SNS messages: ${response.status} ${response.statusText}`);
      return;
    }

    const data = await response.json();
    console.log('✅ SNS Messages retrieved successfully');
    console.log('📱 SNS Messages:', JSON.stringify(data, null, 2));

    if (data.sms_messages && Object.keys(data.sms_messages).length > 0) {
      let totalMessages = 0;
      Object.values(data.sms_messages).forEach((messages: unknown) => {
        if (Array.isArray(messages)) {
          totalMessages += messages.length;
        }
      });

      console.log(
        `📱 Found ${totalMessages} SMS message(s) across ${Object.keys(data.sms_messages).length} phone number(s)`,
      );

      Object.entries(data.sms_messages).forEach(([phoneNumber, messages]: [string, unknown]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          console.log(`\n  📞 Phone: ${phoneNumber} (${messages.length} messages)`);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          messages.forEach((sms: any, index: number) => {
            console.log(`    ${index + 1}. Message: ${sms.Message || sms.message || 'N/A'}`);
            console.log(`       Message ID: ${sms.MessageId || sms.messageId || 'N/A'}`);
            console.log(`       Timestamp: ${sms.Timestamp || sms.timestamp || 'N/A'}`);
            console.log('');
          });
        }
      });
    } else {
      console.log('📱 No SMS messages found in LocalStack');
    }
  } catch (error) {
    console.error('❌ Error retrieving SNS messages:', error);
  }
};

const checkLocalStackHealth = async () => {
  console.log('🔍 Checking LocalStack health...');
  try {
    const response = await fetch(`${LOCALSTACK_ENDPOINT}/_localstack/health`);
    const health = await response.json();

    console.log('🏥 LocalStack Health:', JSON.stringify(health, null, 2));

    if (health.services?.ses === 'running' && health.services?.sns === 'running') {
      console.log('✅ LocalStack is healthy - SES and SNS are running');
      return true;
    } else {
      console.log('❌ LocalStack services not ready');
      return false;
    }
  } catch (error) {
    console.error('❌ Cannot connect to LocalStack:', error);
    return false;
  }
};

const main = async () => {
  console.log('🔍 LocalStack Message Retriever');
  console.log('================================');

  const isHealthy = await checkLocalStackHealth();

  if (!isHealthy) {
    console.log('\n❌ LocalStack is not running properly. Please start it first.');
    console.log('   Run: docker-compose -f docker-compose-dev.yml up localstack -d');
    process.exit(1);
  }

  await retrieveSESMessages();
  await retrieveSNSMessages();

  console.log('\n📝 Note:');
  console.log('- These are actual messages retrieved from LocalStack');
  console.log('- If no messages are found, send some emails/SMS first');
  console.log('- This proves LocalStack is working correctly');
};

main().catch(console.error);
