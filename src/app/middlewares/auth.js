import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import autoConfig from '../../config/auth';

export default async (req, res, next) => {
  const autoHeader = req.headers.authorization;

  if (!autoHeader) {
    return res.status(401).json({ error: 'Token não informado' });
  }
  const token = autoHeader;

  try {
    const decoded = await promisify(jwt.verify)(token, autoConfig.secret);
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
