var argv = require('yargs').argv;

var path = require('path');


var walk = require('walk');
var humanSize = require('human-size');


function scan(dir, callback){
  var walker = walk.walk(dir);

  callback = callback || function (){};

  walker.on('file', function (root, stats, next){

    var now = new Date().getTime();

    var timeKey = 'mtime';


    var file = path.join(root, stats.name);

    var fileTimestamp = new Date(stats[timeKey]).getTime();

    var obj = {
      time : fileTimestamp,
      file : file,
      size : stats.size
    }

    if (fileTimestamp > now ){
      print(obj);
    }



    next();
  });

  walker.on('directory', function (root, stats, next){
    next();
  });


  walker.on("errors", function (file, nodeStatsArray, next){
    next();
  });

  walker.on('end', callback);
}

function print(obj){

  var timestamp = new Date(obj.time).toISOString();

  var str = [timestamp, obj.file];


  obj.size = (argv.h) ? humanSize(obj.size) : obj.size;

  obj.time = (argv.t) ? obj.time : new Date(obj.time).toISOString();



  if (argv.j){
    return console.log(JSON.stringify(obj, null, 2))
  }

  if (argv.l){
    // listing
    var str = [timestamp, obj.size, obj.file].join(' ');
    return console.log(str);
  }


  return console.log(obj.file);
}

if (argv._.length === 0){
  return console.log(`
    usage future <dir> [-hl]
    -h     human size
    -l     listing
    -j     json
    -e     epoch timing
    `);
}

scan(argv._[0])
