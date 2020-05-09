var http = require('http'),
    url = require('url'),
    fs   = require('fs'),
    filePath = '../bt_app/public/music/m1.mp3',
    stat = fs.statSync(filePath);

http.createServer(function(request, response) {
    var queryData = url.parse(request.url, true).query;
    //var  skip = typeof(queryData.skip) == 'undefined' ? 0 : queryData.skip;
    var skip = 0.9;
    const startByte = parseInt(stat.size * skip);

    response.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size - startByte
    });

    // We replaced all the event handlers with a simple call to util.pump()
    fs.createReadStream(filePath, {start:startByte}).pipe(response);
})
.listen(2000);