module.exports = class ApiError extends Error{
    status;
    errors;

    constructor(message,status,errors=[]){
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError(){
        return new ApiError("Unauthorized",401)
    }

    static BadRequest(message,errors){
         return new ApiError(message,400,errors)
    }
}