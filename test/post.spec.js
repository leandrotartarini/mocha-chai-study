const chai = require('chai');
const chaiHttp = require('chai-http');
const Users = require('../model/user');

chai.use(chaiHttp);

const app = require('../app');
const request = chai.request.agent(app);
const expect = chai.expect;
const main_route = '/users/create';
const main_auth = '/users/auth';

describe('Post Create Users', () => {
  
  before(async () => {
    await Users.deleteMany({})
  });

  context('Quando eu cadastro um usuário', () => {
    let user = { email: 'testepost@test.com', password: '123456' }

    it('Deve retornar 201', async() => {
      const res = await request.post(main_route).send(user)
      expect(res).to.has.status(201);
      expect(res.body.user.email).to.be.an('string');
      expect(res.body.token).to.exist;
    });
  });

  context('Quando eu não envio um campo obrigatório', () => {

    it('Deve retornar 400 para email', async() => {
      let user = { email: '', password: '123456' }
      const res = await request.post(main_route).send(user)
      expect(res).to.has.status(400);
      expect(res.body.error).to.eql('Dados insuficientes!');
    });

    it('Deve retornar 400 para senha', async () => {
      let user = { email: 'testesenha@teste.com', password: '' }
      const res = await request.post(main_route).send(user)
      expect(res).to.has.status(400);
      expect(res.body.error).to.eql('Dados insuficientes!');
    });
  });

  context('Quando o usuário já existir', () => {
    let user = { email: 'testerepetir@teste.com', password: '123456'}

    before(async () => {
      const res = await request.post(main_route).send(user);
      expect(res).to.has.status(201);
    })
    it('Deve retornar 400 com mensagem de erro', async () => {
      const res = await request.post(main_route).send(user);
      expect(res).to.has.status(400);
      expect(res.body.error).to.eql('Usuário já registrado!');
    });
  });
});

describe('Post Auth', () => {
  before(async () => {
    await Users.deleteMany({})
  });

  context('Quando eu faço um post para o auth', () => {
    let user = { email: 'testereauth@teste.com', password: '123456'}

    before(async () => {
      const res = await request.post(main_route).send(user);
      expect(res).to.has.status(201);
    });

    it('Deve retornar 200', async () => {
      const res = await request.post(main_auth).send(user);
      expect(res).to.has.status(200);
    });

    it('Deve retornar dados insuficientes (400)', async () => {
      user.password = '';
      const res = await request.post(main_auth).send(user);
      expect(res).to.has.status(400);
      expect(res.body.error).to.eql('Dados insuficientes!');
    })

    it('Deve retornar 401 se a senha estiver errada', async () => {
      user.password = '12345';
      const res = await request.post(main_auth).send(user);
      expect(res).to.has.status(401);
      expect(res.body.error).to.eql('Erro ao autenticar usuário!');
    })

    it('Deve retornar 400 para usuario não registrado', async () => {
      let user2 = { email: 'testeNauth@teste.com', password: '123456'}
      const res = await request.post(main_auth).send(user2);
      expect(res).to.has.status(400);
      expect(res.body.error).to.eql('Usuário não registrado!');
    });
  });
});