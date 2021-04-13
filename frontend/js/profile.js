// [GET] Gets User Information
document.addEventListener('DOMContentLoaded', (event) => {
    getUser(read);

    let reqUri = addr + rootURL + `/user/${sessionStorage.getItem('TTTuserId')}`;
    (async (resolve, reject) => {
        let result = await fetch(reqUri, {
            method: 'get',
            headers: { 'Content-Type': 'application/json' },
        })
        let data = await result.json();

        // [GET] Gets all users from the database (ADMIN ONLY)
        if (data[0].isAdmin) {
            reqUri = addr + rootURL + `/user`;
            (async (resolve, reject) => {
                let result = await fetch(reqUri, {
                    method: 'get',
                    headers: { 'Content-Type': 'application/json' },
                })
                let data = await result.json();
                console.log(data);
                readAllUsers(data);
            })()
        }
    })()
})

// Reads the information from the database and outputs as a table
function read(user) {
    console.log(user);
    
    let usernameTitle = document.getElementById("usernameHeader");
    usernameTitle.innerHTML = user.username;

    let wins = user.win;
    let losses = user.lose;
    let draws = user.draw;
    let elo = user.elo;
    let adminState = user.isAdmin;

    let row = document.createElement("tr");
    let winsTD = document.createElement("td");
    let lossesTD = document.createElement("td");
    let drawsTD = document.createElement("td");
    let rankTD = document.createElement("td");
    let adminStatus = document.createElement("td");

    // table row information
    row.id = "user";

    // Read Wins
    winsTD.innerHTML = wins;
    // Read Losses
    lossesTD.innerHTML = losses;
    // Read Draws
    drawsTD.innerHTML = draws;

    // elo
    rankTD.innerHTML = elo;

    if(adminState) {
        adminStatus.innerHTML = "O";
    } else {
        adminStatus.innerHTML = "X";
    }

    // edit button
    let editButton = document.createElement("button");
    editButton.innerHTML = "Edit";
    editButton.className = "btn";
    editButton.onclick = () => editUser(user, sessionStorage.getItem('TTTuserId'));

    row.appendChild(winsTD);
    row.appendChild(lossesTD);
    row.appendChild(drawsTD);
    row.appendChild(rankTD);
    row.appendChild(adminStatus);

    row.appendChild(editButton);

    document.getElementById("userProfile").appendChild(row);
}

// Outputs admin results as table
function readAllUsers(users) {
    let h2 = document.createElement("h2");
    h2.innerHTML = "All Users"

    let div = document.createElement("div");
    let table = document.createElement("table");

    // div
    div.className = "users_table";
    table.id = "userList";

    let row0 = document.createElement("tr");
    let thU = document.createElement("th");
    let thW = document.createElement("th");
    let thL = document.createElement("th");
    let thD = document.createElement("th");
    let thR = document.createElement("th");
    let thAdmin = document.createElement("th");
    let thEdit = document.createElement("th");

    thU.innerHTML = "Username"
    thW.innerHTML = "Wins"
    thL.innerHTML = "Losses"
    thD.innerHTML = "Draws"
    thR.innerHTML = "elo"
    thAdmin.innerHTML = "Admin?"

    table.appendChild(row0);
    users.forEach(user => {
        let uid = user.userId;
        let username = user.username;
        let elo = user.elo;
        let adminState = user.isAdmin;

        if (uid != sessionStorage.getItem('TTTuserId')){
            let row1 = document.createElement("tr");
            let usernameTD = document.createElement("td");
            let winsTD = document.createElement("td");
            let lossesTD = document.createElement("td");
            let drawsTD = document.createElement("td");
            let rankTD = document.createElement("td");
            let adminStatus = document.createElement("td");
            let editButton = document.createElement("button");
            let delButton = document.createElement("button");

            // table row information
            row1.id = "user" + uid;

            // username
            usernameTD.id = "username" + uid;
            usernameTD.innerHTML = username;

            // Read Wins
            winsTD.innerHTML = user.win;
            // Read Losses
            lossesTD.innerHTML = user.lose;
            // Read Draws
            drawsTD.innerHTML = user.draw;

            // elo
            rankTD.id = "elo" + uid;
            rankTD.innerHTML = elo;

            // admin
            adminStatus.id = "adminState" + uid;
            if(adminState) {
                adminStatus.innerHTML = "O";
            } else {
                adminStatus.innerHTML = "X";
            }

            row1.appendChild(usernameTD);
            row1.appendChild(winsTD);
            row1.appendChild(lossesTD);
            row1.appendChild(drawsTD);
            row1.appendChild(rankTD);
            row1.appendChild(adminStatus);

            // edit button
            editButton.innerHTML = "Edit";
            editButton.className = "btn";
            editButton.onclick = () => editUser(user, uid);
            // delete button
            delButton.innerHTML = "Delete";
            delButton.className = "btn";
            delButton.onclick = () => deleteUser(uid);

            row1.appendChild(editButton);
            row1.appendChild(delButton);
            
            table.appendChild(row1);
            
            div.appendChild(h2);
            div.appendChild(table);
        }
    });
    row0.appendChild(thU);
    row0.appendChild(thW);
    row0.appendChild(thL);
    row0.appendChild(thD);
    row0.appendChild(thR);
    row0.appendChild(thAdmin);
    row0.appendChild(thEdit);
    document.getElementById("usersTable").appendChild(div);
}

