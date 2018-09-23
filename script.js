function fragment(elm){
	elm.style.display = none;
}
function accomplised(elm){
	console.log(accomplised);
	console.log(elm);
}

function addGoal(){
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
	console.log("made table");
	console.log(data);
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
			// case 1 data is unparsable//
			//  -> make a request to developer to review the data.
			// case 2 
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