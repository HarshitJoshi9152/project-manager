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
	getGoals("http://localhost:8080/pushToJson","POST", false,JSON.stringify(info));
	console.log(info);
}

function make_table({srno, goalBody, dateRegistered, dueDate, accomplished}){
	let row = document.createElement("tr");
	makeElm("td",srno,row);
	makeElm("td",goalBody,row);
	makeElm("td",dateRegistered,row);
	makeElm("td",dueDate,row);
	makeElm("td",String(accomplished),row);
	document.getElementById("GOALS").appendChild(row);
}

function makeElm(element, textNode, parent) {
	let elm = document.createElement(element);
	if(textNode){
		let node = document.createTextNode(textNode);
		elm.appendChild(node);
	}
	if(parent && typeof parent == "object"){
		parent.appendChild(elm);
		return 0;
	} else{
		return elm;
	}
}

window.onload = function(e){
	// code ..
	getGoals("http://localhost:8080/getJSON","GET","text/json");
}

//  Dont worry we will change the name in produnction release
function getGoals(file, method = "GET", acceptType, info){
	const xhttp = new XMLHttpRequest();
	xhttp.onload = function(){
		// we should first see the status and code and then respond accordingly
		try{
			let data = JSON.parse(xhttp.responseText);
			// changed the data type to an array 6 October 2018
			for(let i of data){
				make_table(i);
			}
		} catch(e){
			// case 1 data is unparsable// maybe 404
			//  -> make a request to developer to review the data.
			// case 2
			if(xhttp.status == 404){
				// if code is 404 why are we even parseing it #scopeForImprovement
				console.error("404 Not found !! bad request");
				return -1;
			} else{
				console.log(e);
			}
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
		console.log("sending a post one")
		xhttp.send(info);
	} else{
		xhttp.send();
	}
}