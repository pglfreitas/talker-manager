const express = require('express');

const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

const talkerPath = path.resolve(__dirname, './talker.json');

const readFile = async () => {
  try {
    const data = await fs.readFile(talkerPath);
    return JSON.parse(data);
  } catch (erro) {
    console.error(erro);
  }
};

app.get('/talker', async (req, res) => {
    const talker = await readFile();
      res.status(200).json(talker);
    if (!talker) {
      res.status(200).send([]);
    }
  });

app.get('/talker/:id', async (req, res) => {
    const talker = await readFile();
    const talkerId = talker.find(({ id }) => id === Number(req.params.id));
    if (!talkerId) {
        return res.status(404).send({ message: 'Pessoa palestrante não encontrada' });
        }
        return res.status(200).json(talkerId);
    });

app.post('/login', async (req, res) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charLength = chars.length;
    let result = '';
    const length = 16;
    for (let index = 0; index < length; index += 1) {
       result += chars.charAt(Math.floor(Math.random() * charLength));
    }
     return res.status(200).json({ token: result });
});

app.listen(PORT, () => {
  console.log('Online');
});
