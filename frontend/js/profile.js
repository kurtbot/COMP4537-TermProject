const addr = "https://kmilan.ca/comp4537/termproject/api/v1/user"

// const bcrypt = require('bcryptjs')

// [GET] Gets all users from the database (ADMIN ONLY)
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

// Reads the information from the database and outputs as a table
function read(user) {
    let uid = user.userId;
    let username = user.username;
    let elo = user.elo;

    let row = document.createElement("tr");
    let usernameTD = document.createElement("td");
    let winsTD = document.createElement("td");
    let lossesTD = document.createElement("td");
    let drawsTD = document.createElement("td");
    let rankTD = document.createElement("td");

    // table row information
    row.id = "user" + uid;
    
    // username
    usernameTD.id = "username" + uid;
    usernameTD.innerHTML = username;

    // TODO: Read Wins
    // TODO: Read Losses
    // TODO: Read Draws

    // elo
    rankTD.id = "elo" + uid;
    rankTD.innerHTML = elo;

    row.appendChild(usernameTD);
    row.appendChild(winsTD);
    row.appendChild(lossesTD);
    row.appendChild(drawsTD);
    row.appendChild(rankTD);
    document.getElementById("userList").appendChild(row);
}