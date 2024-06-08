import { Construct } from 'constructs'
import { IEnvironment } from './types'

import { devEnvironment } from './envs/dev'
import { prodEnvironment } from './envs/prod'

const environments: IEnvironment[] = [devEnvironment, prodEnvironment]

export class Environment {
  private static INSTANCE: IEnvironment

  static getInstance() {
    const _INSTANCE = Environment.INSTANCE
    if (_INSTANCE == null) throw new Error('Environment not initialized')
    return _INSTANCE
  }

  static init(app: Construct) {
    if (Environment.INSTANCE != null) {
      throw new Error('Environment already initialized')
    }

    const stage = app.node.tryGetContext('stage') as string

    if (!stage) {
      throw new Error('Missing stage context. Usage: cdk deploy -c stage=dev')
    }

    const envIndex = environments.findIndex(e => e.STAGE.ID === stage)
    if (envIndex === -1) {
      throw new Error(
        'Invalid stage context. Available contexts: ' +
          environments.map(env => env.STAGE.ID).join(', ')
      )
    }

    this.INSTANCE = {} as any
    Object.assign(this.INSTANCE, environments[envIndex])
  }
}
