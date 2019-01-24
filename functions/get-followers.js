const XRay = require('aws-xray-sdk-core')
const AWS = XRay.captureAWS(require('aws-sdk'))
const DynamoDB = new AWS.DynamoDB.DocumentClient()

const { TABLE_NAME } = process.env
const { TIMEOUT_PERCENTAGE, ERROR_PERCENTAGE } = process.env

module.exports.handler = async (event, context) => {
  const userId = event.pathParameters.userId;

  if (Math.random() <= ERROR_PERCENTAGE) {
    throw new Error('oops')
  }

  if (Math.random() <= TIMEOUT_PERCENTAGE) {
    const timeRemaining = context.getRemainingTimeInMillis()
    await Promise.delay(timeRemaining + 1000) // time out!
  }

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