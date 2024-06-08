import app from './app'
import { ApplicationStage } from '../stages/app-stage'
import { Environment } from '../environments'

const ENV = Environment.getInstance()

new ApplicationStage(app, ENV.STAGE.ID, {
  env: {
    account: ENV.STAGE.ACCOUNT,
    region: ENV.STAGE.REGION
  }
})

app.synth()
