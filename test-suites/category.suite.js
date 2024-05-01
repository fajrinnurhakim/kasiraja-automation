const supertest = require('supertest');
const chai = require('chai');

const config = require('../config/config.json');
const auth = require('../test-data/auth-data.json');
const category = require('../test-data/category-data.json');

const request = supertest(config.baseUrl);
const expect = chai.expect;

let userId;
let token;

describe('Category Feature', () => {
  describe('Get Token', () => {
    it('Success Get Token', async () => {
      const response = await request
        .post('/authentications')
        .send(auth.loginSuccess);

      token = response.body.data.accessToken;
    });
  }),
    describe('Create Category', () => {
      it('Success create a new category', async () => {
        const response = request
          .post('/categories')
          .send(category.createSuccess)
          .set('Authorization', `Bearer ${token}`);

        userId = (await response).body.data.categoryId;

        expect((await response).status).to.equal(201);
        expect((await response).body.status).to.equal('success');
        expect((await response).body.message).to.equal(
          'Category berhasil ditambahkan'
        );
        expect((await response).body.data.name).to.equal('makanan ringan');
      }),
        it('Failed create a new category', async () => {
          const response = request
            .post('/categories')
            .send(category.createFailed)
            .set('Authorization', `Bearer ${token}`);

          expect((await response).status).to.equal(400);
          expect((await response).body.status).to.equal('fail');
        });
    }),
    describe('Get Category List', () => {
      it('Success Get Category List', async () => {
        const response = await request
          .get(`/categories/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
      });
    }),
    describe('Get Category Detail', () => {
      it('Success Get Category Detail', async () => {
        const response = await request
          .get(`/categories/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.data.category.name).to.equal('makanan ringan');
        expect(response.body.data.category.description).to.equal(
          'makanan ringan dari indofood'
        );
      }),
        it('Failed Get User Detail', async () => {
          const response = await request
            .get(`/categories/${userId + '123'}`)
            .set('Authorization', `Bearer ${token}`);

          expect(response.status).to.equal(404);
          expect(response.body.message).to.equal('id tidak valid');
        });
    }),
    describe('Update Category Detail', () => {
      it('Success Update Category Detail', async () => {
        const response = await request
          .put(`/categories/${userId}`)
          .send(category.updateSuccess)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
        expect(response.body.data.name).to.equal('makring');
      });
      it('Failed Update Category Detail', async () => {
        const response = await request
          .put(`/categories/${userId}`)
          .send(category.updateFailed)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          '"name" is not allowed to be empty'
        );
      });
    }),
    describe('Delete Category', () => {
      it('Success Delete Category', async () => {
        const response = await request
          .delete(`/categories/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal('success');
      }),
        it('Failed Delete Category', async () => {
          const response = await request
            .delete(`/categories/${userId + '123'}`)
            .set('Authorization', `Bearer ${token}`);

          expect(response.status).to.equal(404);
        });
    });
});
