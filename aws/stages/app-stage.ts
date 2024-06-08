import { Construct } from 'constructs'
import { Stage, StageProps } from 'aws-cdk-lib'
import { MobileAPIStack } from '../stacks/mobile-api-stack'
import { WebAPIStack } from '../stacks/web-api-stack'
import { SqsLearningStack } from '../stacks/sqs-queue-learning-stack'

export class ApplicationStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props)

    // Aqui, estamos incluindo nossa MobileAPIStack como parte da aplicação
    //new MobileAPIStack(this, 'mobile-api-stack', {...props, productsTable: ''})

    //aqui incluo a WebAPIStack como parte da aplicação
    new WebAPIStack(this, 'web-api-stack', props)

    //criarei uma stack nova para uso do sqs
    new SqsLearningStack(this, 'sqs-learning-stack', props)
  }
}
