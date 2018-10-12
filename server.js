const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");

const app = http.createServer((req, res, err)=>{
	const URL = url.parse(req.url);
	const path = URL.pathname;
	console.log(`${req.method} request for ${URL.pathname}`);

	if(path == "/getJSON"){
		res.writeHead(200, {"content-type":"text/json","Access-Control-Allow-Origin":"*"});
		// res.setHeader("Access-Control-Allow-Origin","*")
		let JSONstream = returnFileStream("./data/userdata/goals/Goals.json",res).pipe(res);
	}

	//  USE THE res.appendHead function and the setStatus function
	// to add the A-C-A-O:* header early on

	else if(path == "/pushToJson" && req.method == "POST"){
		// 10/9/18 now we will use the action and method attr to reduce code
		let clientdata = "";
		req.on("data",(chunk)=>{
			// data collection starts
			// ok we cant use this with the html form submit !!
			clientdata+=chunk;
		})
		req.on("end",()=>{
			// data has been collected
			// if file exists and hasConnection === true
				clientdata = JSON.parse(appendJSONFile("./data/userdata/goals/Goals.json",JSON.parse(clientdata)));
				console.log(clientdata);
				res.writeHead(200, {"content-type":"text/json","Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"*"});
				console.log(clientdata);
				res.end(JSON.stringify([clientdata]));
		})
		// we will use the multiusers structure soon
	}
	else{
		res.writeHead(404, {"content-type":"text/plain","Access-Control-Allow-Origin":"*"});
		console.log(`${req.method} request received for ${path}`);
		res.end("the requested resource was not found on this server!\n");
	}
})

app.listen(8080,()=>{
	console.log("listening on port 8080");
});

function returnFileStream(src,res,encoding = "utf8"){
	let stream = fs.createReadStream(src,encoding);
	stream.on("error",(err)=>{
		console.log(err);
		res.end()
		return err;
	})
	stream.on("end",()=>{
		let size = stream.bytesRead.toString();
		console.log(`transfered ${size} bytes of ${src}`);
	})
	return stream;
}

function appendJSONFile(file, toAppend){
	// i have to use Sync version of functions for testing, i know that this will put a lot of presssure on my server in the real-world production build we will remove it in future and most likely replace it with an ES6 promise to ensure optimisation.
	// fs.readFile(file,"utf8",(data,err)=>{
	// 	if(err){
	// 		console.log(err);
	// 		return err;
	// 	} else{
	// 		console.log("read!")
	// 		console.log(data);
	// 		data = JSON.parse(data);
	// 		// appending the data here , i guess we should use an array
	// 		data.push(toAppend);
	// 		console.log("writing ..")
	// 		fs.writeFileSync(file,data.toString(),(err)=>{
	// 			if(!err){
	// 				console.log(err);
	// 			} else{
	// 				console.log("Task done file appended with data");
	// 			}
	// 		})
	// 	}
	// })
	let data = fs.readFileSync(file,"utf8");
	data = JSON.parse(data);
	toAppend.srno = data[data.length-1].srno+1;
	data.push(toAppend);
	fs.writeFileSync(file,JSON.stringify(data));
	return JSON.stringify(toAppend);
}
