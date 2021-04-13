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
    document.getElementById('authStatus').setAttribute('class', 'btn btn-outline-danger')

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
                    let htmlTxt =  `                  
                            <div class="m-1">
                                <a class="btn btn-outline-info" href = "./profile.html">Profile</a>
                            </div>
                            <div class="m-1">
                                <a class="btn btn-outline-info" href = "./admin.html">Admin</a>
                            </div>
                            <div class="m-1">
                                <a class="btn btn-outline-info" href = "./matches.html">Matches</a>
                            </div>
                            <div class="m-1">
                                <a class="btn btn-outline-info" href = "./leaderboard.html">Leaderboard</a>
                            </div>`;
                    document.getElementById('mainContainer').insertAdjacentHTML('beforeend',htmlTxt);
                } else
                {
                    let htmlTxt = `
        <div class="m-1">
            <a class="btn btn-outline-info" href = "./profile.html">Profile</a>
        </div>
        <div class="m-1">
            <a class="btn btn-outline-info" href = "./matches.html">Matches</a>
        </div>
        <div class="m-1">
            <a class="btn btn-outline-info" href = "./leaderboard.html">Leaderboard</a>
        </div>
    `

    document.getElementById('mainContainer').insertAdjacentHTML('beforeend',htmlTxt);
                }
            })
        })();
})
    // Regular User
    
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