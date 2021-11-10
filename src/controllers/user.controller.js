const modelUser = require('../models/user.model');
const modelMessage = require('../models/message.model');
const jwt = require ("jsonwebtoken");
const config = require("../config/env.config");
const { Op } = require("sequelize");
const multer  = require('multer');


const fileStorageEngine = multer.diskStorage({
    destination:(req, file, cb)=> {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
       
        cb(null, Date.now() + `--` + file.originalname);
    }
});

const upload =  multer({storage: fileStorageEngine}).single("photo");

async function createMessage(req, res, next){
   
    try {
       
        upload(req, res, async (err) => {
            let my_user_id = req.body.user_id;
            let my_to_id = req.body.to_id;
            let my_message = req.body.message;
            let my_file_url ="";

            if(req.file)
                my_file_url = req.file.path;

            let my_room_id = Math.min(my_user_id,my_to_id) + ''+ Math.max(my_user_id,my_to_id); 
         
            await modelMessage.create({
                user_id: my_user_id,
                to_id: my_to_id,
                message: my_message,
                room_id: my_room_id,
                file_url: my_file_url
            });
          
            if(err){
                console.log(err);
            } else {
                   
                   if(req.file == undefined){
                     console.log('Error: No File Selected!');          
                   } 
                   else {
                        console.log({
                             msg: 'File Uploaded!',
                        });
                   }
            }
              
         });

         return res.status(200).send({
              message: 'success',
              status: true,
              data: {}
         });

    } catch (error) {
         return res.status(404).send({
              message: 'ERROR : ' + error,
              status: false,
              data: {}
         });
    }

}

//getUsers

async function getUsers(req, res, next){
    try {
       
            const data = await modelUser.findAll({
                order: [
                    ['id', 'DESC'],
                ],
                where: {
                    id: {
                        [Op.ne]: req.query.id,
                    }
                }
            });

            return res.status(200).send({
                message: "success",
                status: true,
                data: data
            });

    } catch (error) {
        
        return res.status(404).send({
            message: "Error: getUsers = " + error,
            status: false,
            data: {}
        });
    }
}

//registrationUser

async function createUser(req, res, next){
    try {
            let {full_name, login, password} = req.body;
            let data, message = "success", status = true;
           
            let is_have = await modelUser.findOne({
                where: {
                    full_name: full_name,
                    login: login
                }
            });

            if(!(is_have)){
                user = await modelUser.create({
                    full_name,
                    login,
                    password
                });

               const token = jwt.sign({
                        id: user.id,
                        full_name: user.full_name,
                        password: user.password
                }, config.secretkey, { expiresIn: config.keytime });

                data = {
                    "token": token,
                    "id": user.id,
                    "full_name": user.full_name
                };

            }else{
                status = false;
                data = {};
                message = "Sorry this full_name already used";
            }
            
            return res.status(200).send({
                message: message,
                status: status,
                data: data
            });

    } catch (error) {
        return res.status(404).send({
            message: "Error: getUsers = "+error,
            status: false,
            data: {}
        });
    }
}

//loginUser

async function login(req, res, next){
    try {
        let {login, password} = req.query;
        let message = "success", status = true;

        let is_auth = await modelUser.findOne({
            where: {
                login: login,
                password: password
            }
        });

        if(is_auth){
            const token = jwt.sign({
                    id: is_auth.id,
                    full_name: is_auth.full_name,
                    password: is_auth.password
            }, config.secretkey, { expiresIn: config.keytime });

            data = {
                "token": token,
                "id": is_auth.id,
                "full_name": is_auth.full_name
            };

        }else{
            status = false;
            message = "Login or password incorrect!";
            data = {};
        }

        return res.status(200).send({
            message: message,
            status: status,
            data: data
        });

    } catch (error) {
        return res.status(404).send({
            message: "Error: login = "+error,
            status: false,
            data: {}
        });
    }
}

//getMessages

async function getMessages(req, res, next){
        try {
                let {id} = req.query;
            
                const data = await modelMessage.findAll({
                    order: [
                        ['id', 'DESC'],
                    ],
                    where: {
                        room_id: id 
                    },
                    include:[
                        {
                            model: modelUser,
                            as: 'user',
                            attributes: ["id", "full_name"]
                        },
                        {
                            model: modelUser,
                            as: 'to',
                            attributes: ["id", "full_name"]
                        }
                    ]
                });

                return res.status(200).send({
                    message: "success",
                    status: true,
                    data: data
                });

        } catch (error) {
            
            return res.status(404).send({
                message: "Error: getMessages = " + error,
                status: false,
                data: {}
            });
        }
}


module.exports = {
    getUsers,
    createUser,
    login,
    getMessages,
    createMessage
}

