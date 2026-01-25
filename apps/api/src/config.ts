import dotenv, { config as dotEnvConfig, DotenvConfigOutput } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// const applicationEnvs = ['local', 'dev', 'qa', 'staging', 'prod'];
const nodeEnvs = ['development', 'test', 'production', 'prod'];
type NodeEnv = (typeof nodeEnvs)[number];

export type Config = {
  nodeEnv: NodeEnv;
  // Database configuration
  postgresHost: string;
  postgresPort: number;
  postgresUser: string;
  postgresPassword: string;
  postgresDatabase: string;
  // JWT configuration
  jwtSecret: string;
  jwtExpiresIn: string;
  // CORS configuration
  corsOrigin: string;
  // Server configuration
  serverPort: number;
  // AWS configuration
  awsRegion: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  awsEndpoint?: string; // Only for LocalStack testing - DO NOT set in production
  // Email configuration
  fromEmail: string;
  // SMS configuration
  smsFromNumber: string;
  smsDeliveryMode: 'email_handoff' | 'aws_sns';
  // Voice configuration
  connectInstanceId: string;
  connectContactFlowId: string;
  // Logging configuration
  logLevel: 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug';
};

let config_: Config;
let instantiatedDotEnv: DotenvConfigOutput;

// Utility function to validate values against allowed options
const getValidValue = <T extends string>(value: string, allowedValues: readonly T[]): T => {
  if (allowedValues.includes(value as T)) {
    return value as T;
  }
  throw new Error(`Invalid value: ${value}. Allowed values: ${allowedValues.join(', ')}`);
};

export const setupConfig = (): Config => {
  if (!instantiatedDotEnv) {
    instantiatedDotEnv = dotEnvConfig();
    // instantiatedDotEnv = dotEnvConfig({
    //   path: path.resolve(__dirname, '../.env'),
    //   override: false,
    // });
  }
  const nodeEnv = getValidValue<NodeEnv>(process.env.NODE_ENV || 'development', nodeEnvs);
  const isProduction = nodeEnv === 'production' || nodeEnv === 'prod';

  // Production safety checks - warnings will be logged after logger is initialized
  // Store warnings to log later
  const warnings: string[] = [];
  if (isProduction) {
    if (process.env.AWS_ENDPOINT) {
      warnings.push(
        '⚠️  WARNING: AWS_ENDPOINT is set in production! This will route AWS requests to LocalStack instead of real AWS services.',
      );
    }

    if (process.env.JWT_SECRET === 'your-secret-key-change-in-production') {
      warnings.push(
        '⚠️  WARNING: Using default JWT secret in production! This is a security risk.',
      );
    }

    // Note: AWS credentials can be provided via IAM roles on EC2, so we don't warn about missing explicit credentials
    // The AWS SDK will automatically use IAM roles via the default credential chain
  }

  // Always recreate config to pick up any env vars that were loaded after module import
  config_ = {
    nodeEnv,
    // Database configuration
    postgresHost: process.env.POSTGRES_HOST || '127.0.0.1',
    postgresPort: Number(process.env.POSTGRES_PORT || 5432),
    postgresUser: process.env.POSTGRES_USER || 'postgres',
    postgresPassword: process.env.POSTGRES_PASSWORD || '',
    postgresDatabase: process.env.POSTGRES_DB || 'network',
    // JWT configuration
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    jwtExpiresIn: '30d', // 30 days sliding scale
    // CORS configuration
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:8080',
    // Server configuration
    serverPort: Number(process.env.PORT || 3000),
    // AWS configuration
    awsRegion: process.env.AWS_REGION || 'us-east-1',
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    awsEndpoint: process.env.AWS_ENDPOINT, // Optional LocalStack endpoint
    // Email configuration
    fromEmail: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
    // SMS configuration
    smsFromNumber: process.env.SMS_FROM_NUMBER || '+1234567890',
    smsDeliveryMode: getValidValue<'email_handoff' | 'aws_sns'>(
      process.env.SMS_DELIVERY_MODE || 'email_handoff',
      ['email_handoff', 'aws_sns'],
    ),
    // Voice configuration
    connectInstanceId: process.env.CONNECT_INSTANCE_ID || '',
    connectContactFlowId: process.env.CONNECT_CONTACT_FLOW_ID || '',
    // Logging configuration
    logLevel:
      (process.env.LOG_LEVEL as 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug') ||
      (isProduction ? 'info' : 'debug'),
  };

  // Return warnings to be logged after logger initialization
  if (warnings.length > 0) {
    (config_ as Config & { _warnings?: string[] })._warnings = warnings;
  }

  return config_;
};

// Export config - dotenv is already loaded at module import time above
export const config = setupConfig();
