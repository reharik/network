import { Validator } from '@network/contracts';

// Type for typia validation errors returned by the API

export interface TypiaValidationError {
  path: string;
  expected: string;
  value?: unknown;
}
// Type for API error responses

export interface ApiErrorResponse {
  error?: string;
  issues?: TypiaValidationError[];
}
// Init === Initialization Object
export type JsonInit = Omit<RequestInit, 'body'> & {
  body?: unknown;
  /** which precompiled validator to use for this response */
  validator?: Validator;
};
