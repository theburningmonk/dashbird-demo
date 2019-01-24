const XRay = require('aws-xray-sdk-core')
const AWS = XRay.captureAWS(require('aws-sdk'))
const DynamoDB = new AWS.DynamoDB.DocumentClient()

const { TABLE_NAME } = process.env

module.exports.handler = async (event) => {
  const userId = event.pathParameters.userId;
  const resp = await DynamoDB.query({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise()

  const followers = resp.Items.map(x => x.followerId)

  return {
    statusCode: 200,
    body: JSON.stringify({ followers })
  }
}