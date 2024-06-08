import * as cdk from 'aws-cdk-lib'
import { Environment } from '../environments'

const app = new cdk.App()
Environment.init(app)

export default app
