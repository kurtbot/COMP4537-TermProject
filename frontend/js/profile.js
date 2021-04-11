// [GET] Gets all users from the database (ADMIN ONLY)
document.addEventListener('DOMContentLoaded', (event) => {
    getUser(read);

    let reqUri = tAddr + rootURL + `/user/${sessionStorage.getItem('TTTuserId')}`;
    (async (resolve, reject) => {
        let result = await fetch(reqUri, {
            method: 'get',
            headers: { 'Content-Type': 'application/json' },
        })
        let data = await result.json();

        if (data[0].isAdmin) {
            reqUri = tAddr + rootURL + `/user`;
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
    let wins = user.win;
    let losses = user.lose;
    let draws = user.draw;
    let elo = user.elo;

    let row = document.createElement("tr");
    let winsTD = document.createElement("td");
    let lossesTD = document.createElement("td");
    let drawsTD = document.createElement("td");
    let rankTD = document.createElement("td");

    // table row information
    row.id = "user";

    // TODO: Read Wins
    winsTD.innerHTML = wins;
    // TODO: Read Losses
    lossesTD.innerHTML = losses;
    // TODO: Read Draws
    drawsTD.innerHTML = draws;

    // elo
    rankTD.innerHTML = elo;

    // edit button
    let editButton = document.createElement("button");
    editButton.innerHTML = "Edit";
    editButton.className = "btn";
    editButton.onclick = () => getUser(editUser);

    row.appendChild(winsTD);
    row.appendChild(lossesTD);
    row.appendChild(drawsTD);
    row.appendChild(rankTD);

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

    // do for loop here
    let row0 = document.createElement("tr");
    let thU = document.createElement("th");
    let thW = document.createElement("th");
    let thL = document.createElement("th");
    let thD = document.createElement("th");
    let thR = document.createElement("th");
    let thEdit = document.createElement("th");

    thU.innerHTML = "Username"
    thW.innerHTML = "Wins"
    thL.innerHTML = "Losses"
    thD.innerHTML = "Draws"
    thR.innerHTML = "elo"

    table.appendChild(row0);
    users.forEach(user => {
        let uid = user.userId;
        let username = user.username;
        let elo = user.elo;

    if (uid != sessionStorage.getItem('TTTuserId')){

        let row1 = document.createElement("tr");
        let usernameTD = document.createElement("td");
        let winsTD = document.createElement("td");
        let lossesTD = document.createElement("td");
        let drawsTD = document.createElement("td");
        let rankTD = document.createElement("td");
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

        row1.appendChild(usernameTD);
        row1.appendChild(winsTD);
        row1.appendChild(lossesTD);
        row1.appendChild(drawsTD);
        row1.appendChild(rankTD);

        // edit button
        editButton.innerHTML = "Edit";
        editButton.className = "btn";
        editButton.addEventListener('click', function(e){
            let id = e.currentTarget.userId;
            console.log(id);
        })
        // delete button
        delButton.innerHTML = "Delete";
        delButton.className = "btn";

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
    row0.appendChild(thEdit);
    document.getElementById("usersTable").appendChild(div);
}

function editUser(user) {
    let usernameInput = document.getElementById("username");
    let passwordInput = document.getElementById("password");

    const togglePassword = document.getElementById('togglePassword');
    const passwordSelector = document.getElementById('password');

    togglePassword.addEventListener('click', function (e) {
        console.log("CLICK THE EYE");
        // toggle the type attribute
        const type = (passwordSelector.getAttribute('type') == 'password') ? 'text' : 'password';
        passwordSelector.setAttribute('type', type);
        // toggle the eye slash icon
        this.classList.toggle('fa-eye-slash');
    });

    console.log("clicked user edit button");
    document.getElementById("editContainer").style.display = "block";

    usernameInput.value = user.username;
    passwordInput.value = user.password;
}

function updateUser() {
    console.log("Clicked the update button");
    console.log("userid: " + user.userId)

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // [PUT]
    let reqUri = tAddr + rootURL + `/user`;
    (async () => {
        let result = await fetch(reqUri, {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.userId,
                username: username,
                password: password,
            })
        }).then(res => {
            window.location.reload();
        })
        let data = await result.json();
    })();
    return false;
}

function deleteUser() {
    console.log("Clicked the delete button");

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    // [DELETE]
    let reqUri = tAddr + rootURL + `/user`;
    (async (resolve, reject) => {
        let result = await fetch(reqUri, {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: username
            })
        })
        let data = await result.json();
        window.location.href = 'profile.html';
    })();
}