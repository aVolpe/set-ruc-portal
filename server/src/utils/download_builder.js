var config = {
  origin : './set-customers/result.txt',
  // origin : 'temp/t1.txt',
  csv_dest : './server/temp/data.csv',
  json_dest : './server/temp/data.json',
};

function doWork(origin, output, process) {
    var fs = require('fs');
    var lineReader = require('readline').createInterface({
        input: fs.createReadStream(origin)
    });

    var stream = fs.createWriteStream(output);
    stream.once('open', function(fd) {


        lineReader.on('line', function(line) {
            process(stream, line);
        });

        lineReader.on('pause', function(endCallback) {
            stream.end();
        });
    });
}

function transformCsv() {

    function fixKnowBugs(line) {

        var finalLine = line.substr(0, line.lastIndexOf('|'));
        if (finalLine.indexOf('"') > 0)
            finalLine = finalLine.replace('"', '');
        if (finalLine.indexOf('||') > 0)
            finalLine = finalLine.replace('||', '|');
        if (finalLine.indexOf('N| 211') > 0)
            finalLine = finalLine.replace('N| 211', 'N 211');
        if (finalLine.indexOf('M|LLER') > 0)
            finalLine = finalLine.replace('M|LLER', 'MULLER');

        return finalLine;
    }
    var first = true;
    doWork(config.origin, config.csv_dest, function(stream, line) {
        if (first) {
            stream.write('ruc|nombre|div|ruc_viejo\n');
            first = false;
        }
        if (!line) return;
        stream.write(fixKnowBugs(line) + '\n');
    });
}

function transformJson() {
    return doWork(config.csv_dest, config.json_dest, function(stream, line) {
        if (!line) return;
        var parts = line.split('|');
        stream.write(JSON.stringify({
            ruc        : parts[0],
            nombre     : parts[1],
            div        : parts[2],
            ruc_viejo  : parts[3]
        }));
    });
}

if (process.argv[2] === 'csv')
  transformCsv();
if (process.argv[2] === 'json')
  transformJson();