function hide() {
    document.getElementById("errorId").style.display = "none";
    document.getElementById("errorUser").style.display = "none";
    document.getElementById("errorPw").style.display = "none";
    document.getElementById("confirmPw").style.display = "none";
}

// Shows the form to edit a user
function editUser(user, userId) {
    console.log("clicked user edit button");
    document.getElementById("editContainer").style.display = "block";

    let usernameInput = document.getElementById("username");
    let passwordInput = document.getElementById("password");
    let updateBtn = document.getElementById("updateButton");

    let adminStatus = document.getElementById("isadmin");

    const togglePassword = document.getElementById('togglePassword');
    const passwordSelector = document.getElementById('password');

    togglePassword.addEventListener('click', function () {
        // toggle type
        const type = (passwordSelector.getAttribute('type') == 'password') ? 'text' : 'password';
        passwordSelector.setAttribute('type', type);
        // toggle the eye slash icon
        this.classList.toggle('fa-eye-slash');
    });

    usernameInput.value = user.username;
    passwordInput.value = user.password;

    if(!user.isAdmin){
        adminStatus.checked = false;
    } else { // Should a user be able to revoke admin rights from themselves?
        adminStatus.checked = true;
    }

    updateBtn.onclick = () => updateUser(userId);
}

// Sends a Request to Update a User
function updateUser(userId) {
    let noErr = true;

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    hide();

    let adminState = document.getElementById("isadmin").checked;
    let isAdmin = 0;
    
    if (adminState){
        isAdmin = 1;
    }

    console.log("username: " + username);
    console.log("password: " + password);
    console.log("isAdmin? " + adminState);

    // validation
    // if username is blank
    if (!username){
        console.log("username missing");
        document.getElementById("errorUser").style.display = "block";
        document.getElementById("errorUser").innerHTML = "Please enter a username";
        noErr = false;
    }

    // if password is blank
    if (!password){
        console.log("password missing");
        document.getElementById("errorPw").style.display = "block";
        document.getElementById("errorPw").innerHTML = "Please enter a password";
        noErr = false;
    }


    if (noErr){
        // [PUT]
        let reqUri = addr + rootURL + `/user`;
        (async () => {
            let result = await fetch(reqUri, {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    username: username,
                    password: password,
                    isAdmin: isAdmin
                })
            }).then(res => {
                window.location.reload();
            })

        })();
    }
    return false;
}

// Deletes a user
function deleteUser(userId) {
    console.log("Clicked the delete button");
    console.log("userid: " + userId);
    
    // [DELETE]
    let reqUri = addr + rootURL + `/user/${userId}`;
    (async (resolve, reject) => {
        let result = await fetch(reqUri, {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
        })
        console.log(result);
        window.location.href = 'profile.html';
    })();
}