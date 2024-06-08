import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  PutCommand,
  PutCommandInput
} from '@aws-sdk/lib-dynamodb'
import { APIGatewayProxyHandler } from 'aws-lambda'

const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}))

export const handler: APIGatewayProxyHandler = async event => {
  console.log('Starting execution with event:', JSON.stringify(event))

  const body = JSON.parse(event.body)

  const productId = body.productId
  const title = body.title

  const productJson = {
    'product-id': productId,
    title: title
  }

  const commandInput: PutCommandInput = {
    TableName: process.env.PRODUCTS_TABLE_NAME,
    Item: productJson
  }

  console.log('Put command input:', JSON.stringify(commandInput))

  const dynamoResponse = await dynamodb.send(new PutCommand(commandInput))

  return {
    statusCode: 200,
    body: JSON.stringify(dynamoResponse)
  }
}
