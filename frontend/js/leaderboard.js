// [GET] Gets the leaderboard
document.addEventListener('DOMContentLoaded', (event) => {
    let reqUri = tAddr + rootURL + `/leaderboard`;
    console.log(reqUri);
    (async () => {
        let result = await fetch(reqUri, {
            method: 'get',
            headers: { 'Content-Type': 'application/json' },
        }).then(res => {
            if (res.ok) return res.json();
        }).then(res => {
            read(res[0]);
            console.log(res);
        })
    })();
})

// Reads the information from the database and outputs as a table
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