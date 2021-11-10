

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
        sessionStorage.setItem("to_id", user_id);
        socket.emit("messageList", {token, id, user_id});
    
    }

    socket.on("messageListData", (data) => {
        setMessages(data);
    });


    function setMessages(data){

        let all_messages = document.getElementById("mainMessages");
        all_messages.innerHTML = "";
        
        for(let i = 0; i < data.length; i++){
            let root_div = document.createElement('div');
            let child1_div = document.createElement('div');
            let child2_div = document.createElement('div');

            let my_image = document.createElement('img');
            let my_h4 = document.createElement('h4');
            let my_p = document.createElement('p');
            let my_span = document.createElement('span');
            let my_br = document.createElement('br');

            //image
            my_image.setAttribute("class", "w3-circle");
            my_image.setAttribute("style", "width:96px;height:96px");
            if(id == data[i].user_id){
                my_image.setAttribute('src', 'https://ava.loohk.com/telegram-341740/avatar_pubg.jpg');
            }else{
                my_image.setAttribute('src', 'https://static10.tgstat.ru/channels/_0/4c/4c4aa5f3b952032ef32156ee208a74ab.jpg');
            }

            //child1
            child1_div.setAttribute("class", "w3-col m2 text-center")
            child1_div.appendChild(my_image);

            //span
            my_span.setAttribute("class", "w3-opacity w3-medium");
            my_span.innerHTML = data[i].created_at;

            //h4
            my_h4.innerHTML = data[i].user.full_name;
            my_h4.appendChild(my_span);

            //p
            my_p.innerHTML = data[i].message;

            //child2
            child2_div.setAttribute("class", "w3-col m10 w3-container")
            child2_div.appendChild(my_h4);
            child2_div.appendChild(my_p);
            child2_div.appendChild(my_br);

            //root
            root_div.setAttribute("class", "w3-row");
            root_div.appendChild(child1_div);
            root_div.appendChild(child2_div);

         
            all_messages.appendChild(root_div);
        }
        console.log(data)
    }

    socket.on('hello', (data) => {
        console.log("Hello world ishladi");
    })

    async  function sendMessage(){
        try {
            let to_id = sessionStorage.getItem("to_id");
            let my_message =  document.getElementById("my_message").value;
            let photo = document.getElementById("fileInput").files[0];
            let formData = new FormData();
            let response;

            formData.append("message", my_message);   
            formData.append("to_id", to_id);   
            formData.append("user_id", id);
            if(photo)   
              formData.append("photo", photo);

            if((my_message || photo) && to_id)
                response = await  fetch(baseUrl+'createMessage', {
                        method: "POST",
                        body: formData,
                        headers: {
                        'token': token
                    }
                });
            
            if(response){
                const data = await response.json();

                if(data.status){
                    getMessage(to_id)
                }
            }
            
        } catch (error) {
            console.log(error);
        }
           
    
    }





