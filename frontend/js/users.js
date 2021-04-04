const addr = "https://kmilan.ca/comp4537/termproject/api/v1/user"

document.addEventListener('DOMContentLoaded', (event) => {
    //the event occurred
    let xhttp = new XMLHttpRequest();
    
    // [GET]
    xhttp.open("GET", addr, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
		    console.log("Users: " + this.responseText);
		    let arr = JSON.parse(this.responseText);
	    	console.log(arr);

    		for(let i = 0; i < arr.length; i++) {
                read(arr[i]);
     		}
    	}
    }
})

function read(user) {
    let uid = user.userId;
    let username = user.username;
    let elo = user.elo;

    let row = document.createElement("tr");
    let usernameTD = document.createElement("td");
    let rankTD = document.createElement("td");

    // table row information
    row.id = "user" + uid;
    
    // username
    usernameTD.id = "username" + uid;
    usernameTD.innerHTML = username;

    // elo
    rankTD.id = "elo" + uid;
    rankTD.innerHTML = elo;

    row.appendChild(usernameTD);
    row.appendChild(rankTD);
    document.getElementById("userList").appendChild(row);
}

// [POST]
function addUser(){
    console.log("Clicked add user!");

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("chk_password").value;

    if (password != confirmPassword) {
        alert("Passwords Don't Match! Try Again");
    } else {
        ( async() => {
            let result = await fetch('https://kmilan.ca/comp4537/termproject/api/v1/user', {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                }).then(res => {
                    if (res.ok) return res.json();
                }).then(res => {
                    console.log(res);
                })
            })();
    }
}