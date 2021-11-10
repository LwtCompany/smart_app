

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
        document.getElementById("MyInput").setAttribute("style", "display: block");
        sessionStorage.setItem("to_id", user_id);


        socket.emit("messageList", {token, id, user_id});
        socket.emit('get-user-index', {token, user_id});
    }
    socket.on('userData', (data) => {
        let user_item = document.getElementById('userName');
        user_item.innerHTML = "";
        let my_h5 = document.createElement('h4');

        my_h5.innerHTML = `<b><i class="fa fa-user"></i>  `+  data.full_name + `</b>`;
        user_item.appendChild(my_h5);
    });

    socket.on("messageListData", (data) => {
        setMessages(data);
    });


    function setMessages(data){
        console.log(data.length);
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
                my_image.setAttribute('src', 'https://static10.tgstat.ru/channels/_0/4c/4c4aa5f3b952032ef32156ee208a74ab.jpg');
            }else{
                my_image.setAttribute('src', 'https://ava.loohk.com/telegram-341740/avatar_pubg.jpg');
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
            if(data[i].file_url){
                let image_user = document.createElement('img');
                image_user.setAttribute('src', data[i].file_url);
                image_user.setAttribute('width', '200px');
                image_user.setAttribute('class', 'w3-hover-grayscale w3-padding w3-border');
                child2_div.appendChild(image_user);
            }
            child2_div.appendChild(my_br);
            
            //root
            if(id == data[i].user_id){

                root_div.setAttribute("style", "margin-left: 300px;");
            }

            root_div.setAttribute("class", "w3-row");
            root_div.appendChild(child1_div);
            root_div.appendChild(child2_div);

         
            all_messages.appendChild(root_div);

            window.scrollTo(0, document.body.scrollHeight);
        }
    }


    async  function sendMessage(){
        try {
            
            let to_id = sessionStorage.getItem("to_id");
            let my_message =  document.getElementById("my_message").value;
            let photo = document.getElementById("fileInput").files[0];
            let data;

            if(photo){
                let reader = new FileReader();

                reader.onloadend = async function(){
                    socket.emit('upload-image', {
                        name: photo.name,
                        message: my_message,
                        to_id: to_id,
                        user_id: id,
                        data: reader.result,
                        token
                    });
                };
                reader.readAsArrayBuffer(photo);
               
                getMessage(to_id);

            }else{
                socket.emit('upload-image', {
                    name: null,
                    message: my_message,
                    to_id: to_id,
                    user_id: id,
                    data: null,
                    token
                });

            
                getMessage(to_id)
            }
          
            document.getElementById("my_message").value = '';
            document.getElementById("fileInput").value = '';

            
        } catch (error) {
            console.log(error);
        }
           
    
    }




