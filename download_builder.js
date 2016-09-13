var config = {
  origin : 'set-customers/result.txt',
  csv_dest : 'temp/data.csv',
  json_file : 'temp/data.json',
}

function doWork(output, process) {
    var fs = require('fs');
    var lineReader = require('readline').createInterface({
        input: fs.createReadStream(config.origin)
    });
    
    var stream = fs.createWriteStream(output);
    stream.once('open', function(fd) {
        
        stream.write('ruc|nombre|div|ruc_viejo\n');
        
        lineReader.on('line', function(line) {
            process(stream, line);
        })
        
        lineReader.on('pause', function(endCallback) {
            stream.end();
        })
    });
}

function transformCsv() {
    doWork(config.csv_dest, function(stream, line) {
        if (!line) return;
        var finalLine = line.substr(0, line.lastIndexOf('|'));
        stream.write(finalLine + '\n');
    })
}

function transformJson() {
    doWork(config.json_file, function(stream, line) {
        if (!line) return;
        var parts = line.split('|');
        stream.write(JSON.stringify({
            ruc        : parts[0],
            nombre     : parts[1],
            div        : parts[2],
            ruc_viejo  : parts[3]
        }));
    })
}

transformCsv();
transformJson();