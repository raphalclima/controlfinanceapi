import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

import AuthSrevice from '../services/AuthService'
import MailerService from '../services/MailerService'

import User from '../models/User'

interface Err {
  field: string;
  error: string;
}

class UserController {
  public async findById (req: Request, res: Response): Promise<Response> {
    const user = await User.findById(req.params.id,
      (err, result) => {
        if (err) { return res.status(400).send({ error: err }) } else { return result }
      })

    return res.json(user)
  }

  public async register (req: Request, res: Response): Promise<Response> {
    try {
      const err: Err[] = []
      if (await User.findOne({ username: req.body.username })) {
        err.push({
          field: 'username',
          error: 'Usuário já cadastrado!'
        })
      }

      if (await User.findOne({ email: req.body.email })) {
        err.push({
          field: 'email',
          error: 'E-mail já cadastrado!'
        })
      }

      if (err.length) { return res.status(500).send({ message: 'More than one error occurred', error: err }) }

      const user = await User.create(req.body)
      user.password = ''

      return res.json({
        user,
        token: AuthSrevice.generateToken(user?.id)
      })
    } catch (err) {
      return res.status(500).send({ message: 'Registration failed', error: err })
    }
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true },
      (err, result) => {
        if (err) { return res.status(400).send({ error: err }) } else { return result }
      })

    return res.json(user)
  }

  public async destroy (req: Request, res: Response): Promise<Response> {
    await User.findByIdAndRemove(req.params.id,
      (err, result) => {
        if (err) { return res.send({ error: err }) } else { return result }
      })

    return res.send()
  }

  public async authenticate (req: Request, res: Response): Promise<Response> {
    const { username, password } = req.body
    let user

    try {
      user = await User.findOne({ username: username }).select('+password')

      if (!user) { return res.status(400).send(new Array({ field: 'username', error: 'Usuário não encontrado!' })) }

      if (!await bcrypt.compare(password, user.password)) { return res.status(400).send({ field: 'password', error: 'Senha inválida!' }) }

      user.password = ''
    } catch (err) {
      res.status(400).send({ error: 'Authentication failed' })
    }

    return res.json({
      user,
      token: AuthSrevice.generateToken(user?.id)
    })
  }

  public async forgotPassword (req: Request, res: Response): Promise<Response> {
    try {
      const user = await User.findOne({ email: req.body.email })

      if (!user) {
        return res.status(500).send({ field: 'email', error: 'E-mail não encontrado!' })
      }

      const token = crypto.randomBytes(20).toString('hex')
      const now = new Date()
      now.setHours(now.getHours() + 1)

      await User.findByIdAndUpdate(user.id, {
        $set: {
          passwordResetToken: token,
          passwordResetExpiress: now
        }
      })

      await MailerService.sendEmailForgot(user.nickname, user.email, token)
    } catch (err) {
      res.status(400).send({ error: 'Error on forgot password, try again' })
    }

    return res.status(200).send()
  }

  public async resetPasword (req: Request, res: Response): Promise<Response> {
    const { password, passwordResetToken } = req.body
    let user

    try {
      user = await User.findOne({ passwordResetToken: passwordResetToken })
        .select('+nickname email username passwordResetToken passwordResetExpiress')

      if (!user) {
        return res.status(500).send({ error: 'Token invalid' })
      }

      console.log('pior que passei')
      const now = new Date()

      if (now > user.passwordResetExpiress) {
        return res.status(500).send({ error: 'Token expired, generate a new one' })
      }

      user.password = password

      await user.save()

      user.password = ''
    } catch (err) {
      res.status(400).send({ error: 'Connot reset password, try again' })
    }

    return res.json({
      user,
      token: AuthSrevice.generateToken(user?.id)
    })
  }
}

export default new UserController()
