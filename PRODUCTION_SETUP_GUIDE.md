# Production Environment Setup Guide

## Environment Variables Required

Create a `.env` file in `apps/api/` with these variables:

```bash
# Application Configuration
NODE_ENV=production
PORT=3000

# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-db-password
POSTGRES_DB=network_prod

# JWT Security (CHANGE THIS!)
JWT_SECRET=your-very-secure-jwt-secret-key-change-this-in-production

# CORS Configuration
CORS_ORIGIN=http://localhost:8080

# AWS Configuration (REAL AWS - NO LocalStack!)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-real-aws-access-key
AWS_SECRET_ACCESS_KEY=your-real-aws-secret-key
# ⚠️ DO NOT SET AWS_ENDPOINT in production!

# Email Configuration
FROM_EMAIL=noreply@backintouch.net

# SMS Configuration
SMS_FROM_NUMBER=+1234567890

# Voice Configuration
CONNECT_INSTANCE_ID=your-connect-instance-id
CONNECT_CONTACT_FLOW_ID=your-contact-flow-id
```

## Running Locally with Real AWS Services

Yes! You can absolutely run the app locally and have it hit real AWS services. Just:

1. Set up your AWS services (see AWS Setup section below)
2. Configure the `.env` file with real AWS credentials
3. **DO NOT** set `AWS_ENDPOINT` (this is what makes it use LocalStack)
4. Run your app normally: `npm run dev` or `docker-compose -f docker-compose-dev.yml up`

The app will automatically detect it's not in LocalStack mode and use real AWS services.

## AWS Services Setup Required

### 1. Amazon SES (Email Service)

**Steps:**

1. Go to AWS Console → SES
2. **Verify your domain:**
   - Add your domain (e.g., `backintouch.net`)
   - Add DNS records (DKIM, SPF, DMARC)
3. **Request production access:**
   - By default, SES is in "sandbox mode" (can only send to verified emails)
   - Request production access to send to any email
4. **Create IAM user:**
   - Create user with SES permissions
   - Get Access Key ID and Secret Access Key

**Required IAM Policy:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["ses:SendEmail", "ses:SendRawEmail"],
      "Resource": "*"
    }
  ]
}
```

### 2. Amazon SNS (SMS Service)

**Steps:**

1. Go to AWS Console → SNS
2. **Request SMS origination numbers:**
   - Go to "Text messaging (SMS)" → "Origination numbers"
   - Request a phone number for your region
3. **Set spending limits:**
   - Go to "Text messaging (SMS)" → "Spending limits"
   - Set monthly limit (e.g., $10)
4. **Create IAM user:**
   - Add SNS permissions to your IAM user

**Required IAM Policy:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["sns:Publish"],
      "Resource": "*"
    }
  ]
}
```

### 3. Amazon Connect (Voice Service)

**Steps:**

1. Go to AWS Console → Amazon Connect
2. **Create Connect instance:**
   - Click "Create instance"
   - Choose "Store users within Amazon Connect"
   - Set up admin user
3. **Get instance details:**
   - Note your Instance ID (format: `arn:aws:connect:region:account:instance/instance-id`)
   - Extract just the instance ID part
4. **Create contact flow:**
   - Go to "Contact flows" → "Create contact flow"
   - Create a simple flow (e.g., "Play prompt" → "Disconnect")
   - Note the Contact Flow ID
5. **Claim phone number:**
   - Go to "Phone numbers" → "Claim a number"
   - Choose a number for your region
6. **Create IAM user:**
   - Add Connect permissions

**Required IAM Policy:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["connect:StartOutboundVoiceContact"],
      "Resource": "*"
    }
  ]
}
```

## Testing Your Setup

Once AWS services are configured:

1. **Test Email:**

   ```bash
   curl -X POST http://localhost:3000/email \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer your-jwt-token" \
     -d '{"to":"test@example.com","subject":"Test","body":"Hello"}'
   ```

2. **Test SMS:**

   ```bash
   curl -X POST http://localhost:3000/sms \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer your-jwt-token" \
     -d '{"to":"+1234567890","message":"Test SMS"}'
   ```

3. **Test Voice:**
   ```bash
   curl -X POST http://localhost:3000/voice/call \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer your-jwt-token" \
     -d '{"to":"+1234567890"}'
   ```

## Cost Considerations

- **SES:** $0.10 per 1,000 emails
- **SNS:** $0.75 per 100 SMS messages
- **Connect:** $0.018 per minute for voice calls

Start with small spending limits for testing!
