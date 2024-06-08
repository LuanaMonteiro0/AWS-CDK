import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  DeleteCommand,
  DeleteCommandInput
} from '@aws-sdk/lib-dynamodb'
import { APIGatewayProxyHandler } from 'aws-lambda'

const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}))

export const handler: APIGatewayProxyHandler = async event => {
  const productId = event.pathParameters.id

  const commandInput: DeleteCommandInput = {
    TableName: process.env.PRODUCTS_TABLE_NAME,
    Key: { 'product-id': productId }
  }

  console.log('Delete command input:', JSON.stringify(commandInput))

  const dynamoResponse = await dynamodb.send(new DeleteCommand(commandInput))

  return {
    statusCode: 200,
    body: JSON.stringify(dynamoResponse)
  }
}
