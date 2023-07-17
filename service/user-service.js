const bcrypt = require("bcrypt");
const uuid = require("uuid")

const UserModel = require("../models/user-model");
const TokenModel = require("../models/token-model");
const MailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dto/user-dto");
const ApiError = require("../exceptions/api-error");

class UserService {
        async registration(email,password){
            const candidate = await UserModel.findOne({email});
            if(candidate){
                // throw new Error("User with email already exists")
                throw ApiError.BadRequest("User with email already exists");
            }
            const hashPassword = await bcrypt.hash(password,3);
            const activationLink = uuid.v4();
            const user = await UserModel.create({email,password:hashPassword,activationLink});
            // await MailService.sendActivationMail(email,activationLink); 

            const userDto = new UserDto(user);
            const tokens = tokenService.generateTokens({...userDto});
            await tokenService.saveToken(userDto.id,tokens.refreshToken)
            return {user:userDto,...tokens}
        }

        async login(email,password){
            const candidate = await UserModel.findOne({email});
            if(!candidate){
                throw ApiError.BadRequest("User with email not found");
            }


            const passwordEquals = await bcrypt.compare(password, candidate.password);
            if(!passwordEquals){
                throw ApiError.BadRequest("Password is wrong");
            }

            const userDto = new UserDto(candidate);
            const tokens = tokenService.generateTokens({...userDto});
            await tokenService.saveToken(userDto.id,tokens.refreshToken)
            return {user:userDto,...tokens}
        }

        async logout(refreshToken){
            const token = tokenService.removeToken(refreshToken)
            return token;
        }

        async activate(activationLink){
            const user = await UserModel.findOne({activationLink});
            if(!user){
                throw ApiError.BadRequest("activation link error")  
            }
            user.isActivated = true;
            await user.save()
        }

        async refresh(refreshToken){
            if(!refreshToken){
                throw ApiError.UnauthorizedError() 
            }
            const userData = tokenService.validateRefreshToken(refreshToken);
            const tokenData = await TokenModel.findOne({refreshToken});
            if(!userData || !tokenData){
                throw ApiError.UnauthorizedError() 
            }

            const candidate = await UserModel.findById(userData.id);
            const userDto = new UserDto(candidate);
            const tokens = tokenService.generateTokens({...userDto});
            await tokenService.saveToken(userDto.id,tokens.refreshToken)
            return {user:userDto,...tokens}              
        }

        async getUsers(){
            const users =  await UserModel.find();
            return users;
        }
}

module.exports = new UserService();