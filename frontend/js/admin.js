document.addEventListener('DOMContentLoaded', (event) => {
    //the event occurred
    let xhttp = new XMLHttpRequest();
    
    // [GET]
    xhttp.open("GET", addr + rootURL + '/queries', true);
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
    methodTD.innerHTML = method.toUpperCase().bold();

    // endpoint
    endpointTD.innerHTML = uri;

    // requests 
    countTD.innerHTML = count;

    row.appendChild(methodTD);
    row.appendChild(endpointTD);
    row.appendChild(countTD);
    document.getElementById("statsList").appendChild(row);
}