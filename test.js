var fs = require('fs');
var client = require('cheerio-httpcli');
var crypto = require('crypto');

var async = require('async');
require('date-utils');
var rettext = "";

var word = "パチスロ ナイツ　4号機"
var tree = 9;
if(process.argv.length>2){
        word = process.argv[2];
}
if(process.argv.length>3){
        tree = process.argv[3];
}

if(fs.existsSync('tmp')==false||fs.statSync('tmp').isDirectory()!=false){
        fs.mkdirSync('tmp');
}

var targetUrls = [];

var dt = new Date()
var formatted = dt.toFormat("YYYYMMDDHH24MISS");
var c_path = __dirname+'/tmp/'+formatted
fs.mkdirSync(c_path);
client.fetch('http://www.google.com/search', { q: word }, function(err, $, res, body) {
        client.download.on('ready', function(stream) {
                        var array = stream.url.href.split("/");
                        var original_name = array[array.length - 1]
                        stream.pipe(fs.createWriteStream(c_path + '/' + original_name));
                        console.log(original_name + 'をダウンロードしました('+ (this.state.complete+1) + '\/' + (this.state.complete + this.state.queue) + ')');
                })
                .on('error', function(err) {
                        console.log(err.url + 'をダウンロードできませんでした: ' + err.message);
                })
                .on('end', function() {
                        console.log('ダウンロードが完了しました');
                });
        $('#rso .g').each(function(idx) {
                if (!(idx < tree)) {
                        return false;
                }
                var link = $(this).find('h3').find('a').url();
                console.log(link)
                client.fetch(link, function(err, $, res, body) {
                        // ③class="thumbnail"の画像を全部ダウンロード
                        var targetcount = 0;
                        $('[href]').each(function(e, i) {
                                var array = i.attribs.href.split("/")
                                var filename = array[array.length - 1];
                                var array = filename.split('.')
                                var type = array[array.length - 1]
                                if (type.toLowerCase() == 'jpg'||
                                      type.toLowerCase() == 'jpeg'||
                                      type.toLowerCase() == 'png'||
                                      type.toLowerCase() == 'gif'
                                        ) {
                                        $('<img src="' + i.attribs.href + '"">').download();
                                        targetcount++;
                                }
                        })
                        var title = $('title')[0].children[0].data;
                        console.log("「"+title+'」で'+targetcount+"個の対象を発見");
                });
        });
});



function md5_hex(src) {
        var md5 = crypto.createHash('md5');
        md5.update(src, 'utf8');
        return md5.digest('hex');
}