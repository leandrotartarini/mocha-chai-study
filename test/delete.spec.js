const chai = require('chai');
const chaiHttp = require('chai-http');
const Users = require('../model/user');

chai.use(chaiHttp);

const app = require('../app');
const request = chai.request.agent(app);
const expect = chai.expect;

describe('Delete', () => {

  before(async () => {
    await Users.deleteMany({})
  });

  context('Quando eu deleto um usuário', () => {
    let user = {
      _id: require('mongoose').Types.ObjectId(),
      email: 'testedelete@teste.com',
      password: '123456'
    };

    before(async () => {
      await Users.insertMany([user]);
    });

    it('Deve retornar 200', async () => {
      const res = await request.delete(`/users/delete/${user._id}`);
      expect(res).to.has.status(200);
      expect(res.body).to.eql({});
    });
    after(async () => {
      const res = await request.get(`/users/${user._id}`);
      expect(res).to.has.status(404);
      expect(res.body.error).to.eql('ID Inválido');
    });
  });

  context('Quando o usuário não existe', () => {
    it('Deve retornar 404', async () => {
      let id = require('mongoose').Types.ObjectId();
      const res = await request.delete(`/users/delete/${id}`);
      expect(res).to.has.status(404);
      expect(res.body.error).to.eql('ID Inválido para deletar');
    });
  });
});