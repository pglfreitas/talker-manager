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
	try {
	  const talker = await readFile();
	  res.status(200).json(talker);
	} catch (err) {
	  res.status(200).send([]);
	}
  });


app.listen(PORT, () => {
  console.log('Online');
});
