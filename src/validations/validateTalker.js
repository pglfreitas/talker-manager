const authorizationValidation = async (req, res, next) => {
const { authorization } = req.headers;

if (!authorization) {
return res.status(401).json(
{ message: 'Token não encontrado' },
);
}

if (authorization.length !== 16 || typeof authorization !== 'string') {
return res.status(401).json(
{ message: 'Token inválido' },
);
}
next();
};

const nameValidation = async (req, res, next) => {
const { name } = req.body;

if (!name) {
return res.status(400).json(
{ message: 'O campo "name" é obrigatório' },
);
}

if (name.length < 3) {
return res.status(400).json(
{ message: 'O "name" deve ter pelo menos 3 caracteres' },
);
}
next();
};

const ageValidation = async (req, res, next) => {
const { age } = req.body;
if (!age) {
return res.status(400).json(
{ message: 'O campo "age" é obrigatório' },
);
}

if (age < 18 || typeof age !== 'number' || !Number.isInteger(age)) {
return res.status(400).json(
{ message: 'O campo "age" deve ser um número inteiro igual ou maior que 18' },
);
}
next();
};

const talkValidation = async (req, res, next) => {
const { talk } = req.body;
if (!talk) {
return res.status(400).json(
{ message: 'O campo "talk" é obrigatório' },
);
}
next();
};

const watchedValidation = async (req, res, next) => {
const { watchedAt } = req.body.talk;

const regex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;

if (!watchedAt) {
return res.status(400).json(
{ message: 'O campo "watchedAt" é obrigatório' },
);
}

if (regex.test(watchedAt) === false) {
return res.status(400).json(
{ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' },
);
}

next();
};

const rateValidation = async (req, res, next) => {
const { rate } = req.body.talk;

if (rate === undefined) {
return res.status(400).json(
{ message: 'O campo "rate" é obrigatório' },
);
}

if (rate < 1 || rate > 5 || !Number.isInteger(rate)) {
return res.status(400).json(
{ message: 'O campo "rate" deve ser um número inteiro entre 1 e 5' },
);
}

next();
};

module.exports = {
authorizationValidation,
nameValidation,
ageValidation,
talkValidation,
watchedValidation,
rateValidation,
};