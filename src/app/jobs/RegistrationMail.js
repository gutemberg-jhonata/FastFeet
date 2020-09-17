import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { deliveryman, recipient, product, date } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Nova entrega',
      text: 'Você tem uma nova entrega cadastrada',
      template: 'registration',
      context: {
        deliveryman: deliveryman.name,
        recipient: recipient.name,
        product,
        date: format(parseISO(date), "'dia' dd 'de' MMMM', às' HH:mm'h'", {
          locale: pt,
        }),
      },
    });
  }
}

export default new RegistrationMail();
