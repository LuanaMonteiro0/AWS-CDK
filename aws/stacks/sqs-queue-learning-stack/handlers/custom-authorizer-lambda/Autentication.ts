import axios from 'axios'

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN

export type AuthenticationInfo = {
  id: string
  email: string
  isEmailVerified: boolean
}

export default class Authentication {
  static async getUserInfo(token: string): Promise<AuthenticationInfo> {
    const url = `https://${AUTH0_DOMAIN}/userinfo`
    try {
      const response = await axios.get(url, {
        headers: {
          authorization: 'Bearer ' + token
        }
      })

      return {
        id: this.normalizeUserId(response.data.sub),
        email: response.data.email,
        isEmailVerified: response.data.email_verified
      }
    } catch (error: any) {
      throw new Error(`${error.response.status}: ${error.response.statusText}`)
    }
  }

  private static normalizeUserId(auth0Id: string): string {
    return auth0Id.substring('auth0|'.length)
  }
}
