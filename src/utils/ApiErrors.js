class ApiError extends Erros {
    constructor(
        statusCode,
        message="Something went wrong",
        errors=[],
        statck = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.errors = errors
        this.data = null
        this.success = false

        if(statck){
            this.stack = statck
        }else{
            Error.captureStackTrace(this, this.constructor) 
            /*
            captureStackTrace() is a static method of the Error class that is used to
            capture the stack trace of an error. 
            */
        }
    }
}

export {ApiError}