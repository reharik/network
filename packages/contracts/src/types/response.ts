// Response types for consistent API responses
export type SuccessResponse<T> = {
  success: true;
  data: T;
};

export type FailureResponse = {
  success: false;
  errors: string[];
};

export type Response<T> = SuccessResponse<T> | FailureResponse;
