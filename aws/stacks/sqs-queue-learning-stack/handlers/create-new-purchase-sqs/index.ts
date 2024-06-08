import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  PutCommand,
  PutCommandInput
} from '@aws-sdk/lib-dynamodb'
import { SQSHandler } from 'aws-lambda'

import { RequestBody } from './types'

import {
  InvokeCommand,
  InvokeCommandOutput,
  LambdaClient
} from '@aws-sdk/client-lambda'
import * as lambda from '@aws-sdk/client-lambda'

const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}))

export const handler: SQSHandler = event => {
  for (const record of event.Records) {
    const body = JSON.parse(record.body) as RequestBody

    const purchaseJson: RequestBody = {
      purchasesId: body.purchasesId,
      description: body.description,
      totalValue: body.totalValue
    }

    const commandInput: PutCommandInput = {
      TableName: process.env.PURCHASES_TABLE_NAME,
      Item: purchaseJson
    }

    const command = new InvokeCommand({
      FunctionName: 'meGetInvoked',
      Payload: Buffer.from(JSON.stringify(purchaseJson))
    })

    const client = new LambdaClient()

    client.send(command)

    const dynamoResponse = dynamodb.send(new PutCommand(commandInput))
  }
}
