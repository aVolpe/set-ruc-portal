var ex = module.exports = {};

var data = ex.data = {
    sourceFile : 'set-customers/result.txt'
    //sourceFile : 't1.txt'
};

ex.readByRow = function(lineCallback, endCallback) {
    var lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(data.sourceFile)
    });
    
    lineReader.on('line', function (line) {
        if (!line) return;
        var parts = line.split('|');
        lineCallback({
            $doc  : parts[0],
            $name : parts[1],
            $div  : parts[2],
            $old  : parts[3]
        });
    });    
    
    lineReader.on('pause', endCallback);
};