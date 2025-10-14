export type SuccessResponse<T> = {
    success: true;
    data: T;
};
export type FailureResponse = {
    success: false;
    errors: string[];
};
export type Response<T> = SuccessResponse<T> | FailureResponse;
export declare const createSuccessResponse: <T>(data: T) => SuccessResponse<T>;
export declare const createFailureResponse: (errors: string[]) => FailureResponse;
export declare const createFailureResponseFromError: (error: Error) => FailureResponse;
export declare const fromParseResult: <T>(parseResult: {
    success: boolean;
    data?: T;
    errors?: string[];
}) => Response<T>;
export declare const mapResponse: <T, U>(response: Response<T>, mapper: (data: T) => U) => Response<U>;
export declare const chainResponse: <T, U>(response: Response<T>, nextOperation: (data: T) => Promise<Response<U>>) => Promise<Response<U>>;
export declare const fromAsyncOperation: <T>(operation: () => Promise<T>) => Promise<Response<T>>;
//# sourceMappingURL=response.d.ts.map