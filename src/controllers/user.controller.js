const modelUser = require('../models/user.model');
const modelMessage = require('../models/message.model');


//getUsers

async function getUsers(req, res, next){
    try {
            const data = await modelUser.findAll({});

            return res.status(200).send({
                message: "success",
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


module.exports = {
    getUsers
}

