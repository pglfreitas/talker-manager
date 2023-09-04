const express = require('express');

const fs = require('fs').promises;
const path = require('path');

const { emailValidation, passwordValidation } = require('./validations/validateLogin');
const {
authorizationValidation,
nameValidation,
ageValidation,
talkValidation,
watchedValidation,
rateValidation,
} = require('./validations/validateTalker');

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

const writeFile = async (data) => {
try {
const response = await fs.writeFile(talkerPath, JSON.stringify(data));
return response;
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

app.post('/login', emailValidation, passwordValidation, async (req, res) => {
const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const charLength = chars.length;
let result = '';
const length = 16;
for (let index = 0; index < length; index += 1) {
result += chars.charAt(Math.floor(Math.random() * charLength));
}
return res.status(200).json({ token: result });
});

app.post('/talker',
authorizationValidation,
nameValidation,
ageValidation,
talkValidation,
watchedValidation,
rateValidation,
async (req, res) => {
const { name, age, talk } = req.body;
const { watchedAt, rate } = talk;
const talker = await fs.readFile(talkerPath);
const talkerParse = JSON.parse(talker);
const id = talkerParse.length + 1;
const newTalker = { 
id,
name,
age,
talk: {
watchedAt,
rate,
} };
talkerParse.push(newTalker);
await writeFile(talkerParse);
res.status(201).send(newTalker);
});

app.put('/talker/:id',
authorizationValidation,
nameValidation,
ageValidation,
talkValidation,
watchedValidation,
rateValidation,
async (req, res) => {
const { id } = req.params;
const { name, age, talk } = req.body;
const { watchedAt, rate } = talk;
const talker = await fs.readFile(talkerPath);
const talkerParse = JSON.parse(talker);
const index = talkerParse.findIndex((person) => person.id === Number(id));
if (index === -1) {
return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
}
const talkerUpdate = { name, age, id: Number(id), talk: { watchedAt, rate },
};
talkerParse[index] = talkerUpdate;
await writeFile(talkerParse);
res.status(200).json(talkerUpdate);
});

app.delete('/talker/:id', authorizationValidation, async (req, res) => {
const { id } = req.params;
const talker = await fs.readFile(talkerPath);
const talkerParse = JSON.parse(talker);
const index = talkerParse.filter((person) => person.id !== Number(id));
if (index === -1) {
return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
}
await writeFile(index);
res.status(204).end();
});

app.listen(PORT, () => {
console.log('Online');
});
