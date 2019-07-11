var http = require('http'),
    fs = require('fs'),
    util = require('util');

http.createServer(function (req, res) {
    var path = './1.mp4';
    var stat = fs.statSync(path);
    console.log(stat);

    var total = stat.size;
    if (req.headers['range']) {
        var range = req.headers.range;
        var parts = range.replace(/bytes=/, "").split("-");
        var partialstart = parts[0];
        var partialend = parts[1];

        var start = parseInt(partialstart, 10);
        var end = partialend ? parseInt(partialend, 10) : total - 1;
        var chunksize = (end - start) + 1;
        console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

        var file = fs.createReadStream(path, {
            start: start,
            end: end
        });
        res.writeHead(200, {
            "Connection": "keep-alive",
            'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4;charset=utf-8',
            // 'Content-Disposition': "attachment;filename=p.mp4"
        });
        file.pipe(res);
    } else {
        console.log('ALL: ' + total);
        res.writeHead(200, {
            "Connection": "keep-alive",
            'Content-Length': total,
            'Content-Type': 'video/mp4;charset=utf-8',
            // 'Content-Disposition': "attachment;filename=p.mp4"  
        });
        fs.createReadStream(path).pipe(res);
    }
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/ 请打开index.html查看效果');