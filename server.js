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
		let JSONstream = returnFileStream("Goals.json",res).pipe(res);
	}

	//  USE THE res.appendHead function and the setStatus function
	// to add the A-C-A-O:* header early on

	else if(path == "/pushToJson" && req.method == "OPTIONS"){
		// did not find method in COR header Access-Control-Allow-Methods
		res.writeHead(200, {"content-type":"text/json","Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"*"});
		console.log(req.url);
		console.log("\n",URL);
		console.log("GOT a modifing request");
		res.end("done!");
		// modifyFile();
	} 
	else if(path == "/pushToJson" && req.method == "PUT"){
		console.log(URL);
		console.log("PUT REQUEST FOUND !!");
		res.end("confusing!!");
	}
	else{
		res.writeHead(404, {"content-type":"text/plain","Access-Control-Allow-Origin":"*"});
		console.log(`undefined request received for ${path}`);
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

function modifyFile(type,file){
	fs.readFile(file,"utf8",(data,err)=>{
		if(err){
			console.log(err);
			return err;
		} else{
			console.log(data);
		}
	})
}