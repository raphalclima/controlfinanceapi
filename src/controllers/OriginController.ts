import { Request, Response } from 'express'

import Origin from '../models/Origin'
import Tag from '../models/Tag'
import User from '../models/User'

class OriginController {
  public async index (req: Request, res: Response): Promise<Response> {
    try {
      if (!await User.findById(req.params.id)) {
        return res.status(500).send({ field: 'user', error: 'Usuário não encontrado!' })
      }

      const origin = await Origin.find({ user: req.params.id })

      return res.json(origin)
    } catch (err) {
      return res.status(500).send({ message: 'Falha ao buscar origens', error: err })
    }
  }

  public async findById (req: Request, res: Response): Promise<Response> {
    const origin = await Origin.findById(req.params.id,
      (err, result) => {
        if (err) { return res.status(400).send({ error: err }) } else { return result }
      })

    return res.json(origin)
  }

  public async register (req: Request, res: Response): Promise<Response> {
    const { title, user, tag } = req.body

    try {
      if (await Origin.findOne({ title: title })) {
        return res.status(500).send({ field: 'title', error: 'Origem já cadastrada!' })
      }

      if (!await Tag.findById(tag)) {
        return res.status(500).send({ field: 'tag', error: 'Tag não encontrada!' })
      }

      if (!await User.findById(user)) {
        return res.status(500).send({ field: 'user', error: 'Usuário não encontrado!' })
      }

      const origin = await Origin.create(req.body)

      return res.json(origin)
    } catch (err) {
      return res.status(500).send({ message: 'Registration failed', error: err })
    }
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const origin = await Origin.findByIdAndUpdate(req.params.id, req.body, { new: true },
      (err, result) => {
        if (err) { return res.status(500).send({ error: err }) } else { return result }
      })

    return res.json(origin)
  }

  public async destroy (req: Request, res: Response): Promise<Response> {
    await Origin.findByIdAndRemove(req.params.id,
      (err, result) => {
        if (err) { return res.status(500).send({ error: err }) } else { return result }
      })

    return res.send()
  }
}

export default new OriginController()
