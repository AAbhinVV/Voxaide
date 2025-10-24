class ApiError extends Error {
    constructor(
        statusCode, 
        message = "Something went wrong",
        stack = "",
        errors = []
    ) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        this.data = null;
        this.success = false;
        this.errors = errors;

        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export {ApiError}