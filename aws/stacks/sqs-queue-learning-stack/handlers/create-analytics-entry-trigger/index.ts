import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  PutCommand,
  PutCommandInput
} from '@aws-sdk/lib-dynamodb'
import { DynamoDBStreamHandler } from 'aws-lambda'

const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}))

export const handler: DynamoDBStreamHandler = async event => {
  console.log(`This event is coming from trigger ${event}`)

  console.log(`This is it's string ${JSON.stringify(event)}`)

  for (let record of event.Records) {
    const eventId = JSON.stringify(record.eventID)
    const userIdentity = JSON.stringify(record.userIdentity)
    const creationDate = JSON.stringify(
      record.dynamodb.ApproximateCreationDateTime
    )

    const item = {
      eventId,
      userIdentity,
      creationDate
    }

    const commandInput: PutCommandInput = {
      TableName: process.env.PURCHASES_ANALYTICS_TABLE_NAME,
      Item: item
    }

    await dynamodb.send(new PutCommand(commandInput))
  }
}
