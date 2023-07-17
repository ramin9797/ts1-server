const Router = require("express").Router;
const router = new Router();
const {body} = require("express-validator")


const userController = require('../controllers/user-controller');
const authMiddleware = require('../middlewares/auth-middleware')
// const multer = require('multer');
// const storage = multer.diskStorage({
//     destination: 'uploads/', // Specify the destination directory to store the uploaded files
//     filename: function (req, file, cb) {
//         // Specify the file name format
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
//     }
// });
// const upload = multer({ storage });




router.post("/registration",userController.registration)
router.post("/login",userController.login)
router.get("/users/me",authMiddleware,userController.getMe)


router.post("/logout",userController.logout)
router.get("/activate/:link",userController.activate);
router.get('/refresh',userController.refresh)
router.get('/getUsers',authMiddleware,userController.getUsers);
router.get('/dockers',userController.getDockers);
router.post('/stopDocker',userController.stopDocker);
router.post('/startDocker',userController.startDocker);

module.exports = router;