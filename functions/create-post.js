const uuid     = require('uuid/v4')
const XRay     = require('aws-xray-sdk-core')
const AWS      = XRay.captureAWS(require('aws-sdk'))
const DynamoDB = new AWS.DynamoDB.DocumentClient()
const Kinesis  = new AWS.Kinesis()
const Promise  = require('bluebird')

const { TABLE_NAME, STREAM_NAME } = process.env
const { TIMEOUT_PERCENTAGE, ERROR_PERCENTAGE } = process.env

module.exports.handler = async (event, context) => {
  const { userId, message } = JSON.parse(event.body)
  const postId = uuid()

  if (Math.random() <= ERROR_PERCENTAGE) {
    throw new Error('oops')
  }

  if (Math.random() <= TIMEOUT_PERCENTAGE) {
    const timeRemaining = context.getRemainingTimeInMillis()
    await Promise.delay(timeRemaining + 1000) // time out!
  }

  await DynamoDB.put({
    TableName: TABLE_NAME,
    Item: {
      userId,
      postId,
      message
    }
  }).promise()

  await Kinesis.putRecord({
    Data: JSON.stringify({
      eventType: 'post-created',
      event: {
        userId,
        postId,
        message
      }
    }),
    StreamName: STREAM_NAME,
    PartitionKey: userId
  }).promise()

  return {
    statusCode: 200,
    body: JSON.stringify({
      postId
    })
  }
}