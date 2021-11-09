import { startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

class AvaliableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Data invalida' });
    }

    const searchDate = Number(date);
    console.log('a data: ', searchDate, 'começo: ', startOfDay(searchDate));
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        data: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)]
        },
      },
    });

    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
    ];
    return res.json(appointments);
  }
}

export default new AvaliableController();
