
    var socket = io("http://localhost:8080");
    let token = sessionStorage.getItem("token");
    let id = sessionStorage.getItem("user_id");

    //general
    socket.on("connect", () => {
        console.log(`connected to server ${socket.id}`);
    });

    socket.on("disconnect", () => {

        console.log(`disconnected to server ${socket.id}`);
    });

    socket.on("response_error", (data) => {
        if(data == "User not authorized"){
            sessionStorage.clear();
            window.location.href="signIn.html";
        }else{

            console.log("Error: " + data);
        }
    });

    socket.emit("userList",{token, id})

    socket.on("userListData", (data) => {
        setElements(data)
    });

    function getMessage(user_id){
        console.log(user_id);
        socket.emit("messageList", {token, id, user_id});
    
    }
    socket.on("messageListData", (data) => {
        setMessages(data);
    });


    function setMessages(data){
        console.log(data)
    }




