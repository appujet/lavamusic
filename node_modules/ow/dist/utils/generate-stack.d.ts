/**
Generates a useful stacktrace that points to the user's code where the error happened on platforms without the `Error.captureStackTrace()` method.

@hidden
*/
export declare const generateStackTrace: () => string;
