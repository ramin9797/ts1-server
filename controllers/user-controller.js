const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');
const UserService = require('../service/user-service');
const listContainers = require('../service/docker-service');

class UserController{
    async registration(req,res,next){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest("Validation errors",errors.array()));
            }
            const {email,password} = req.body;
            const userData = await UserService.registration(email,password);
            res.cookie('refreshToken',userData.refreshToken,{
                httpOnly:true,
                maxAge:30*24*60*60*1000 
            })
            res.status(200).json(userData);
        } catch (error) {
            // console.log('ddd',error);
            next(error)
        }
    }

    async login(req,res,next){
        try {
            const {email,password} = req.body;
            const userData = await UserService.login(email,password);
            console.log('data',userData);
            res.cookie('refreshToken',userData.refreshToken,{
                httpOnly:true,
                maxAge:30*24*60*60*1000 
            })
            return res.json(userData);
        } catch (error) {
            console.log('errrrr',error);
            next(error)
        }
    }

    async logout(req,res,next){
        try {
            const {refreshToken} = req.cookies;
            const token = UserService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (error) {
            next(error)
        }
    }

    async refresh(req,res,next){
        try {
            const {refreshToken} = req.cookies;
            const userData = await UserService.refresh(refreshToken);
            res.cookie('refreshToken',userData.refreshToken,{
                httpOnly:true,
                maxAge:30*24*60*60*1000 
            })
            return res.json(userData);
        } catch (error) {
            next(error)
        }
    }

    async activate(req,res,next){
        try {
            const activationLink = req.params.link;
            await UserService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL)

        } catch (error) {
            next(error)
        }
    }


    async getUsers(req,res,next){
        try {
            const users = await UserService.getUsers()
            res.json(users)
        } catch (error) {
            next(error)
        }
    }

    async getDockers(req,res,next){
        let containers = await listContainers.listContainers()
        res.json(containers)
    }
    async stopDocker(req,res,next){
        console.log('res',req.body);
        listContainers.stopContainer(req.body.id)
        res.json({status:'stopped'})
    }


    async startDocker(req,res,next){
        console.log('res',req.body);
        listContainers.startContainer(req.body.id)
        res.json({status:'started'})
    }


    async getMe(req,res,next){
        try {
            console.log('re',req.user);

            res.status(200).json({
                status: 'success',
                data: {
                    user:req.user
                },
            });
        }catch (e) {
            next(error)
        }
    }

    


}


module.exports = new UserController()