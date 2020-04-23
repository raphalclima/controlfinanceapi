import { Request, Response } from 'express'

import Tag from '../models/Tag'
import User from '../models/User'

class TagController {
  public async index (req: Request, res: Response): Promise<Response> {
    try {
      if (!await User.findById(req.params.id)) {
        return res.status(500).send({ field: 'user', error: 'Usuário não encontrado!' })
      }

      const tag = await Tag.find({ user: req.params.id })

      return res.json(tag)
    } catch (err) {
      return res.status(500).send({ message: 'Falha ao buscar tags', error: err })
    }
  }

  public async findById (req: Request, res: Response): Promise<Response> {
    const tag = await Tag.findById(req.params.id,
      (err, result) => {
        if (err) { return res.status(400).send({ error: err }) } else { return result }
      })

    return res.json(tag)
  }

  public async register (req: Request, res: Response): Promise<Response> {
    const { title, user } = req.body

    try {
      if (await Tag.findOne({ title: title })) {
        return res.status(500).send({ field: 'title', error: 'Tag já cadastrada!' })
      }

      if (!await User.findById(user)) {
        return res.status(500).send({ field: 'user', error: 'Usuário não encontrado!' })
      }

      const tag = await Tag.create(req.body)

      return res.json(tag)
    } catch (err) {
      return res.status(500).send({ message: 'Registration failed', error: err })
    }
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true },
      (err, result) => {
        if (err) { return res.status(500).send({ error: err }) } else { return result }
      })

    return res.json(tag)
  }

  public async destroy (req: Request, res: Response): Promise<Response> {
    await Tag.findByIdAndRemove(req.params.id,
      (err, result) => {
        if (err) { return res.status(500).send({ error: err }) } else { return result }
      })

    return res.send()
  }
}

export default new TagController()
