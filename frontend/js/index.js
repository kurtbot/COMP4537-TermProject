const addr = "https://kmilan.ca"
const tAddr = "http://localhost:8888";
// const rootURL = "/comp4537/termproject/api/v1"
const rootURL = ""

// Signed In
if(sessionStorage.getItem('TTTuserId'))
{
    // show logout
    document.getElementById('authStatus').onclick = logout;
    document.getElementById('authStatus').innerText = 'Logout';

    // [GET] Gets all users from the database (ADMIN ONLY)
    document.addEventListener('DOMContentLoaded', (event) => {
        // [GET]
        let reqUri = tAddr + rootURL + `/user/${sessionStorage.getItem('TTTuserId')}`;
        (async () => {
            let result = await fetch(reqUri, {
                method: 'get',
                headers: { 'Content-Type': 'application/json' },
            }).then(res => {
                if (res.ok) return res.json();
            }).then(res => {
                console.log(res);
                document.getElementById("banner").innerHTML = "Welcome " + res[0].username + "!";
                // localStorage.setItem('TTTuserId', res[0].userId);
                if(res[0].isAdmin == 1){
                    // Admin
                    let htmlTxt = `<div class = "options">
                        <ul>
                            <li>
                                <a class="btn" href = "./profile.html">Profile</a>
                            </li>
                            <li>
                                <a class="btn" href = "./admin.html">Admin</a>
                            </li>
                            <li>
                                <a class="btn" href = "./matches.html">Matches</a>
                            </li>
                            <li>
                                <a class="btn" href = "./leaderboard.html">Leaderboard</a>
                            </li>
                        </ul>
                    </div>`
                    document.getElementById('mainContainer').innerHTML = htmlTxt;
                }
            })
        })();
})
    // Regular User
    let htmlTxt = `<div class = "options">
    <ul>
        <li>
            <a class="btn" href = "./profile.html">Profile</a>
        </li>
        <li>
            <a class="btn" href = "./matches.html">Matches</a>
        </li>
        <li>
            <a class="btn" href = "./leaderboard.html">Leaderboard</a>
        </li>
    </ul>
    </div>`

    document.getElementById('mainContainer').innerHTML = htmlTxt;
}
else
{
    document.getElementById('authStatus').onclick = login;
}


function login()
{
    window.location.href = 'login.html';
}

function logout()
{
    sessionStorage.removeItem('TTTuserId');
    window.location.reload();
}