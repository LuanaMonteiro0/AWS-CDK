import {
  APIGatewayAuthorizerEvent,
  APIGatewayAuthorizerResult
} from 'aws-lambda'
import Authentication, { AuthenticationInfo } from './Autentication'

export const handler = async (
  event: APIGatewayAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  const authentication = await authenticate(event)

  const context = JSON.stringify({
    someString: 'some value',
    someBoolean: true,
    someNumber: 1
  })

  const result: APIGatewayAuthorizerResult = {
    principalId: authentication.value?.id || 'unkown',
    policyDocument: buildPolicy(
      authentication.success ? 'Allow' : 'Deny',
      event.methodArn
    )
  }

  return result
}

async function authenticate(event: any): Promise<any> {
  try {
    const token = getTokenOrThrow(event)
    const info = await Authentication.getUserInfo(token)
    return { success: true, value: info }
  } catch (error: any) {
    return { success: false }
  }
}

function buildPolicy(effect: string, methodArn: string) {
  return {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: methodArn
      }
    ]
  }
}

const getTokenOrThrow = (event: any) => {
  const auth = event.authorizationToken || ''
  const [scheme, token] = auth.split(' ', 2)
  if ((scheme || '').toLowerCase() !== 'bearer') {
    throw new Error("Authorization header value did not start with 'Bearer'.")
  }
  if (!token?.length) {
    throw new Error('Authorization header did not contain a Bearer token.')
  }
  return token
}
