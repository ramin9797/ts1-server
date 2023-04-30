const ApiError = require("../exceptions/api-error");
const tokenService = require("../service/token-service");

module.exports = function(req,res,next){
   try {
     const authorization = req.headers.authorization;
     if(!authorization){
        throw new ApiError.UnauthorizedError()
     }

     const accessToken = authorization.split(' ')[1];
     if(!accessToken){
        throw new ApiError.UnauthorizedError()
     }

     const userData = tokenService.validateAccessToken(accessToken)
     if(!userData){
        throw new ApiError.UnauthorizedError()
     }
     req.user = userData;
     next();
   } 
   catch (error) {
    console.log('111111');
    return next(ApiError.UnauthorizedError());
   }
}