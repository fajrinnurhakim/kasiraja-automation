const request = require('supertest');
const { expect } = require('chai');

const config = require('../config/config.json');
const auth = require('../test-data/auth-data.json');
const customer = require('../test-data/customer-data.json');

let userId;
let token;

describe('Customer Feature', () => {
  describe('Get Token', () => {
    it('Success Get Token', async () => {
      const response = await request(config.baseUrl)
        .post('/authentications')
        .send(auth.loginSuccess);

      token = response.body.data.accessToken;
    });
  }),
    describe('Create Customer', () => {
      it('Success create a new customer', async () => {
        const response = request(config.baseUrl)
          .post('/customers')
          .send(customer.createSuccess)
          .set('Authorization', `Bearer ${token}`);

        userId = (await response).body.data.customerId;

        expect((await response).status).to.equal(201);
        expect((await response).body.status).to.equal('success');
        expect((await response).body.message).to.equal(
          'Customer berhasil ditambahkan'
        );
      }),
        it('Failed create a new customer', async () => {
          const response = request(config.baseUrl)
            .post('/customers')
            .send(customer.createFailed)
            .set('Authorization', `Bearer ${token}`);

          expect((await response).status).to.equal(400);
          expect((await response).body.status).to.equal('fail');
        });
    }),
    describe('Get Customer List', () => {
      it('Success Get Customer List', async () => {
        const response = await request(config.baseUrl)
          .get(`/customers/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
      });
    }),
    describe('Get Customer Detail', () => {
      it('Success Get Customer Detail', async () => {
        const response = await request(config.baseUrl)
          .get(`/customers/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.data.customer.name).to.equal('Budi');
        expect(response.body.data.customer.phone).to.equal('081234567890');
        expect(response.body.data.customer.address).to.equal('Bandoeng');
        expect(response.body.data.customer.description).to.equal(
          'Budi anak Pak Edi'
        );
      }),
        it('Failed Get User Detail', async () => {
          const response = await request(config.baseUrl)
            .get(`/customers/${userId + '123'}`)
            .set('Authorization', `Bearer ${token}`);

          expect(response.status).to.equal(404);
          expect(response.body.message).to.equal('id tidak valid');
        });
    }),
    describe('Update Customer Detail', () => {
      it('Success Update Customer Detail', async () => {
        const response = await request(config.baseUrl)
          .put(`/customers/${userId}`)
          .send(customer.updateSuccess)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.data.name).to.equal('Budis');
      });
      it('Failed Update Customer Detail', async () => {
        const response = await request(config.baseUrl)
          .put(`/customers/${userId}`)
          .send(customer.updateFailed)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          '"name" is not allowed to be empty'
        );
      });
    }),
    describe('Delete Customer', () => {
      it('Success Delete Customer', async () => {
        const response = await request(config.baseUrl)
          .delete(`/customers/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
      }),
        it('Failed Delete Customer', async () => {
          const response = await request(config.baseUrl)
            .delete(`/customers/${userId + '123'}`)
            .set('Authorization', `Bearer ${token}`);

          expect(response.status).to.equal(404);
        });
    });
});
