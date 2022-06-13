const request = require('supertest');
const app = require('../../../..');

describe('PUT /v1/cars/:id', () => {
  let car; let accessTokenAdmin; let
    accessTokenCustomer;

  const name = 'Pajero Update';
  const price = 100000;
  const size = 'LARGE';
  const image = 'https://source.unsplash.com/500x500';

  beforeEach(async () => {
    accessTokenAdmin = await request(app).post('/v1/auth/login').send({
      email: 'admin@binar.co.id',
      password: 'password',
    });
    accessTokenCustomer = await request(app).post('/v1/auth/login').send({
      email: 'johnny@binar.co.id',
      password: '123456',
    });

    car = await request(app)
      .post('/v1/cars')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${accessTokenAdmin.body.accessToken}`)
      .send({
        name,
        price,
        size,
        image,
      });

    return car, accessTokenAdmin, accessTokenCustomer;
  });

  it('should response with 200 as status code', async () => request(app)
    .put(`/v1/cars/ ${car.body.id}`)
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${accessTokenAdmin.body.accessToken}`)
    .send({ name, price, size, image })
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toEqual({});
    }));

  it('should response with 401 as status code', async () => request(app)
    .put(`/v1/cars/ ${car.body.id}`)
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${accessTokenCustomer.body.accessToken}`)
    .send({ name, price, size, image })
    .then((res) => {
      expect(res.status).toBe(401);
      if (res.body.details === null) {
        expect(res.body).toEqual({
          error: expect.objectContaining({
            name: expect.any(String),
            message: expect.any(String),
            details: null,
          }),
        });
        return;
      }
      expect(res.body).toEqual({
        error: expect.objectContaining({
          name: expect.any(String),
          message: expect.any(String),
          details: expect.objectContaining({
            role: expect.any(String),
            reason: expect.any(String),
          }),
        }),
      });
    }));
  afterEach(async () => request(app)
    .delete(`/v1/cars/ ${car.body.id}`)
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${accessTokenAdmin.body.accessToken}`));
});
