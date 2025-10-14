import { config as dotEnvConfig, DotenvConfigOutput } from 'dotenv';

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
  // Email configuration
  fromEmail: string;
  // SMS configuration
  smsFromNumber: string;
  // Voice configuration
  connectInstanceId: string;
  connectContactFlowId: string;
};

let instantiatedDotEnv: DotenvConfigOutput;
let config_: Config;

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
  }
  config_ = config_ || {
    nodeEnv: getValidValue<NodeEnv>(process.env.NODE_ENV || 'development', nodeEnvs),
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
    // Email configuration
    fromEmail: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
    // SMS configuration
    smsFromNumber: process.env.SMS_FROM_NUMBER || '+1234567890',
    // Voice configuration
    connectInstanceId: process.env.CONNECT_INSTANCE_ID || '',
    connectContactFlowId: process.env.CONNECT_CONTACT_FLOW_ID || '',
  };
  return config_;
};

export const config = setupConfig();
