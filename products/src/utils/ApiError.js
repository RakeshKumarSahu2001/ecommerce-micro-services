class ApiError extends Error{
    constructor(status=500,message,error){
        super(message);
        this.status=status;
        this.error=error;
        this.message=message;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError;