import { IEnvironment } from '../types'

export const devEnvironment: IEnvironment = {
  STAGE: {
    ID: 'dev',
    ACCOUNT: '992382603478',
    REGION: 'us-east-1'
  },
  MOBILE_API: {
    IMAGES_BUCKET: 'projectx-images-bucket-dev',
    REQUESTS_TABLE: 'requests'
  },
  WEB_API: {
    IMAGES_BUCKET: 'projectx-images-bucket',
    REQUESTS_TABLE: 'requests'
  },
  QUEUE_LEARNING: {
    IMAGES_BUCKET: 'projectx-images-bucket',
    REQUESTS_TABLE: 'requests'
  }
}
