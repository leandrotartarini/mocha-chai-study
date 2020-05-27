const chai = require('chai');
const chaiHttp = require('chai-http');
const Users = require('../model/user');

chai.use(chaiHttp);

const app = require('../app');
const request = chai.request.agent(app);
const expect = chai.expect;

describe('Get', () => {

  before(async () => {
    await Users.deleteMany({})
  });

  context('Quando eu tenho usuários cadastrados', () => {

    before(async () => {
      let user = [
        { email: 'teste@hotmail.com', password: '123456' },
        { email: 'teste2@gmail.com', password: '123456' },
        { email: 'teste1@hotmail.com', password: '123456' }
      ]
    await Users.insertMany(user);
    });

    it('Deve listar meus usuários', async () => {
      const res = await request.get('/users')
      expect(res).to.has.status(200);
      expect(res.body).to.be.an('array');
    });

    it('Deve filtrar por palavra chave', async () => {
      const res = await request.get('/users').query({ email: 'hotmail' });
      expect(res).to.has.status(200);
      expect(res.body[0].email).to.equal('teste@hotmail.com');
      expect(res.body[1].email).to.equal('teste1@hotmail.com');
    })
  });

  context('Quando eu busco por ID', () => {

    it('Deve retornar um único usuário', async () => {
      let user = [{ email: 'testeid@teste.com', password: '123456' }]
      const result = await Users.insertMany(user)
      let id = result[0]._id
      const res = await request.get(`/users/${id}`)
      expect(res).to.has.status(200);
      expect(res.body.email).to.equal(user[0].email);
    });

    it('E o ID for inválido, deve retornar 404', async () => {
      let id = require('mongoose').Types.ObjectId();
      const res = await request.get(`/users/${id}`);
      expect(res).to.has.status(404);
      expect(res.body).to.eql({error: 'ID Inválido'});
    } )
  });
});