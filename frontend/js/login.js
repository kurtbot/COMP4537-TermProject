const addr = "https://kmilan.ca"
const tAddr = "http://localhost:8888";
// const rootURL = "/comp4537/termproject/api/v1"
const rootURL = ""

function hide() {
    document.getElementById("errorId").style.display = "none";
    document.getElementById("errorPw").style.display = "none";
}

function login() {
    let noErr = true;

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    hide();

    // if password is blank
    if (!password){
        console.log("password missing");
        document.getElementById("errorPw").style.display = "block";
        document.getElementById("errorPw").innerHTML = "Please enter a password";
        noErr = false;
    }

    if (emailIsValid(email)){
        console.log("valid email");
        // if user has entered all fields, and email is correct format
        if (noErr){
            let reqUri = tAddr + rootURL + '/login';
            (async () => {
                let result = await fetch(reqUri, {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    })
                }).then(res => {
                    if (res.ok) return res.json();
                    if (res.status == 401){
                        document.getElementById("errorPw").style.display = "block";
                        document.getElementById("errorPw").innerHTML = "Invalid Credentials";
                    }
                }).then(res => {
                    // console.log(res);
                    // localStorage.setItem('TTTuserId', res[0].userId);
                    if (res) {
                        sessionStorage.setItem('TTTuserId', res[0].userId);
                        window.location.href = 'index.html';
                    }
                })
            })();
        }
    } else {    // if invalid email format
        console.log("invalid email");
        emailError = document.getElementById("errorId").style.display = "block";
        document.getElementById("errorId").innerHTML = "Please enter a valid email address";
    }

    return false;
}