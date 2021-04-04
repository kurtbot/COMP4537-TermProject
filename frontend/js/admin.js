const addr = "https://kmilan.ca/comp4537/termproject/api/v1/queries"

const endpointRoot = '/comp4537/termproject/api/v1'

document.addEventListener('DOMContentLoaded', (event) => {
    //the event occurred
    let xhttp = new XMLHttpRequest();
    
    // [GET]
    xhttp.open("GET", addr, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
    xhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
		    console.log("Response: " + this.responseText);
		    let arr = JSON.parse(this.responseText);
	    	console.log(arr);

    		for(let i = 0; i < arr.length; i++) {
                read(arr[i]);
     		}
    	}
    }
})

function read(stat) {
    let uri = stat.uri;
    let method = stat.type;
    let count = stat.stat;

    let row = document.createElement("tr");
    let methodTD = document.createElement("td");
    let endpointTD = document.createElement("td");
    let countTD = document.createElement("td");
    
    // method
    methodTD.innerHTML = method.toUpperCase();

    // endpoint
    endpointTD.innerHTML = endpointRoot + uri;

    // requests 
    countTD.innerHTML = count;

    row.appendChild(methodTD);
    row.appendChild(endpointTD);
    row.appendChild(countTD);
    document.getElementById("statsList").appendChild(row);
}