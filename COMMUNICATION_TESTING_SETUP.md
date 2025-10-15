# Communication Services Testing Setup

This guide explains how to set up and test email, SMS, and voice functionality using LocalStack for local development without incurring AWS charges or contacting real recipients.

## Overview

We use **LocalStack** to provide local AWS service emulation for testing:

- **Email**: Amazon SES (Simple Email Service)
- **SMS**: Amazon SNS (Simple Notification Service)
- **Voice**: Amazon Connect

All services run locally in Docker containers, so no real AWS accounts or billing is required for testing.

## Quick Start

### 1. Start LocalStack

```bash
# Start LocalStack service
docker-compose -f docker-compose-dev.yml up localstack -d

# Or use the npm script
cd apps/api
npm run localstack:setup
```

### 2. Verify LocalStack is Running

```bash
# Check LocalStack health and configuration
cd apps/api
npm run localstack:check
```

### 3. Start Your Application

```bash
# Start the full development environment
docker-compose -f docker-compose-dev.yml up
```

## Testing Your Communication Features

### Email Testing

1. **Send emails** through your application's UI or API
2. **View sent emails** at: http://localhost:4566/\_localstack/ses
3. **All emails are stored locally** - no real emails are sent

### SMS Testing

1. **Send SMS messages** through your application
2. **View SMS logs** at: http://localhost:4566/\_localstack/sns
3. **Messages are logged locally** - no real SMS are sent

### Voice Testing

1. **Initiate voice calls** through your application
2. **View call logs** at: http://localhost:4566/\_localstack/connect
3. **Calls are simulated locally** - no real calls are made

## LocalStack Web UI

Access the LocalStack dashboard at: http://localhost:4566/\_localstack/health

This provides:

- Service health status
- Configuration overview
- Access to individual service dashboards

## Environment Configuration

The following environment variables are automatically configured for LocalStack testing:

```bash
# AWS Configuration (LocalStack) - ONLY for testing!
AWS_ENDPOINT=http://localstack:4566  # ⚠️ DO NOT set in production!
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test

# Test Configuration
FROM_EMAIL=test@example.com
SMS_FROM_NUMBER=+1234567890
CONNECT_INSTANCE_ID=test-instance-id
CONNECT_CONTACT_FLOW_ID=test-contact-flow-id
```

### ⚠️ Important Production Warning

**NEVER set `AWS_ENDPOINT` in production!** If you do:

- All AWS requests will be sent to the specified endpoint instead of real AWS
- This will cause service failures and security issues
- The application will log warnings if this is detected

## Service Implementation Details

### Email Service (`emailService.ts`)

- Uses AWS SES SDK with LocalStack endpoint
- Automatically detects LocalStack environment
- Emails are stored in LocalStack's mock mailbox

### SMS Service (`smsService.ts`)

- Uses AWS SNS SDK with LocalStack endpoint
- Messages are logged to LocalStack's SNS service
- No real SMS charges or delivery

### Voice Service (`voiceService.ts`)

- Uses AWS Connect SDK with LocalStack endpoint
- Call attempts are logged to LocalStack's Connect service
- No real voice calls or charges

## Troubleshooting

### LocalStack Not Starting

```bash
# Check Docker is running
docker --version

# Check LocalStack logs
docker logs network_localstack

# Restart LocalStack
docker-compose -f docker-compose-dev.yml restart localstack
```

### Services Not Connecting to LocalStack

1. Verify LocalStack is running: `npm run localstack:check`
2. Check environment variables are set correctly
3. Ensure `AWS_ENDPOINT` is configured in your environment

### Cannot Access Web UI

- Ensure LocalStack is running on port 4566
- Check firewall settings
- Try accessing: http://localhost:4566/\_localstack/health

## Production Deployment

When ready for production:

1. **Remove LocalStack configuration** from environment variables
2. **Set up real AWS accounts** for SES, SNS, and Connect
3. **Configure production environment variables**:
   - `AWS_ACCESS_KEY_ID` (real AWS credentials)
   - `AWS_SECRET_ACCESS_KEY` (real AWS credentials)
   - `FROM_EMAIL` (verified SES email address)
   - `SMS_FROM_NUMBER` (verified phone number)
   - `CONNECT_INSTANCE_ID` (real Connect instance)
   - `CONNECT_CONTACT_FLOW_ID` (real contact flow)

## Development Workflow

1. **Start LocalStack**: `npm run localstack:setup`
2. **Verify setup**: `npm run localstack:check`
3. **Start application**: `docker-compose -f docker-compose-dev.yml up`
4. **Test features** through your application UI
5. **Check results** in LocalStack Web UI
6. **Iterate and develop** without any AWS costs

## Benefits

✅ **No AWS charges** during development  
✅ **No real messages sent** to contacts  
✅ **Full feature testing** capability  
✅ **Local development** environment  
✅ **Easy debugging** with LocalStack logs  
✅ **Production-ready** code (just change endpoints)

This setup allows you to fully develop and test your communication features before setting up any AWS accounts or incurring any charges.
