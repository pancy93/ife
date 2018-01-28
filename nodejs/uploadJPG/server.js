var http=require('http');
var handlers=require('./handlers');
var url=require('url');

var handle={
	'/' : handlers.start,
	'/start' : handlers.start,
	'/upload' : handlers.upload,
	'/show' : handlers.show
}

function start(){
	server=http.createServer(function (request,response) {
		
			//route
			var pathname=url.parse(request.url).pathname;
			if(typeof handle[pathname]==="function"){
				handle[pathname](request,response);
			}else {
				console.log('no handler found for'+pathname);
				response.end('404 not found');
			}
		});

	server.listen(8888);
	console.log('started');
}

exports.start=start;