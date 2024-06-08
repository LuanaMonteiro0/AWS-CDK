import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
const sqsClient = new SQSClient({ region: 'us-east-1' })

import { APIGatewayProxyHandler } from 'aws-lambda'

import { v4 as uuidv4 } from 'uuid'

import { requestBody } from './types'

export const handler: APIGatewayProxyHandler = async event => {
  let values = JSON.parse(event.body)
  let response

  let valueResponse: requestBody = {
    purchasesId: uuidv4(),
    description: values.description,
    totalValue: values.totalValue
  }

  const params = {
    DelaySeconds: 10,
    MessageBody: JSON.stringify(valueResponse),
    QueueUrl: process.env.PURCHASES_QUEUE_URL
  }

  try {
    const data = await sqsClient.send(new SendMessageCommand(params))
    if (data) {
      console.log('Success, message sent. MessageID:', data.MessageId)
      console.log(`Message ${data}`)
      const bodyMessage = `Message Send to SQS- Here is purchasesId: ${valueResponse.purchasesId}`
      response = {
        statusCode: 200,
        body: JSON.stringify(bodyMessage)
      }
    } else {
      response = {
        statusCode: 500,
        body: JSON.stringify('Some error occured !!')
      }
    }
    return response
  } catch (err) {
    console.log('Error', err)
  }
}
