function fragment(elm){
	elm.style.display = none;
}
function accomplised(elm){
	console.log(accomplised);
	console.log(elm);
}

function addGoal(){
	// Dont rust user input force him to provide the correct input
	let text = document.getElementById('goalText').value.trim();
	let duedate = document.getElementById('duedate').value;
	let date = new Date()
	let currentDate = date.getDate().toString() +"-"+ (date.getMonth()+1) +"-"+ date.getFullYear();
	let ts = Date.now()
	// checking the user-input
	if(duedate == ""){
			// displayError and react to it
			window.alert('error duedate not selected!!');
			console.error("no due date specified!!");
			return -1;
	}
	if(text == ""){
		window.alert('error no goal body!!');
		console.error("no due date specified!!");
		return -1;
	}
	let info = {
		"accomplished":false,
		"goalBody":text,
		"dueDate":duedate,
		"dateRegistered":currentDate
		// "timestamp":ts
	}
	// now we dont need this BAD code !!
	getGoals("http://localhost:8080/pushToJson","POST", false,info);
	// console.log(info);
}

function make_table({srno, goalBody, dateRegistered, dueDate, accomplished}){
	let row = document.createElement("tr");
	console.log("fone")
	makeElm("td",srno,row);
	makeElm("td",goalBody,row);
	makeElm("td",dateRegistered,row);
	makeElm("td",dueDate,row);
	let elm = document.createElement("input");
	elm.setAttribute("type","checkbox");
	elm.checked = (accomplished)?true:false;
	elm.addEventListener("checked",tell)
	makeElm("td",elm,row);
	document.getElementById("GOALS").appendChild(row);

	function makeElm(element, node, parent) {
		let elm = document.createElement(element);
		if(node){
			let b;
			if(typeof node === "string" || typeof node === "number"){
				b = document.createTextNode(node);
				elm.appendChild(b)
			}
			else if(typeof node === "object"){
				elm.appendChild(node);
			}
		}
		if(parent && typeof parent == "object"){
			parent.appendChild(elm);
			return 0;
		} else{
			return elm;
		}
	}
}

function tell(change){
	let info = change
	getGoals("http://localhost:8080/update","POST",false,info);
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
		try{
			console.log(xhttp.status);
			console.log(xhttp.responseText);
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
		// console.log("sending a post one")
		xhttp.send(info);
	} else{
		xhttp.send();
	}
}
