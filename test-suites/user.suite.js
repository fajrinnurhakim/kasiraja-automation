const request = require('supertest');
const { expect } = require('chai');

const config = require('../config/config.json');
const auth = require('../test-data/auth-data.json');
const user = require('../test-data/user-data.json');

let userId;
let token;

describe('User Feature', () => {
  describe('Get Token', () => {
    it('Success Get Token', async () => {
      const response = await request(config.baseUrl)
        .post('/authentications')
        .send(auth.loginSuccess);

      token = response.body.data.accessToken;
    });
  }),
    describe('Create User', () => {
      it('Success create a new user', async () => {
        const response = request(config.baseUrl)
          .post('/users')
          .send(user.createSuccess)
          .set('Authorization', `Bearer ${token}`);

        userId = (await response).body.data.userId;

        expect((await response).status).to.equal(201);
        expect((await response).body.status).to.equal('success');
        expect((await response).body.message).to.equal(
          'User berhasil ditambahkan'
        );
      }),
        it('Failed create a new user', async () => {
          const response = request(config.baseUrl)
            .post('/users')
            .send(user.createFailed)
            .set('Authorization', `Bearer ${token}`);

          expect((await response).status).to.equal(400);
          expect((await response).body.status).to.equal('fail');
        });
    }),
    describe('Get User List', () => {
      it('Success Get User List', async () => {
        const response = await request(config.baseUrl)
          .get(`/users/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
      });
    }),
    describe('Get User Detail', () => {
      it('Success Get User Detail', async () => {
        const response = await request(config.baseUrl)
          .get(`/users/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.data.user.name).to.equal('kasir-serbaguna');
      }),
        it('Failed Get User Detail', async () => {
          const response = await request(config.baseUrl)
            .get(`/users/${userId + '123'}`)
            .set('Authorization', `Bearer ${token}`);

          expect(response.status).to.equal(404);
          expect(response.body.message).to.equal('id tidak valid');
        });
    }),
    describe('Update User Detail', () => {
      it('Success Update User Detail', async () => {
        const response = await request(config.baseUrl)
          .put(`/users/${userId}`)
          .send(user.updateSuccess)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.data.name).to.equal('kaser');
      });
      it('Failed Update User Detail', async () => {
        const response = await request(config.baseUrl)
          .put(`/users/${userId}`)
          .send(user.updateFailed)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          '"name" is not allowed to be empty'
        );
      });
    }),
    describe('Delete User', () => {
      it('Success Delete User', async () => {
        const response = await request(config.baseUrl)
          .delete(`/users/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
      }),
        it('Failed Delete User', async () => {
          const response = await request(config.baseUrl)
            .delete(`/users/${userId + '123'}`)
            .set('Authorization', `Bearer ${token}`);

          expect(response.status).to.equal(404);
        });
    });
});
