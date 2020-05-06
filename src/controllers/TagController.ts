import { Request, Response } from 'express'

import Tag from '../models/Tag'
import User from '../models/User'
import Origin from '../models/Origin'

interface OriginInterface {
  id: string;
  title: string;
}

interface TagInterface {
  id: string;
  title: string;
  subList: OriginInterface[];
}

class TagController {
  public async index (req: Request, res: Response): Promise<Response> {
    try {
      if (!await User.findById(req.params.id)) {
        return res.status(500).send({ field: 'user', error: 'Usuário não encontrado!' })
      }

      const tag = await Tag.find({ user: req.params.id })
      const origins = await Origin.find({ user: req.params.id })

      const newTag = [] as TagInterface[]

      tag.map((item) => {
        const newOrigins = [] as OriginInterface[]
        const origin = origins.filter(origin => String(origin.tag) === String(item._id))
        origin.map((itemOrigin) => {
          newOrigins.push({
            id: itemOrigin._id,
            title: itemOrigin.title
          })
        })

        newTag.push({
          id: item._id,
          title: item.title,
          subList: newOrigins
        } as TagInterface)
      })

      newTag.sort((a, b) => {
        const titleA = a.title.toUpperCase()
        const titleB = b.title.toUpperCase()

        return titleA > titleB ? 1 : -1
      })

      return res.json(newTag)
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
