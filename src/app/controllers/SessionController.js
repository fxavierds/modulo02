import jwt from 'jsonwebtoken';
import User from '../models/User';
import autoConfig from '../../config/auto';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    const { id, nome } = user;
    return res.json({
      user: {
        id,
        nome,
        email,
      },
      token: jwt.sign({ id }, autoConfig.secret, {
        expiresIn: autoConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
