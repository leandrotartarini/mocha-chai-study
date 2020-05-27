const chai = require('chai');
const chaiHttp = require('chai-http');
const Users = require('../model/user');

chai.use(chaiHttp);

const app = require('../app');
const request = chai.request.agent(app);
const expect = chai.expect;

describe('Put', () => {

  before(async () => {
    await Users.deleteMany({})
  });

  context('Quando eu altero um usuário', () => {
    let user = {
      _id: require('mongoose').Types.ObjectId(),
      email: 'testeput@teste.com',
      password: '123456'
    };

    before(async () => {
      await Users.insertMany([user]);
    });

    it('Deve retornar 200', async () => {
      user.email = 'testeputalterar@teste.com';
      const res = await request.put(`/users/update/${user._id}`).send(user);
      expect(res).to.has.status(200);
      expect(res.body.email).to.eql(user.email);
    });

    it('E deve retornar os dados atualizados', async () => {
      const res = await request.get(`/users/${user._id}`);
      expect(res).to.has.status(200);
      expect(res.body.email).to.eql(user.email);
    });

    it('E o ID é inválido', async () => {
      user._id = 'invalido';
      const res = await request.put(`/users/update/${user._id}`).send(user);
      expect(res).to.has.status(404);
      expect(res.body.error).to.eql('ID Inválido');
    });
  });
    after(async () => {
    await Users.deleteMany({})
  });
});