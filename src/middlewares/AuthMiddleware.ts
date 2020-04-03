import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config.json'

interface TokenInterface {
  id: string;
}

interface RequestInterface extends Request {
  userId: string;
}

export default function (
  req: RequestInterface,
  res: Response,
  next: NextFunction): Response | NextFunction | void {
  const authHeader = req.headers.authorization

  if (!authHeader) { return res.status(401).send({ error: 'No token provided' }) }

  const parts = authHeader.split(' ')

  if (!(parts.length === 2)) { return res.status(401).send({ error: 'Token error' }) }

  const [scheme, token] = parts

  if (!(/^Bearer$/i.test(scheme))) { return res.status(401).send({ error: 'Token malformatted' }) }

  jwt.verify(token, config.secret,
    (err, decoded) => {
      if (err) { return res.status(401).send({ error: 'Token invalid' }) }

      req.userId = (decoded as TokenInterface).id
      return next()
    })
}
