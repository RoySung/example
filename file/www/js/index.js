document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
//
function onDeviceReady() {
    alert('onready');
    Filecontroller("write", "readme.txt", "test");
    Filecontroller("read", "readme.txt", null);
}

function Filecontroller(method, fileName, data) {
    if (method == "write") {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, writeFile, errorHandler);
    } else if (method == "read") {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, readFile, errorHandler);
    }

    function writeFile(fileSystem) {
        fileSystem.root.getFile(fileName, {
            create: true,
            exclusive: false
        }, function(fileEntry) {
            fileEntry.createWriter(fileWriter, errorHandler);
        }, errorHandler);
    }

    function readFile(fileSystem) {
        fileSystem.root.getFile(fileName, {
            create: true,
            exclusive: false
        }, function(fileEntry) {
            fileEntry.file(function(file) {
                var reader = new FileReader();
                reader.onloadend = function(e) {
                    console.log(this.result);
                };
                reader.readAsText(file);
            }, errorHandler);
        }, errorHandler);
    }

    function fileWriter(writer) {
        writer.onwriteend = function(evt) {
            console.log("been Writen.");
            // writer.truncate(11);
            // writer.onwriteend = function(evt) {
            //     console.log("contents of file now 'some sample'");
            //     writer.seek(4);
            //     writer.write(" different text");
            //     writer.onwriteend = function(evt) {
            //         console.log("contents of file now 'some different text'");
            //     }
            // };
        };
        writer.write(data);
    }

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
