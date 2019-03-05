# file-to-s3-b64
Module to load a file (base64) in s3. Useful for upload files using API.

# Install

The easiest way to install acorn is with [`npm`][npm].

[npm]: https://www.npmjs.com/

```sh
npm install file-to-s3-b64
```

Alternately, download the source.

```sh
git clone https://github.com/stephaniepinero/file-to-s3-b64.git
```

## Usage


```
const S3Files = require('file-to-s3-b64');  

let s3File = new S3Files({s3Bucket: "bucketName"});

let response = await s3File.uploadFile({
          filename: 'filaName',
          fileBase64String: 'fileBase64String'
});
```
The name of the bucket can be defined in the S3Files declaration or as an option in uploadFile.

uploadFile return true or false.
