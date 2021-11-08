const modelUser = require('../models/user.model');
const jwt = require ("jsonwebtoken");
const config = require("../config/env.config");



module.exports = function(socket_io){

    socket_io.on("registration", async (req_data) => {
      
       let response = await registration(req_data, socket_io.id);

       if(!response.status)
        socket_io.emit("response_error", response.message);
       else
        socket_io.emit("register_response", response.data);

    });

    socket_io.on("login", async(req_data) => {
        let response = await login(req_data, socket_io.id);

        if(!response.status)
         socket_io.emit("response_error", response.message);
        else
         socket_io.emit("login_response", response.data);
    });


async function registration(req_data, socket_id){
    try {
        let {full_name, login, password} = req_data;
        let data, status = true, message = "success";


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
                password,
                socket_id
            });

           const token = jwt.sign({
                    id: user.id,
                    full_name: user.full_name,
                    password: user.password
            }, config.secretkey, { expiresIn: config.keytime });

            data = {
                "token": token,
                "socket_id": user.socket_id
            };

        }else{
            status = false;
            data = {};
            message = "Sorry this full_name already used";
        }
        
        return {
            message: message,
            status: status,
            data: data
        };

} catch (error) {
    return {
        message: "Error: getUsers = "+error,
        status: false,
        data: {}
    };
}
}


async function login(req, res, next){
    try {
        let {login, password} = req.query;
        let message = "success",  status = true;

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
                "socket_id": user.socket_id
            };

        }else{
            status = false;
            message = "Login or password incorrect!";
            data = {};
        }

        return {
            message: message,
            status: status,
            data: data
        };

    } catch (error) {
        return {
            message: "Error: login = "+error,
            status: false,
            data: {}
        };
    }
}

}


