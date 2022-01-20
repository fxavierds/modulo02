import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const recipientExists = await Recipient.findOne({
      where: { nome: req.body.nome },
    });

    if (recipientExists) {
      return res.status(400).json({ error: 'Destinatário já existe' });
    }
    const recipient = await Recipient.create(req.body);
    return res.json(recipient);
  }

  async update(req, res) {
    const userExists = await Recipient.findOne({
      where: { nome: req.body.nome },
    });

    if (userExists) {
      return res.status(400).json({ error: 'Destinatário já existe' });
    }

    const { id, nome, rua } = await Recipient.update(req.body);
    return res.json({ id, nome, rua });
  }
}

export default new RecipientController();
