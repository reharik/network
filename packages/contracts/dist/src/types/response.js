// Utility functions for Response handling
export const createSuccessResponse = (data) => ({
    success: true,
    data,
});
export const createFailureResponse = (errors) => ({
    success: false,
    errors,
});
export const createFailureResponseFromError = (error) => ({
    success: false,
    errors: [error.message],
});
// Convert ParseResult to our Response type
export const fromParseResult = (parseResult) => {
    if (parseResult.success) {
        return createSuccessResponse(parseResult.data);
    }
    return createFailureResponse(parseResult.errors || ['Unknown error']);
};
// Transform Response data type (useful for service-to-service calls)
export const mapResponse = (response, mapper) => {
    if (response.success) {
        try {
            return createSuccessResponse(mapper(response.data));
        }
        catch (error) {
            return createFailureResponseFromError(error);
        }
    }
    return response; // Pass through failure responses unchanged
};
// Chain multiple operations that return Response
export const chainResponse = async (response, nextOperation) => {
    if (response.success) {
        return nextOperation(response.data);
    }
    return response; // Pass through failure responses unchanged
};
// Utility to handle async operations that might throw
export const fromAsyncOperation = async (operation) => {
    try {
        const data = await operation();
        return createSuccessResponse(data);
    }
    catch (error) {
        return createFailureResponseFromError(error);
    }
};
