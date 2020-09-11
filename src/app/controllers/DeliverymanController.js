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

    /**
     * Check if Avatar exists
     */
    if (req.body.avatar_id !== undefined) {
      const avatarExists = await File.findByPk(req.body.avatar_id);

      if (!avatarExists) {
        return res.status(400).json({ error: 'Avatar does not exists' });
      }
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
      where: {
        deleted_at: null,
      },
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

    if (
      !(await schema.isValid({
        ...req.params,
        ...req.body,
      }))
    ) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { name, avatar_id, email } = req.body;

    /**
     * Check if Deliveryman exists
     */
    const deliveryman = await Deliveryman.findOne({
      where: {
        id: req.params.id,
        deleted_at: null,
      },
    });

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    /**
     * Check if Deliveryman email is valid
     */
    if (email !== deliveryman.email) {
      const deliverymanExists = await Deliveryman.findOne({
        where: {
          email,
        },
      });

      if (deliverymanExists) {
        return res.status(400).json({ error: 'Deliveryman already exists' });
      }
    }

    /**
     * Check if Avatar exists
     */
    if (avatar_id !== undefined) {
      const avatarExists = await File.findByPk(avatar_id);

      if (!avatarExists) {
        return res.status(400).json({ error: 'Avatar does not exists' });
      }
    }

    const { id } = await deliveryman.update({
      name,
      avatar_id,
      email,
    });

    return res.json({
      id,
      name,
      avatar_id,
      email,
    });
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /**
     * Check if Deliveryman Exists
     */
    const deliveryman = await Deliveryman.findOne({
      where: {
        id: req.params.id,
        deleted_at: null,
      },
    });

    if (!deliveryman) {
      return res.status(400).json({ error: 'Delivaryman does not exists' });
    }

    deliveryman.deleted_at = new Date();

    await deliveryman.save();

    return res.status(200).json({});
  }
}

export default new DeliverymanController();
