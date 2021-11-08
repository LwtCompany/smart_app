
var socket = io("http://localhost:8080");

//general
  socket.on("connect", () => {
    console.log(`connected to server ${socket.id}`);
 });

 socket.on("disconnect", () => {
    sessionStorage.clear();
    console.log(`disconnected to server ${socket.id}`);
});

 socket.on("response_error", (data) => {
    console.log("Error: " + data);
//    console.log(sessionStorage.getItem(socket.id));
});




 socket.on("register_response", (data)=> {
    sessionStorage.clear();
    sessionStorage.setItem(data.socket_id, data.token);
});



function myFunc(){
    
    let my_name = document.getElementById("full_name");
    let my_login = document.getElementById("login");
    let my_password = document.getElementById("password");
    // let my_form = document.getElementById("signUpForm");

    // console.log(my_name);
    socket.emit("registration", {
        full_name: my_name.value,
        login: my_login.value,
        password: my_password.value
    });

  
   
}
