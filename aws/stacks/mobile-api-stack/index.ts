import { Construct } from 'constructs'
import { Stack, StackProps } from 'aws-cdk-lib'
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb'

//interface Props extends StackProps {
//productsTable: Table
//}

export class MobileAPIStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // const tableProducts = new Table(this, 'products-mob', {
    //     partitionKey: {
    //         name: 'product-id',
    //         type: AttributeType.STRING
    //       },
    //     billingMode: BillingMode.PROVISIONED
    // })
  }
}
