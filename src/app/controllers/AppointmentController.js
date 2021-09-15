import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['data'],
      attributes: ['id', 'data'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'nome'],
          include: [
            { model: File, as: 'avatar', attributes: ['id', 'url', 'path'] },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      data: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou' });
    }

    const { provider_id, data } = req.body;
    const isProvider = await User.find({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'Você só pode marcar agendamento como provider' });
    }
    const hourStart = startOfHour(parseISO(data));

    if (isBefore(hourStart, new Date())) {
      return res
        .status(401)
        .json({ error: 'Datas passadas não são permitidas', data: new Date() });
    }

    const checkAvailibity = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        data: hourStart,
      },
    });

    if (checkAvailibity) {
      return res.status(401).json({ error: 'Data não disponivel' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      data,
    });

    const user = await User.findByPk(req.userId);
    const formattedData = format(hourStart, "'dia' dd 'de' MMM', às' H:mm'h'", {
      locale: pt,
    });

    await Notification.create({
      content: `Novo Agendamento de ${user.nome} para ${formattedData}`,
      user: provider_id,
    });
    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id);
    if (appointment.user_id !== req.userId) {
      return res.status(400).json({
        error: 'Você não tem permissão para cancelar esse agendamento',
      });
    }

    const dateWithSubs = subHours(appointment.date, 2);
    if (isBefore(dateWithSubs, new Date())) {
      return res.status(400).json({
        error:
          'Você só pode cancelar agendamento com duas horas de antecedência',
      });
    }

    appointment.canceled_at = new Date();

    appointment.save();

    return res.json(appointment);
  }
}

export default new AppointmentController();
