const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const fileType = require('file-type');

class S3Files {

    constructor(props = {}) {
        this.s3Bucket = props.s3Bucket || null;
    }

    uploadFile(data = {}){
        return new Promise(async (resolve, reject) => {
            try{
                if (data.fileBase64String == "undefined") return reject("fileBase64String Should be Defined.");
                if (!data.s3Bucket && !this.s3Bucket) return reject("s3Bucket Should be Defined.");
                let buffer = new Buffer(data.fileBase64String, 'base64');
                let fileMime = fileType(buffer);
                
                if (fileMime === null) {
                    return reject("The string suppplied is not a file type")
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
                        resolve(true);
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
            let fN = fileData.data.filename;
            if(!fileData.data.filename){
                fN = `File-${new Date().getTime()}`;
            }

            let fileName = `${fN}.${fileExt}`;
            let fileFullName =`${fileName}`;
    
            let bucketName = fileData.data.s3Bucket || this.s3Bucket ;
    
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
