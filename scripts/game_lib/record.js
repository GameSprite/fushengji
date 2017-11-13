var Record = {
    filepath : fs.writePath + "save.txt",
    data : null,
};

Record.start = function () {
    var buffer = fs.decryptfile(this.filepath);
    if (buffer) {
       this.data = JSON.parse(buffer.toString());
    }
    else{
       this.data = {};
    }
}

Record.save = function () {
    var buffer = new Buffer( JSON.stringify(this.data));
    fs.encryptfile(this.filepath, buffer);
}

Record.load = function () {
    var buffer = fs.decryptfile(this.filepath);
    this.data = JSON.parse(buffer.toString());
}

Record.print = function () {
    console.log(""+JSON.stringify(this.data));
}

Record.isExisted = function(){
    return fs.exist(this.filepath);
}

exports.Record = Record;