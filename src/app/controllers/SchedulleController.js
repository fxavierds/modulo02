import { startOfDay, parseISO, endOfDay } from 'date-fns';
import {Op} from 'sequelize';
import Appointment from '../models/Appointment';

import User from '../models/User';

class SchedulleController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!checkUserProvider) {
      return res.status(401).json('Usuário não é um provider');
    }
    const { data } = req.query;
    const parseData = parseISO(data);
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        data: {
          [Op.between]: [startOfDay(parseData), endOfDay(parseData)],
        },
      },
    });

    return res.json(appointments);
  }
}

export default new SchedulleController();
