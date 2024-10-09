class ApiErrorHandler extends Error{
    constructor(
        staus,
        message = '',
        error = [],
        stack = ""
    ){
        super(message);
        this.statusCode = staus;
        this.error = error;
        this.stack = stack;
        this.data = null;
        this.success = false;
    }
}

export default ApiErrorHandler;