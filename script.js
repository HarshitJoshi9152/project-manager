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
	console.log(arguments);
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
	// check for internet connection
	getGoals("http://localhost:8080/getJSON","GET","text/json");
}

//  Dont worry we will change the name in produnction release
function getGoals(file, method = "GET", acceptType, info){
	const xhttp = new XMLHttpRequest();
	// xhttp.onReadyStateChange = function(){
	// 	if(this.readyState == 4 && this.status == 200){
	//
	// 	}
	// 	else if(this.readyState == 0){
	// 		// server is down
	// 	}
	// 	else{
	// 		// status is probably 404;
	// 	}
	// 	console.log(this.readyState-1);
	// 	console.log(this.readState)
	// }

	// we are yet to change the onload function don't develop the onload further
	// because we need error handling .

	xhttp.onload = function(){
		// we should first see the status and code and then respond accordingly
		/* we should remove the try catch as we are not in early stages of
		   development */
		try{
			console.log(xhttp.status);
			if(xhttp.status === 200){
				let data = JSON.parse(xhttp.responseText);
				for(let i of data){
					make_table(i);
				}
			} else{
					console.log(xhttp)
			}
		}
		catch(e){
			if(xhttp.status == 404){
				// if code is 404 why are we even parseing it #scopeForImprovement
				console.error("404 Not found !! bad request");
				return 404;
			} else{
				console.log(e);
			}
		}
		finally{

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
