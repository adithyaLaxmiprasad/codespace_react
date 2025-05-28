const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const app = require('../../server');
const User = require('../../models/userModel');

chai.use(chaiHttp);

describe('Authentication API', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await chai.request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'StrongPassword123!',
          role: 'user'
        });
      
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('message', 'User created successfully');
    });

    it('should reject weak passwords', async () => {
      const res = await chai.request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: '123',
          role: 'user'
        });
      
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.include('Password too weak');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await chai.request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'StrongPassword123!',
          role: 'user'
        });
    });

    it('should authenticate a valid user', async () => {
      const res = await chai.request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'StrongPassword123!'
        });
      
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('token');
    });

    it('should lock account after 3 failed attempts', async () => {
      // First two attempts
      for (let i = 0; i < 2; i++) {
        await chai.request(app)
          .post('/api/auth/login')
          .send({
            username: 'testuser',
            password: 'wrongpassword'
          });
      }

      // Third attempt should lock account
      const res = await chai.request(app)
        .post('/api/auth/login')
        .send