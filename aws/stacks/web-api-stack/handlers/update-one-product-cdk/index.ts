import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { APIGatewayProxyHandler } from 'aws-lambda'

const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}))

export const handler: APIGatewayProxyHandler = async event => {
  console.log('Starting execution with event:', JSON.stringify(event))

  const body = JSON.parse(event.body)

  const productId = body.productId
  const title = body.title

  const dynamoResponse = await dynamodb.send(
    new UpdateCommand({
      TableName: process.env.PRODUCTS_TABLE_NAME,
      Key: { 'product-id': productId },
      UpdateExpression: 'set title = :n',
      ExpressionAttributeValues: {
        ':n': title
      },
      ReturnValues: 'UPDATED_NEW'
    })
  )

  return {
    statusCode: 200,
    body: JSON.stringify(dynamoResponse)
  }
}
