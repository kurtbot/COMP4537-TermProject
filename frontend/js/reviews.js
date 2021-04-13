const addr = "https://kmilan.ca"
// const tAddr = "http://localhost:8888";
const rootURL = "/comp4537/termproject/api/v1"

let userId = sessionStorage.getItem('TTTuserId');

document.addEventListener('DOMContentLoaded', (event) => {
    if (userId) {
        // [GET] to check if user is admin
        console.log("Checking if admin");
        let reqUri = addr + rootURL + `/user/${sessionStorage.getItem('TTTuserId')}`;
        (async (resolve, reject) => {
            let result = await fetch(reqUri, {
                method: 'get',
                headers: { 'Content-Type': 'application/json' },
            })
            let data = await result.json();
            console.log(data);

            if (data[0].isAdmin){
                document.getElementById("reviewForm").style.display = "block";

                let submitBtn = document.getElementById("submit");
                submitBtn.onclick = () => addReview(userId)
            }
        })()

        // [GET] Get Request
        reqUri = addr + rootURL + `/reviews`;
        (async () => {
            let result = await fetch(reqUri, {
                method: 'get',
                headers: { 'Content-Type': 'application/json' },
            })
            let data = await result.json();
            read(data);
        })();
    } else {
        document.getElementById("formMessage").innerHTML = "Please log in to post a review"
    }
})

function read(reviews) {
    console.log(reviews);
    let section = document.createElement("section");

    reviews.forEach(review => {
        let div = document.createElement("div");
        let name = document.createElement("h4");
        let p = document.createElement("p");

        let body = review.reviewBody;
        let username = review.username;

        p.innerHTML = body;

        name.innerHTML = username;

        div.appendChild(name)
        div.appendChild(p);
        section.appendChild(div);
    });

    document.getElementById("reviews").appendChild(section);
}

function addReview(userId) {
    console.log("Clicked Submit Button");

    let reviewBody = document.getElementById("reviewBody").value;
    console.log("UserID: " + userId);
    console.log("Review Body: " + reviewBody);

    // [POST] Post a review
    ( async() => {
        let result = await fetch(addr + rootURL + '/review', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: userId,
                reviewBody: reviewBody
            })
            }).then(res => {
                if (res.ok) return res.json();
            }).then(res => {
                console.log(res);
                let successStatus = document.getElementById("successStatus");
                successStatus.innerHTML = "Successfully posted to db";

                window.location.href = 'reviews.html';
            })
    })();

    return false;
}