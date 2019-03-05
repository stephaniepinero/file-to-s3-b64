const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const moment = require('moment');
const fileType = require('file-type');

class S3Files {

    constructor(props = {}) {
        if (props.fileBase64String == "undefined") throw new Exception("fileBase64String Should be Defined.");
        this.fileBase64String = props.fileBase64String;
        this.s3Bucket = props.s3Bucket || null;
    }

    uploadFile(data = {}){
        return new Promise(async (resolve, reject) => {
            try{
                let buffer = new Buffer(this.fileBase64String, 'base64');
                let fileMime = fileType(buffer);
                
                if (fileMime === null) {
                    throw new Exception("The string suppplied is not a file type")
                }
                let fileData = {
                    fileMime: fileMime,
                    buffer: buffer,
                    data: data
                }
                let file = await this.getFile(fileData);
                let params = file.params;
                s3.putObject(params, function(err, data) {
                    if (err) {
                        reject(err);
                    }else{
                        resolve(`File URL ${file.uploadFile.full_path}`);
                    }
                })
            }catch(error){
                reject(error);
            }
          
        });
    }

    getFile(fileData){
        return new Promise(async (resolve, reject) => {
            let fileExt = fileData.fileMime.ext;
            let now = moment().format('YYY-MM-DD HH:mm:ss');
            
            let fileName = `${fileData.data.filename}.${fileExt}`;
            let fileFullName =`${fileName}`;
    
            let bucketName = fileData.data.s3Bucket || this.s3Bucket;
    
            if(!bucketName){
                bucketName = `File-${new Date().getTime()}`;
            }
            let fileFullPath = `${bucketName}/${fileFullName}`;
            
            let params = {
                Bucket: bucketName,
                Key: fileFullName,
                Body: fileData.buffer
            };
            
            let uploadFile = {
                size: fileData.buffer.toString('ascii').length,
                type: fileData.fileMime.mime,
                name: fileData.fileName,
                full_path: fileFullPath
            };
            
            resolve( {
                'params': params,
                'uploadFile': uploadFile
            });

        });
    }
}

module.exports = S3Files;