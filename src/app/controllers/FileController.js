import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: nome, filename: path } = req.file;

    const file = await File.create({
      nome,
      path,
    });
    res.json(file);
  }
}

export default new FileController();
