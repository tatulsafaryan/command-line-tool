
const fs = require('fs');
const file_read = process.argv[2];
const offset = parseInt(process.argv[3]) * 1024;
const stream = new fs.ReadStream(file_read);

stream.on('readable', function(){
    let data = stream.read();
    let position = 0;
    let output_directory = 4;

    function write_File(output_directory,position) {

        if(output_directory >= process.argv.length ) {
            return console.log("success");
        }
        fs.open(process.argv[output_directory], 'w', function(err, fd) {

            if (err) {
                throw 'could not open file: ' + err;
            }
            fs.write(fd, data, position, offset, null, function(err) {

                if (err) {
                    throw 'error writing file: ' + err;
                }
                fs.close(fd, function() {

                    position = position + offset;
                    write_File(output_directory + 1,position);
                });
            });
        });
    }
     if(fs.statSync(process.argv[2]).size >= 1073741824) {
        write_File(output_directory,position) ;
     }
     else {
        return console.log("Your file smaller 1GB")
     }


});

stream.on('end', function(){
    console.log("THE END");
});

stream.on('error', function(err){
    if(err.code == 'ENOENT'){
        console.log("Файл не найден");
    }else{
        console.error(err);
    }
});
