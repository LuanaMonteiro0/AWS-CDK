import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'
import { APIGatewayProxyHandler } from 'aws-lambda'

const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}))

export const handler: APIGatewayProxyHandler = async () => {
  const dynamoResponse = await dynamodb.send(
    new ScanCommand({
      TableName: process.env.PRODUCTS_TABLE_NAME
    })
  )
  const body = { products: dynamoResponse.Items }

  return {
    statusCode: 200,
    body: JSON.stringify(body)
  }
}
