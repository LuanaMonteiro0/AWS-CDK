import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb'
import { APIGatewayProxyHandler } from 'aws-lambda'

const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}))

export const handler: APIGatewayProxyHandler = async event => {
  const productID = event.pathParameters.id

  const dynamoResponse = await dynamodb.send(
    new GetCommand({
      Key: { 'product-id': productID },
      TableName: process.env.PRODUCTS_TABLE_NAME
    })
  )
  const body = { product: dynamoResponse }

  return {
    statusCode: 200,
    body: JSON.stringify(body)
  }
}
