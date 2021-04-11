const addr = "https://kmilan.ca"
const tAddr = "http://localhost:8888";
// const rootURL = "/comp4537/termproject/api/v1"
const rootURL = ""
var gUserId = -1;

if (!sessionStorage.getItem('TTTuserId')) {
    window.location.href = 'index.html';
}
else {
    gUserId = sessionStorage.getItem('TTTuserId');
}


function getUser (func) {
    let reqUri = tAddr + rootURL + `/user/${sessionStorage.getItem('TTTuserId')}`;
    (async () => {
        let result = await fetch(reqUri, {
            method: 'get',
            headers: { 'Content-Type': 'application/json' },
        })
        let data = await result.json();

        console.log(data);
        func(data[0]);
    })();
}

function isUserAdmin() {
    let reqUri = tAddr + rootURL + `/user/${sessionStorage.getItem('TTTuserId')}`;
    (async () => {
        let result = await fetch(reqUri, {
            method: 'get',
            headers: { 'Content-Type': 'application/json' },
        }).then(res => {
            if (res.ok) return res.json();
        }).then(res => {
            console.log(res);
            if (res[0].isAdmin) {
                return true;
            } else {
                return false;
            }
        })
    })();
}