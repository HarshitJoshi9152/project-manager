function fragment(elm){
	elm.style.display = none;
}
function accomplised(elm){
	console.log(accomplised);
	console.log(elm);
}

function addGoal(){
	// Dont rust user input force him to provide the correct input
	let text = document.getElementById('goalText').value;
	let duedate = document.getElementById('duedate').value;
	let date = new Date()
	let currentDate = date.getDate().toString() +" "+ (date.getMonth()+1) +" "+ date.getFullYear();
	let info = {
		"accomplished":false,
		"goalBody":text,
		"dueDate":duedate,
		"dateRegistered":currentDate
	}
	getGoals("http://localhost:8080/pushToJson","PUT", false,info);
	console.log(info);
}

function make_table(data){
	// APPEND HTML CHILDREN
	console.log(document.getElementById("GOALS"));
	let test = document.getElementById("GOALS");
	let row = document.createElement("tr");
	let srno = document.createElement("td");
	srno.appendChild(document.createTextNode(String(test.childElementCount+1)));
	let body = document.createElement("td");
	body.appendChild(document.createTextNode(data.goalBody));
	let date_reg = document.createElement("td");
	date_reg.appendChild(document.createTextNode(data.dateRegistered));
	let date_exp = document.createElement("td");
	date_exp.appendChild(document.createTextNode(data.dueDate));
	let acc = document.createElement("td");
	acc.appendChild(document.createTextNode(data.accomplished));
	row.appendChild(srno);
	row.appendChild(body);
	row.appendChild(date_reg);
	row.appendChild(date_exp);
	row.appendChild(acc);
	test.appendChild(row);
}

window.onload = function(e){
	// code ..
	getGoals("http://localhost:8080/getJSON","GET","text/json");
}

//  Dont worry we will change the name in produnction release
function getGoals(file, method = "GET", acceptType, info){
	const xhttp = new XMLHttpRequest();
	xhttp.onload = function(){
		console.log(xhttp.responseText);
		// we should first see the status and code and then respond accordingly
		try{
			console.log("trying!!");
			let data = JSON.parse(xhttp.responseText);
			make_table(data);
		} catch(e){
			// case 1 data is unparsable// maybe 404
			//  -> make a request to developer to review the data.
			// case 2
			if(xhttp.status == 404){
				console.error("404 Not found !! bad request");
				return -1;
			}
			console.log(e);
		}
		finally{
			// code ..
		}
	}
	xhttp.open(method,file,true);
	// xhttp.setRequestHeader("Access-Control-Allow-Origin","*");
	if(acceptType){
		xhttp.setRequestHeader("accept",acceptType);
	}
	if(info){
		xhttp.send(info);
	} else{
		xhttp.send();
	}
}