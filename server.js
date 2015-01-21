var connect = require('connect'),
    http = require('http'),
    fs = require('fs'),
    app;

// server
app = connect()

// 指定 static file 的路径
// request 进来，先去 static 目录找，没有符合的才进入下一个 middleware
    .use(connect.static('build'))

    .use(function(req, res, next){
        fs.readFile('./build/index.html', function(err, data){
            res.write(data);
            res.end();
        })
    })

// 启动 server 在 8000
http.createServer(app).listen(8000, function() {
    console.log('Running on http://localhost:8000');
});
