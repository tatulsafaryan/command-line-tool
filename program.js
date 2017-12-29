
const fs = require('fs');
const file_read = process.argv[2];
const offset = parseInt(process.argv[3]) * 1024;
const stream = new fs.ReadStream(file_read);

stream.on('readable', function(){
    let data = stream.read();
    let position = 0;
    let file_index = 4;

//Recursive function for recording in files
    function write_File(file_index,position) {

        if(file_index >= process.argv.length ) {
            return console.log("success");
        }
        fs.open(process.argv[file_index], 'w', function(err, fd) {

            if (err) {
                throw 'could not open file: ' + err;
            }
            fs.write(fd, data, position, offset, null, function(err) {

                if (err) {
                    throw 'error writing file: ' + err;
                }
                fs.close(fd, function() {

                    position = position + offset;
                    write_File(file_index + 1,position);
                });
            });
        });
    }
     if(fs.statSync(process.argv[2]).size >= 1073741824) {
        write_File(file_index,position) ;
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
        console.log("File note found․You must pass: 'node program.js <large_file_path> <small file max size> <output directory>' ");
    }else{
        console.error(err);
    }
});
