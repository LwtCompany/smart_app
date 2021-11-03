const modelUser = require('../models/user.model');
const jwt = require ("jsonwebtoken");
const config = require("../config/env.config");


//registrationUser

async function createUser(req, res, next){
    try {
            let {full_name, login, password} = req.body;
            let data, message = "success";

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
                    "token": token
                };

            }else{
                data = {};
                message = "Sorry this full_name already used";
            }
            
            return res.status(200).send({
                message: message,
                status: true,
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
        let message = "success";

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
                "token": token
            };

        }else{
            message = "Login or password incorrect!";
            data = {};
        }

        return res.status(200).send({
            message: message,
            status: true,
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


module.exports = {
    createUser,
    login
}