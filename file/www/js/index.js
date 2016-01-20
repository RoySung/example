document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
//
function onDeviceReady() {
    alert('onready');
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, getFile, errorHandler);
}

function getFile(fileSystem) {
    alert('getFile');
    fileSystem.root.getFile("readme.txt", {
        create: true,
        exclusive: false
    }, fileEntry, errorHandler);
}

function fileEntry(fileEntry) {
    fileReader(fileEntry);
    fileEntry.createWriter(fileWriter, errorHandler);
}

function fileReader(fileEntry) {
    fileEntry.file(function(file) {
        var reader = new FileReader();
        reader.onloadend = function(e) {
            console.log(this.result);
        };
        reader.readAsText(file);
    }, errorHandler);
}

function fileWriter(writer) {
    writer.onwriteend = function(evt) {
        console.log("contents of file now 'some sample text'");
        writer.truncate(11);
        writer.onwriteend = function(evt) {
            console.log("contents of file now 'some sample'");
            writer.seek(4);
            writer.write(" different text");
            writer.onwriteend = function(evt) {
                console.log("contents of file now 'some different text'");
            }
        };
    };
    writer.write("some sample text");
}


var errorHandler = function(fileName, e) {
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'Storage quota exceeded';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'File not found';
            break;
        case FileError.SECURITY_ERR:
            msg = 'Security error';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'Invalid modification';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'Invalid state';
            break;
        default:
            msg = 'Unknown error';
            break;
    };

    console.log('Error (' + fileName + '): ' + msg);
}
