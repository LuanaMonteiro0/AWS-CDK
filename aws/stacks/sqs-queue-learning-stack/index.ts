import { Construct } from 'constructs'
import { Duration, Stack, StackProps, aws_logs } from 'aws-cdk-lib'
import {
  AttributeType,
  BillingMode,
  Table,
  StreamViewType
} from 'aws-cdk-lib/aws-dynamodb'

import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as path from 'path'

import {
  LambdaIntegration,
  RestApi,
  ApiKey,
  UsagePlanProps,
  Period,
  Method
} from 'aws-cdk-lib/aws-apigateway'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

import * as sqs from 'aws-cdk-lib/aws-sqs'
import {
  DynamoEventSource,
  SqsEventSource
} from 'aws-cdk-lib/aws-lambda-event-sources'

export class SqsLearningStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const tablePurchases = new Table(this, 'purchases-web', {
      tableName: 'purchases',
      partitionKey: {
        name: 'purchasesId',
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PROVISIONED,
      stream: StreamViewType.NEW_AND_OLD_IMAGES
    })

    const tablePurchasesAnalytics = new Table(this, 'purchases-analytics-web', {
      tableName: 'purchases-analytics-renamed',
      partitionKey: {
        name: 'eventId',
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PROVISIONED
    })

    const api = new RestApi(this, 'purchases-sqs-cdk-rest-api', {
      restApiName: 'Purchases API service w/ SQS queue service'
    })

    const apiKey = new ApiKey(this, 'first-api-key', {
      apiKeyName: 'first-api-key-implements',
      description:
        'this apiKey will be used as a first example of apiKey usage',
      enabled: true,
      value: '123456789012345678901234567'
    })

    const usagePlanProps: UsagePlanProps = {
      name: 'usage-plan-to-first-api-key',
      apiStages: [{ api: api, stage: api.deploymentStage }],
      throttle: { burstLimit: 5, rateLimit: 10 },
      quota: { limit: 1000, period: Period.DAY }
    }

    const plan = api.addUsagePlan('usage-plan-to-first-api-key', usagePlanProps)
    api.addApiKey('first-api-key-implements')

    plan.addApiKey(apiKey)

    const queue = new sqs.Queue(this, 'queue', {
      queueName: 'purchases-queue',
      encryption: sqs.QueueEncryption.KMS_MANAGED,
      visibilityTimeout: Duration.seconds(15)
    })

    const sendSqsMessage = new NodejsFunction(
      this,
      'lambda-function-send-sqs',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(
          __dirname,
          './handlers/send-purchase-data-to-queue-sqs/index.ts'
        ),
        environment: {
          PURCHASES_TABLE_NAME: tablePurchases.tableName,
          PURCHASES_QUEUE_URL: queue.queueUrl
        }
      }
    )

    const createOne = new NodejsFunction(this, 'lambda-function-create', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(
        __dirname,
        './handlers/create-new-purchase-sqs/index.ts'
      ),
      environment: {
        PURCHASES_TABLE_NAME: tablePurchases.tableName
      }
    })

    const createOneAnalytics = new NodejsFunction(
      this,
      'lambda-function-create-analytics',
      {
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(
          __dirname,
          './handlers/create-analytics-entry-trigger/index.ts'
        ),
        environment: {
          PURCHASES_ANALYTICS_TABLE_NAME: tablePurchasesAnalytics.tableName
        }
      }
    )

    const invokeMe = new NodejsFunction(this, 'lambda-function-invoke-me', {
      functionName: 'meGetInvoked',
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(
        __dirname,
        './handlers/call-function-with-invoke/index.ts'
      )
    })

    createOne.addEventSource(new SqsEventSource(queue, { batchSize: 10 }))

    createOneAnalytics.addEventSource(
      new DynamoEventSource(tablePurchases, {
        startingPosition: lambda.StartingPosition.LATEST
      })
    )

    queue.grantSendMessages(sendSqsMessage)
    queue.grantConsumeMessages(createOne)

    tablePurchases.grantWriteData(createOne)

    tablePurchasesAnalytics.grantWriteData(createOneAnalytics)

    invokeMe.grantInvoke(createOne)

    const createOneIntegration = new LambdaIntegration(createOne)
    const sendSqsIntegration = new LambdaIntegration(sendSqsMessage)
    const createOneAnalyticsIntegration = new LambdaIntegration(
      createOneAnalytics
    )
    const invokingFunctionIntegration = new LambdaIntegration(invokeMe)

    const purchases = api.root.addResource('purchases')
    purchases.addMethod('POST', sendSqsIntegration, { apiKeyRequired: true })

    const EntryPath = path.join(
      __dirname + '/custom-authorizer-lambda/index.ts'
    )

    const autentication = new NodejsFunction(this, 'AuthorizerFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(
        __dirname,
        './handlers/custo-authorizer-lambda/Autentication.ts'
      )
    })

    const authorizer = new NodejsFunction(this, 'AuthorizerFunction', {
      bundling: {
        sourceMap: true,
        minify: true
      },
      description: 'Lambda Authorizer',
      entry: EntryPath,
      environment: {
        NODE_OPTIONS: '--enable-source-maps'
      },
      logRetention: aws_logs.RetentionDays.ONE_DAY,
      memorySize: 512,
      timeout: Duration.minutes(2)
    })
  }
}
