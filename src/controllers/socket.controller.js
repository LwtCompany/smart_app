const modelUser = require('../models/user.model');
const modelMessage = require('../models/message.model');
const { Op } = require("sequelize");
const verifyToken = require('../service/socket_verify');
const fs = require('fs');
const path = require('path')
// const buffer = require('buffer');

module.exports = function(socket_io){
   
    socket_io.on("userList", async (req_data) => {
     
        let auth = await verifyToken(req_data.token);
       
        if(!auth.status)
            socket_io.emit("response_error", auth.message);
        else{
            let response = await getUsers(req_data.id);
            if(!response.status)
         
             socket_io.emit("response_error", response.message);
            else
                socket_io.emit("userListData", response.data);
           
        }


    });

    socket_io.on("messageList", async (req_data) => {
        let auth = await verifyToken(req_data.token);
       
        if(!auth.status)
            socket_io.emit("response_error", response.message);
        else{
            let response = await getMessages(req_data.id, req_data.user_id);
            if(!response.status)
             socket_io.emit("response_error", response.message);
            else{
                socket_io.emit("messageListData", response.data);
            }
              
           
        }
    });
    
    socket_io.on('upload-image', async (img) => {
     
        let auth = await verifyToken(img.token);
       
        if(!auth.status)
            socket_io.emit("response_error", response.message);
        else{
            let response = await createMessage(img);

            if(!response.status)
             socket_io.emit("response_error", response.message);

            else{
              
                let message = await getMessages(img.user_id, img.to_id);
                if(!message.status)
                 socket_io.emit("response_error", message.message);
                else{
                    socket_io.broadcast.emit("messageListData", message.data);
                    socket_io.emit("messageListData", message.data);
                }
               
            }
               
           
        }
    });

    socket_io.on('get-user-index', async (data) => {
     
        let auth = await verifyToken(data.token);
       
        if(!auth.status)
            socket_io.emit("response_error", response.message);
        else{
            let response = await getUser(data.user_id);

            if(!response.status)
             socket_io.emit("response_error", response.message);
            else
             socket_io.emit('userData', response.data);
        }

    })
}

async function getUser(id){
   try {

        let data = await modelUser.findOne({
            where: {
                id
            }
        });

        return {
            message: "success",
            status: true,
            data
        };

    } catch (error) {

        return {
            message: "Error: getUsers = " + error,
            status: false,
            data: {}
        };
    }
}

async function getUsers(id){
    try {
       
            const data = await modelUser.findAll({
                order: [
                    ['id', 'DESC'],
                ],
                where: {
                    id: {
                        [Op.ne]: id,
                    }
                }
            });

            return {
                message: "success",
                status: true,
                data: data
            };

    } catch (error) {
        
        return {
            message: "Error: getUsers = " + error,
            status: false,
            data: {}
        };
    }
}

async function getMessages(user_id, to){
    try {
        
            let my_room_id = Math.min(user_id,to) + ''+ Math.max(to,user_id); 
    
            const data = await modelMessage.findAll({
                order: [
                    ['id', 'ASC'],
                ],
                where: {
                        room_id:my_room_id
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

           
            return{
                message: "success",
                status: true,
                data: data
            };

    } catch (error) {
        
        return {
            message: "Error: getMessages = " + error,
            status: false,
            data: {}
        };
    }
}

async function createMessage(img){
    try {
        
        let my_file_url;
        
        let my_user_id = img.user_id;
        let my_to_id = img.to_id;
        let my_message = img.message;
        
        let my_room_id = Math.min(my_user_id,my_to_id) + ''+ Math.max(my_user_id,my_to_id); 

        if(img.name){
            let my_time = Date.now();
            my_file_url = `http://localhost:8080/uploads/` + my_time + `--`+img.name;
           
           fs.writeFile(path.join(__dirname, '../../uploads/')+my_time + `--`+img.name, img.data,'base64',  (err) =>{
               if (err) return console.log(err);
                   console.log('image saved');
           });
        }


        const data =  await modelMessage.create({
            user_id: my_user_id,
            to_id: my_to_id,
            message: my_message,
            room_id: my_room_id,
            file_url: my_file_url
        });

        return{
                message: "success",
                status: true,
                data
            };

    } catch (error) {
        
        return {
            message: "Error: createMessage = " + error,
            status: false,
            data: {}
        };
    }
}