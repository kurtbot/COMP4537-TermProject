const addr = "https://kmilan.ca/"
const tAddr = "http://localhost:8888";
// const rootURL = "comp4537/termproject/api/v1"
const rootURL = ""
// [POST]
function addUser(){
    console.log("Clicked add user!");

    let email = document.getElementById("email").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("chk_password").value;

    if (password != confirmPassword) {
        alert("Passwords Don't Match! Try Again");
    } else {
        ( async() => {
            let result = await fetch(tAddr + rootURL + '/user', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    username: username,
                    password: password,
                })
                }).then(res => {
                    if (res.ok) return res.json();
                }).then(res => {
                    console.log(res);
                    localStorage.setItem('TTTuserId', res.insertId);
                    sessionStorage.setItem('TTTuserId', res.insertId);
                    window.location.href = 'index.html';
                })
        })();
    }
    return false;
}