const addr = "https://kmilan.ca/comp4537/termproject/api/v1/user"

// [POST]
function addUser(){
    console.log("Clicked add user!");

    let email = document.getElementById("email").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("chk_password").value;

    // hash password using bcrypt js
    // let salt = await bcrypt.genSalt(10);
    // let hashedPassword = await bcrypt.hash(password, salt);

    // Perform a GET request to check if the email exists in database
    // [GET]
    // xhttp.open("GET", addr, true);
    // xhttp.setRequestHeader("Content-Type", "application/json");
    // xhttp.send();
    // xhttp.onreadystatechange = function(){
    //     if (this.readyState == 4 && this.status == 200) {
	// 	    console.log("Users: " + this.responseText);
	// 	    let arr = JSON.parse(this.responseText);
	//     	console.log(arr);

    // 		for(let i = 0; i < arr.length; i++) {
    //             read(arr[i]);
    //  		}
    // 	}
    // }

    if (password != confirmPassword) {
        alert("Passwords Don't Match! Try Again");
    } else {
        ( async() => {
            let result = await fetch('https://kmilan.ca/comp4537/termproject/api/v1/user', {
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
                })
            })();
    }
}