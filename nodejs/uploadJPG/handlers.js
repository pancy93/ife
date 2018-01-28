var fs=require('fs');
var formidable=require('formidable');
var util=require('util');

function start(req,res){
	console.log('handler "start" was called');
	var body='<html>'+
		'<head>'+
		'<meta charset="UTF-8" />'+
		'<head>'+
		'<body>'+
		'<form action="/upload" method="post" enctype="multipart/form-data">'+
		'<input type="file" name="upload" multiple="multiple"/>'+
		'<input type="submit" value="upload"/>'+
		'</form>'+
		'</body>'+
		'</html>';
	res.writeHead(200,{'Content-Type':'text/html'});
	res.write(body);
	res.end();
}

function upload(req,res){
	console.log('handler "upload" was called');
	
	
	var form=new formidable.IncomingForm();
	form.uploadDir='tmp';
	form.parse(req,function (err,fields,files){
		console.log({'fields':fields,'files':files});
		
		//write file to /tmp/test.jpg
		
		fs.renameSync(files.upload.path,'./tmp/test.jpg');
		res.writeHead(200,{'Content-Type':'text/html'});
		res.write('received image:<br/>');
		res.write('<img src="/show" />');
		res.end();
	});
	
}

function show(req,res){
	console.log('handler "show" was called');
	fs.readFile("./tmp/test.jpg",'binary',function (err,file){
		if(err){
			console.log(err);
			res.end("err");
		}else{
			res.writeHead(200,{"Content-Type":"image/jpg"});
			res.write(file,'binary');
			res.end();
		}
	});
}

exports.start=start;
exports.upload=upload;
exports.show=show;