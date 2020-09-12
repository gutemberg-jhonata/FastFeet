import * as Yup from 'yup';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';
import File from '../models/File';

class DeliveryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required().min(1),
      deliveryman_id: Yup.number().required().min(1),
      product: Yup.string().required().min(2),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { recipient_id, deliveryman_id, product } = req.body;

    /**
     * Check if recipient exists
     */
    const recipientExists = await Recipient.findByPk(recipient_id);

    if (!recipientExists) {
      return res.status(400).json({ error: 'Recipient does not exists' });
    }

    /**
     * Check if deliveryman exists
     */
    const deliverymanExists = await Deliveryman.findByPk(deliveryman_id);

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'Deliveryman does not exists' });
    }

    const { id } = await Delivery.create({
      recipient_id,
      deliveryman_id,
      product,
    });

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      product,
    });
  }

  async index(req, res) {
    const deliveries = await Delivery.findAll({
      where: {
        canceled_at: null,
      },
      attributes: ['id', 'product', 'start_date', 'end_date'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'complement',
            'state',
            'cep',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'name', 'path', 'url'],
            },
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });

    return res.json(deliveries);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required().min(1),
      recipient_id: Yup.number().notRequired().min(1),
      deliveryman_id: Yup.number().notRequired().min(1),
      signature_id: Yup.number().notRequired().min(1),
      product: Yup.string().required(),
    });

    if (
      !(await schema.isValid({
        ...req.params,
        ...req.body,
      }))
    ) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { recipient_id, deliveryman_id, product } = req.body;

    /**
     * Check if recipient exists
     */
    if (recipient_id !== undefined) {
      const recipientExists = await Recipient.findByPk(recipient_id);

      if (!recipientExists) {
        return res.status(400).json({ error: 'Recipient does not exists' });
      }
    }

    /**
     * Check if deliveryman exists
     */
    if (deliveryman_id !== undefined) {
      const deliverymanExists = await Deliveryman.findByPk(deliveryman_id);

      if (!deliverymanExists) {
        return res.status(400).json({ error: 'Deliveryman does not exists' });
      }
    }

    const { id } = req.params;

    /**
     * Check if delivery exists
     */
    const delivery = await Delivery.findOne({
      where: {
        id,
        canceled_at: null,
      },
    });

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exists' });
    }

    delivery.product = product;
    delivery.recipient_id = recipient_id || delivery.recipient_id;
    delivery.deliveryman_id = deliveryman_id || delivery.deliveryman_id;

    delivery.save();

    return res.json({
      id,
      recipient_id: delivery.recipient_id,
      deliveryman_id: delivery.deliveryman_id,
      product,
    });
  }
}

export default new DeliveryController();
