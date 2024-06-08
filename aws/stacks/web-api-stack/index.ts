import { Construct } from 'constructs'
import { Stack, StackProps } from 'aws-cdk-lib'
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb'

import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as path from 'path'

import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

export class WebAPIStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const tableProducts = new Table(this, 'products-web', {
      partitionKey: {
        name: 'product-id',
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PROVISIONED
    })

    const api = new RestApi(this, 'products-cdk-rest-api', {
      restApiName: 'Products API service w/ Rest and CDK'
    })

    const createOne = new NodejsFunction(this, 'lambda-function-create', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, './handlers/create-new-product-cdk/index.ts'),
      environment: {
        PRODUCTS_TABLE_NAME: tableProducts.tableName
      }
    })

    const listAll = new NodejsFunction(this, 'lambda-function-read-all', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, './handlers/read-all-products-cdk/index.ts'),
      environment: {
        PRODUCTS_TABLE_NAME: tableProducts.tableName
      }
    })

    const listOne = new NodejsFunction(this, 'lambda-function-read-one', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, './handlers/read-one-product-cdk/index.ts'),
      environment: {
        PRODUCTS_TABLE_NAME: tableProducts.tableName
      }
    })

    const updateOne = new NodejsFunction(this, 'lambda-function-update-one', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, './handlers/update-one-product-cdk/index.ts'),
      environment: {
        PRODUCTS_TABLE_NAME: tableProducts.tableName
      }
    })

    const deleteOne = new NodejsFunction(this, 'lambda-function-delete-one', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, './handlers/delete-one-product-cdk/index.ts'),
      environment: {
        PRODUCTS_TABLE_NAME: tableProducts.tableName
      }
    })

    tableProducts.grantReadData(listAll)
    tableProducts.grantWriteData(createOne)
    tableProducts.grantReadData(listOne)
    tableProducts.grantReadWriteData(updateOne)
    tableProducts.grantReadWriteData(deleteOne)

    const listAllIntegration = new LambdaIntegration(listAll)
    const createOneIntegration = new LambdaIntegration(createOne)
    const listOneIntegration = new LambdaIntegration(listOne)
    const updateOneIntegration = new LambdaIntegration(updateOne)
    const deleteOneIntegration = new LambdaIntegration(deleteOne)

    const products = api.root.addResource('products')
    products.addMethod('GET', listAllIntegration)
    products.addMethod('POST', createOneIntegration)

    const singleProductRoutes = products.addResource('{id}')
    singleProductRoutes.addMethod('GET', listOneIntegration)
    singleProductRoutes.addMethod('PUT', updateOneIntegration)
    singleProductRoutes.addMethod('DELETE', deleteOneIntegration)
  }
}
