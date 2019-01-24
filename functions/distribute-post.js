const XRay  = require('aws-xray-sdk-core')
const https = XRay.captureHTTPs(require('https'))

const { GET_FOLLOWERS_URL } = process.env

module.exports.handler = async (event, context) => {
  const promises = event.Records.map(record => {
    const json = new Buffer(record.kinesis.data, 'base64').toString('utf8')
    const { userId } = JSON.parse(json).event
    
    const url = `${GET_FOLLOWERS_URL}/${userId}`
    console.log(`getting followers for ${userId}: GET ${url}`)

    return new Promise((resolve, reject) => {
      const req = https.request(url, res => {  
        res.on('data', buffer => resolve(buffer.toString('utf8')));
      });
  
      req.on('error', err => reject(err));  
      req.end();
    })
  })

  const results = await Promise.all(promises)
  console.log(JSON.stringify(results))
}