import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      avatar_id: Yup.number().notRequired(),
      email: Yup.string().email().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const deliverymanExists = await Deliveryman.findOne({
      where: {
        email,
      },
    });

    if (deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman already exists' });
    }

    const { id, name } = await Deliveryman.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async index(req, res) {
    const deliverymans = await Deliveryman.findAll({
      attributes: ['id', 'name', 'avatar_id', 'email'],
      include: {
        model: File,
        as: 'avatar',
        attributes: ['url', 'name', 'path'],
      },
    });

    return res.json(deliverymans);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      name: Yup.string().required(),
      avatar_id: Yup.number().notRequired(),
      email: Yup.string().email().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /**
     * Check if Deliveryman exists
     */
    const deliveryman = await Deliveryman.findByPk(req.body.id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    /**
     * Check if Deliveryman email is valid
     */
    if (req.body.email !== deliveryman.email) {
      const deliverymanExists = await Deliveryman.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (deliverymanExists) {
        return res.status(400).json({ error: 'Deliveryman already exists' });
      }
    }

    /**
     * Check if Avatar exists
     */
    if (req.body.avatar_id !== undefined) {
      const avatarExists = await File.findByPk(req.body.avatar_id);

      if (!avatarExists) {
        return res.status(400).json({ error: 'Avatar does not exists' });
      }
    }

    const { id, name, avatar_id, email } = await deliveryman.update(req.body);

    return res.json({
      id,
      name,
      avatar_id,
      email,
    });
  }
}

export default new DeliverymanController();
