import jwt from 'jsonwebtoken'
import config from '../config.json'

class AuthService {
  public generateToken (userId: string): string {
    return jwt.sign({ id: userId }, config.secret, {
      expiresIn: 86400
    })
  }
}

export default new AuthService()
