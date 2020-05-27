const express = require('express');
const router = express.Router();
const Users = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const createUserToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt_pass, { expiresIn: config.jwt_expires_in });
};


router.get('/', async (req, res) => {
  try {
    let query = {}

    if (req.query.email) {
      query.email = new RegExp(req.query.email, 'i');
    };

    const users = await Users.find(query, {}, {sort: '-date'});
    return res.send(users);
  } catch (err) {
    return res.status(500).send({ error: 'Erro na consulta de usuários!' });
  };
});

router.get('/:id', async (req, res) => {
  try {
    let id = req.params.id;
    const result = await Users.findById({ _id: id });
    if (!result) {
      return err
    }
    return res.send(result);
  } catch (err) {
    return res.status(404).send({ error: 'ID Inválido' });
  };
});


router.post('/create', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).send({ error: 'Dados insuficientes!'});

  try {
    if (await Users.findOne({ email })) return res.status(400).send({ error: 'Usuário já registrado!' });

    const user = await Users.create(req.body);
    user.password = undefined;
    return res.status(201).send({user, token: createUserToken(user.id)});

  } catch (err) {
    return res.status(500).send({ error: 'Erro ao buscar usuário!' });
  };
});

router.put('/update/:id', async (req, res) => {
  try {
    let id = req.params.id;
    const result = await Users.findByIdAndUpdate(id, {$set: req.body}, {new: true});
    if (!result) {
      return err
    }
    return res.send(result);
  } catch (err) {
    return res.status(404).send({ error: 'ID Inválido' });
  };
});

router.delete('/delete/:id', async (req, res) => {
  try {
    let id = req.params.id;
    const result = await Users.findByIdAndDelete({ _id: id });
    if (!result) {
      return err
    }
    return res.send(null);
  } catch (err) {
    return res.status(404).send({ error: 'ID Inválido para deletar' });
  };
});


router.post('/auth', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).send({ error: 'Dados insuficientes!' });

  try {
    const user = await Users.findOne({ email }).select('+password');
    if (!user) return res.status(400).send({ error: 'Usuário não registrado!' });

    const pass_ok = await bcrypt.compare(password, user.password);

    if (!pass_ok) return res.status(401).send({ error: 'Erro ao autenticar usuário!' });

    user.password = undefined;
    return res.send({ user, token: createUserToken(user.id) });
  } catch (err) {
    return res.status(500).send({ error: 'Erro ao buscar usuário!' });
  };
});

module.exports = router;