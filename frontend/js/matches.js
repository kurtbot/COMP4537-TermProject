document.addEventListener('DOMContentLoaded', (event) => {
    // [GET] to check if user is admin
    let reqUri = addr + rootURL + `/user/${sessionStorage.getItem('TTTuserId')}`;
    (async (resolve, reject) => {
        let result = await fetch(reqUri, {
            method: 'get',
            headers: { 'Content-Type': 'application/json' },
        })
        let data = await result.json();
        console.log("Checking if admin");

        if (!data[0].isAdmin){
            console.log("User is not an admin");
            reqUri = addr + rootURL + `/match/${sessionStorage.getItem('TTTuserId')}`;
            // [GET] Get only matches you're inolved in
            (async (resolve, reject) => {
                let result = await fetch(reqUri, {
                    method: 'get',
                    headers: { 'Content-Type': 'application/json' },
                })
                let data = await result.json();
                // TODO: status code handling
                if (result.status == 400){
                    document.getElementById("resp").innerHTML = "No matches found";
                }
                readMatches(data);
            })()
        } else {
            // [GET] Gets all matches from the database (ADMIN ONLY)
            console.log("User is an admin");
            reqUri = addr + rootURL + `/match`;
            (async (resolve, reject) => {
                let result = await fetch(reqUri, {
                    method: 'get',
                    headers: { 'Content-Type': 'application/json' },
                })
                let data = await result.json();
                if (result.status == 400){
                    document.getElementById("resp").innerHTML = "No matches found";
                }

                readAllMatches(data);
            })()
        }
    })()
})

function readMatches(matches){
    console.log(matches);
    let div = document.createElement("div");
    let table = document.createElement("table");

    // // div
    div.className = "matchesTable";
    table.id = "matchList";

    let row0 = document.createElement("tr");
    let thId = document.createElement("th");
    let thP1 = document.createElement("th");
    let thP2 = document.createElement("th");
    let thWinner = document.createElement("th");

    // let thAdmin = document.createElement("th");
    // let thEdit = document.createElement("th");

    thId.innerHTML = "Match ID"
    thP1.innerHTML = "Player 1"
    thP2.innerHTML = "Player 2"
    thWinner.innerHTML = "Winner"
    // thAdmin.innerHTML = "Admin?"

    table.appendChild(row0);
    matches.forEach(match => {
        let mid = match.matchId;
        let p1 = match.user1Id;
        let p2 = match.user2Id;
        let winner = match.winner;

        let row = document.createElement("tr");
        let matchTD = document.createElement("td");
        let p1TD = document.createElement("td");
        let p2TD = document.createElement("td");
        let winnerTD = document.createElement("td");

        row.id = "row" + mid;

        // match
        matchTD.id = "match" + mid;
        matchTD.innerHTML = mid;

        // p1
        p1TD.id = "p1" + mid;
        p1TD.innerHTML = p1;

        // p2
        p2TD.id = "p2" + mid;
        p2TD.innerHTML = p2;

        // winner
        winnerTD.id = "winner" + mid;
        winnerTD.innerHTML = winner;

        row.appendChild(matchTD);
        row.appendChild(p1TD);
        row.appendChild(p2TD);
        row.appendChild(winnerTD);

        table.appendChild(row);

        div.appendChild(table);
    });

    row0.appendChild(thId);
    row0.appendChild(thP1);
    row0.appendChild(thP2);
    row0.appendChild(thWinner);

    document.getElementById("container").appendChild(div);
}

// Outputs admin results as table
function readAllMatches(matches) {
    console.log("Users");
    console.log(matches);
    let div = document.createElement("div");
    let table = document.createElement("table");

    // div
    div.className = "matchesTable";
    table.id = "matchList";

    let row0 = document.createElement("tr");
    let thId = document.createElement("th");
    let thP1 = document.createElement("th");
    let thP2 = document.createElement("th");
    let thWinner = document.createElement("th");
    let thDel = document.createElement("th");

    thId.innerHTML = "Match ID"
    thP1.innerHTML = "Player 1"
    thP2.innerHTML = "Player 2"
    thWinner.innerHTML = "Winner"

    table.appendChild(row0);
    matches.forEach(match => {
        let mid = match.matchId;
        let p1 = match.user1Id;
        let p2 = match.user2Id;
        let winner = match.winner;

        let row = document.createElement("tr");
        let matchTD = document.createElement("td");
        let p1TD = document.createElement("td");
        let p2TD = document.createElement("td");
        let winnerTD = document.createElement("td");
        let editButton = document.createElement("button");
        let delButton = document.createElement("button");

        row.id = "row" + mid;

        // match
        matchTD.id = "match" + mid;
        matchTD.innerHTML = mid;

        // p1
        p1TD.id = "p1" + mid;
        p1TD.innerHTML = p1;

        // p2
        p2TD.id = "p2" + mid;
        p2TD.innerHTML = p2;

        // winner
        winnerTD.id = "winner" + mid;
        winnerTD.innerHTML = winner;

        row.appendChild(matchTD);
        row.appendChild(p1TD);
        row.appendChild(p2TD);
        row.appendChild(winnerTD);

        // delete button
        editButton.innerHTML = "Edit";
        editButton.className = "btn";
        editButton.onclick = () => editMatch(mid, winner);

        // delete button
        delButton.innerHTML = "Delete";
        delButton.className = "btn";
        delButton.onclick = () => deleteMatch(mid);

        row.appendChild(editButton);
        row.appendChild(delButton);

        table.appendChild(row);

        div.appendChild(table);
    });

    row0.appendChild(thId);
    row0.appendChild(thP1);
    row0.appendChild(thP2);
    row0.appendChild(thWinner);
    row0.appendChild(thDel);

    document.getElementById("container").appendChild(div);
}

function editMatch(matchId, username){
    console.log("Clicked the edit button");
    console.log("matchid: " + matchId);

    document.getElementById("editContainer").style.display = "block";

    let updateBtn = document.getElementById("updateButton");

    // document.getElementById("errorUser").style.display = "none";

    let usernameInput = document.getElementById("username");
    usernameInput.value = username;
    
    updateBtn.onclick = () => updateUser();
}

function updateUser(){
    let username = document.getElementById("username").value;

    console.log("new name: " + username);
}

function deleteMatch(matchId){   
    // [DELETE]
    let reqUri = addr + rootURL + `/match/${matchId}`;
    (async (resolve, reject) => {
        let result = await fetch(reqUri, {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
        })
        console.log(result);
        window.location.href = 'matches.html';
    })();
}