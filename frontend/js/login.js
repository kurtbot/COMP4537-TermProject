const addr = "https://kmilan.ca"
const tAddr = "http://localhost:8888";
// const rootURL = "/comp4537/termproject/api/v1"
const rootURL = ""

function login() {
    console.log("Clicked login");

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    console.log("email: " + email);
    console.log("password: " + password);

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
        }).then(res => {
            console.log(res);
            // localStorage.setItem('TTTuserId', res[0].userId);
            if (res) {
                sessionStorage.setItem('TTTuserId', res[0].userId);
                window.location.href = 'index.html';
            }
        })
    })();

    return false;
}