import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      state: Yup.string().required().min(2),
      cep: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    const { street, number, complement, state } = req.body;

    const recipient = await Recipient.findOne({
      where: {
        street,
        number,
        complement,
        state,
      },
    });

    if (recipient) {
      return res.status(400).json({ error: 'Recipent already exists' });
    }

    const { id, name, cep } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      complement,
      state,
      cep,
    });
  }
}

export default new RecipientController();
