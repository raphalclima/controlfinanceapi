import { Request, Response } from 'express'

import { UserModel, FinanceModel, TagModel, OriginModel } from '../../models/Index'

interface Err {
  field: string;
  error: string;
}

interface FinanceInterface {
  id: string;
  date: Date;
  type: number;
  value: number;
  tag: string;
  origin: string;
}

class FinanceController {
  public async index (req: Request, res: Response): Promise<Response> {
    try {
      if (!await UserModel.findById(req.params.id)) {
        return res.status(500).send({ field: 'user', error: 'Usuário não encontrado!' })
      }

      const finance = await FinanceModel.find({ user: req.params.id })
      const newListFinances = [] as FinanceInterface[]

      finance.map((item) => {
        newListFinances.push({
          id: item._id,
          date: item.date,
          type: item.type,
          value: item.value,
          tag: String(item.tag),
          origin: String(item.origin)
        })
      })

      return res.json(newListFinances)
    } catch (err) {
      return res.status(500).send({ message: 'Falha ao buscar finanças!', error: err })
    }
  }

  public async findById (req: Request, res: Response): Promise<Response> {
    const finance = await FinanceModel.findById(req.params.id,
      (err, result) => {
        if (err) { return res.status(400).send({ error: err }) } else { return result }
      })

    return res.json(finance)
  }

  public async register (req: Request, res: Response): Promise<Response> {
    const { user, tag, origin } = req.body

    const err: Err[] = []
    try {
      if (!await UserModel.findById(user)) {
        err.push({ field: 'title', error: 'Usuário não encontrado!' })
      }

      if (!await TagModel.findById(tag)) {
        err.push({ field: 'title', error: 'Tag não encontrada!' })
      }

      if (!await OriginModel.findById(origin)) {
        err.push({ field: 'title', error: 'Origin não encontrada!' })
      }

      if (err.length) { return res.status(500).send({ message: 'More than one error occurred', error: err }) }

      const response = await FinanceModel.create(req.body)
      const finance = {
        id: response._id,
        date: response.date,
        type: response.type,
        value: response.value,
        tag: String(response.tag),
        origin: String(response.origin)
      }

      return res.json(finance)
    } catch (err) {
      return res.status(500).send({ message: 'Registration failed', error: err })
    }
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const finance = await FinanceModel.findByIdAndUpdate(req.params.id, req.body, { new: true },
      (err, result) => {
        if (err) { return res.status(500).send({ error: err }) } else { return result }
      })

    return res.json(finance)
  }

  public async destroy (req: Request, res: Response): Promise<Response> {
    await FinanceModel.findByIdAndRemove(req.params.id,
      (err, result) => {
        if (err) { return res.status(500).send({ error: err }) } else { return result }
      })

    return res.send()
  }
}

export default new FinanceController()
