/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var MOVIES_FILE = path.join(__dirname, 'movies.json');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
  // Set permissive CORS header - this allows this server to be used only as
  // an API server in conjunction with something like webpack-dev-server.
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Disable caching so we'll always get the latest comments.
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.get('/api/movies', function(req, res) {
  fs.readFile(MOVIES_FILE, {
    encoding: 'utf-8'
  }, function(err, data) {
    if (err) {
      res.status(500).send('Something broke!');
      console.error(err);
      return;
      //process.exit(1);
    }
    data = data.replace(/^\uFEFF/, '');
    res.json(JSON.parse(data));
  });
});
upload = function(req, res, next) {
  console.log("upload");
  var message = '';
  var form = new formidable.IncomingForm(); //创建上传表单
  form.encoding = 'utf-8'; //设置编辑
  form.uploadDir = './'; //设置上传目录
  form.keepExtensions = true; //保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024; //文件大小

  form.parse(req, function(err, fields, files) {
    if (err) {
      console.log(err);
    }


    if (files.resource) {
      var filename = files.resource.name;

      // 对文件名进行处理，以应对上传同名文件的情况
      //var nameArray = filename.split('.');
      //var type = nameArray[nameArray.length-1];
      //var name = '';
      //for(var i=0; i<nameArray.length-1; i++){
      //    name = name + nameArray[i];
      //}
      //var rand = Math.random()*100 + 900;
      //var num = parseInt(rand, 10);
      //
      //var avatarName = name + num +  '.' + type;

      var newPath = form.uploadDir + filename;
      console.log(files.resource.path);
      //fs.writeFile();
      fs.renameSync(files.resource.path, newPath);
    }
    //重命名
  });
  //res.sendStatus(200);
  res.redirect('/');
};
app.post('/fileupload', upload);
app.post('/api/movies', function(req, res) {

  //fs.readFile(MOVIES_FILE, function(err, data) {
  //  if (err) {
  //    console.error(err);
  //    process.exit(1);
  //  }
  //console.log(req.body);
  //var content = JSON.parse(req.body);
  //console.log(content.movies.length);
  // NOTE: In a real implementation, we would likely rely on a database or
  // some other approach (e.g. UUIDs) to ensure a globally unique id. We'll
  // treat Date.now() as unique-enough for our purposes.
  //var newComment = {
  //  id: Date.now(),
  //  author: req.body.author,
  //  text: req.body.text,
  //};
  //console.log(JSON.stringify(comments));
  //comments.push(newComment);
  fs.writeFile(MOVIES_FILE, JSON.stringify(req.body, null, 4), function(err) {
    if (err) {
      res.status(500).send('Something broke!');
      console.error(err);
      return;
      //process.exit(1);
    }
    res.json(req.body);
  });

});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
