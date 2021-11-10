const modelUser = require('../models/user.model');
const modelMessage = require('../models/message.model');
const { Op } = require("sequelize");
const verifyToken = require('../service/socket_verify');



module.exports = function(socket_io){
   
    socket_io.on("userList", async (req_data) => {
     
        let auth = await verifyToken(req_data.token);
       
        if(!auth.status)
            socket_io.emit("response_error", auth.message);
        else{
            let response = await getUsers(req_data.id);
            if(!response.status)
            // console.log("status false")
             socket_io.emit("response_error", response.message);
            else
            // console.log("status tru")
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
            else
                // console.log(response.data);
             socket_io.emit("messageListData", response.data);
           
        }
    });

    socket_io.emit("hello", "world");
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