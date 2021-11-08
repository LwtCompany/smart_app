let baseUrl = 'http://localhost:8080/';


async function singIn(){
   
    let data = getSignInData();
    try {
            let login = data.my_login.value;
            let password = data.my_password.value;
        
            const response = await fetch(baseUrl+"login?login="+login+"&password="+password);
            let body = await response.json();
        

            if(!body.status){
                document.getElementById("_error").setAttribute("style", "display: block;");
                document.getElementById("_error").innerHTML += body.message;
            }else{
                sessionStorage.setItem("user_id", body.data.id);
                sessionStorage.setItem("token", body.data.token);
                sessionStorage.setItem("name", body.data.full_name);

                clearSignInData();
                window.location.href="dashboard.html";
            }
    } catch (error) {
            document.getElementById("_error").setAttribute("style", "display: block;");
            document.getElementById("_error").innerHTML += "Error: singIn =" + error;
        
            console.log("Error: singIn =" + error);
    }
}

function getSignInData(){
    let my_login = document.getElementById("_login");
    let my_password = document.getElementById("_password");
    let my_error = document.getElementById("_error");

    return {my_login, my_password, my_error};
}

function clearSignInData(){
    let {my_login, my_password} = getSignInData();

    my_login.value = "";
    my_password.value = "";
}

async function signUp(){
    
    
    let data = getSignUpData();
    try {
        let login = data.my_login.value;
        let password = data.my_password.value;
        let full_name = data.my_name.value;
        let request = {
            login,
            password,
            full_name
        };

        
        const response = await fetch(baseUrl+"registration", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(request)
        });

        let my_data = await response.json();
        
        if(!my_data.status){
            document.getElementById("error").setAttribute("style", "display: block;");
            document.getElementById("error").innerHTML += my_data.message;
        }else{
            sessionStorage.setItem("user_id", body.data.id);
            sessionStorage.setItem("token", body.data.token);
            sessionStorage.setItem("name", body.data.full_name);

            clearSignUpData();
            window.location.href="dashboard.html";
        }
    } catch (error) {
            document.getElementById("error").setAttribute("style", "display: block;");
            document.getElementById("error").innerHTML += "Error: singUp =" + error;
        
            console.log("Error: singUp =" + error);
    }
}

function getSignUpData(){
    let my_name = document.getElementById("full_name")
    let my_login = document.getElementById("login");
    let my_password = document.getElementById("password");
    let my_error = document.getElementById("error");

    return {my_name, my_login, my_password, my_error};
}

function clearSignUpData(){
    let {my_name, my_login, my_password} = getSignUpData();
    my_login.value = "";
    my_password.value = "";
    my_name.value = "";
}

async function getUserList(){
    try {
    
        let token = sessionStorage.getItem("token");
        let id = sessionStorage.getItem("user_id");

      
        const userList = await fetch(baseUrl+"userList?id="+id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                token
            }
        });
        const response = await userList.json();

        if(response.status)
            setElements(response.data);
        else
            console.log(response.message);

    } catch (error) {
        console.log(error);
    }
}

function setElements(data){
    let users_board = document.getElementById("userList");
    // users_board.innerHTML = "";

    let t = 1;
    for(let i = 0; i < data.length; i++){
       
        
        let a_item = document.createElement('a');
        a_item.innerHTML = t+++" ) " + '<i class="fa fa-user fa-fw"></i> '+ data[i].full_name;
    
        a_item.setAttribute("class", "w3-bar-item w3-button w3-padding");
        a_item.setAttribute("onclick", "getMessage("+data[i].id +")");
    
        users_board.appendChild(a_item);
    }
}



function singOut(){
    sessionStorage.clear();
}

