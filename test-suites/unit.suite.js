const request = require('supertest');
const { expect } = require('chai');

const config = require('../config/config.json');
const auth = require('../test-data/auth-data.json');
const unit = require('../test-data/unit-data.json');

let userId;
let token;

describe('Unit Feature', () => {
  describe('Get Token', () => {
    it('Success Get Token', async () => {
      const response = await request(config.baseUrl)
        .post('/authentications')
        .send(auth.loginSuccess);

      token = response.body.data.accessToken;
    });
  }),
    describe('Create Unit', () => {
      it('Success create a new unit', async () => {
        const response = request(config.baseUrl)
          .post('/units')
          .send(unit.createSuccess)
          .set('Authorization', `Bearer ${token}`);

        userId = (await response).body.data.unitId;

        expect((await response).status).to.equal(201);
        expect((await response).body.status).to.equal('success');
        expect((await response).body.message).to.equal(
          'Unit berhasil ditambahkan'
        );
      }),
        it('Failed create a new unit', async () => {
          const response = request(config.baseUrl)
            .post('/units')
            .send(unit.createFailed)
            .set('Authorization', `Bearer ${token}`);

          expect((await response).status).to.equal(400);
          expect((await response).body.status).to.equal('fail');
        });
    }),
    describe('Get Unit List', () => {
      it('Success Get Unit List', async () => {
        const response = await request(config.baseUrl)
          .get(`/units/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
      });
    }),
    describe('Get Unit Detail', () => {
      it('Success Get Unit Detail', async () => {
        const response = await request(config.baseUrl)
          .get(`/units/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.data.unit.name).to.equal('gram');
        expect(response.body.data.unit.description).to.equal(
          'weight measurement'
        );
      }),
        it('Failed Get User Detail', async () => {
          const response = await request(config.baseUrl)
            .get(`/units/${userId + '123'}`)
            .set('Authorization', `Bearer ${token}`);

          expect(response.status).to.equal(404);
          expect(response.body.message).to.equal('id tidak valid');
        });
    }),
    describe('Update Unit Detail', () => {
      it('Success Update Unit Detail', async () => {
        const response = await request(config.baseUrl)
          .put(`/units/${userId}`)
          .send(unit.updateSuccess)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.data.name).to.equal('kg');
      });
      it('Failed Update Unit Detail', async () => {
        const response = await request(config.baseUrl)
          .put(`/units/${userId}`)
          .send(unit.updateFailed)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          'name is required, description is optional'
        );
      });
    }),
    describe('Delete Unit', () => {
      it('Success Delete Unit', async () => {
        const response = await request(config.baseUrl)
          .delete(`/units/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
      }),
        it('Failed Delete Unit', async () => {
          const response = await request(config.baseUrl)
            .delete(`/units/${userId + '123'}`)
            .set('Authorization', `Bearer ${token}`);

          expect(response.status).to.equal(404);
        });
    });
});
