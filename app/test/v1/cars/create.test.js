const request = require('supertest');
const app = require('../../..');

const name = 'BMW Test';
const price = 100000;
const size = 'MEDIUM';
const image = 'https://source.unsplash.com/500x500';

describe('POST /v1/create', () => {
  let car;

  it('should response with 422 as status code', async () => {
    const accessToken = await request(app).post('/v1/auth/login').send({
      email: 'admin@binar.co.id',
      password: 'password',
    });

    return request(app)
      .post('/v1/cars')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${accessToken.body.accessToken}`)
      .send({ })
      .then((res) => {
        expect(res.status).toBe(422);
        expect(res.body).toEqual({
          error: {
            name: expect.any(String),
            message: expect.any(String),
          },
        });
        car = res.body;
      });
  });

  it('should response with 201 as status code', async () => {
    const accessToken = await request(app).post('/v1/auth/login').send({
      email: 'admin@binar.co.id',
      password: 'password',
    });

    return request(app)
      .post('/v1/cars')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${accessToken.body.accessToken}`)
      .send({ name, price, size, image })
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toEqual({
          id: expect.any(Number),
          name: expect.any(String),
          price: expect.any(Number),
          size: expect.any(String),
          image: expect.any(String),
          isCurrentlyRented: expect.any(Boolean),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
        car = res.body;
      });
  });

  it('should response with 401 as status code', async () => {
    const accessToken = await request(app).post('/v1/auth/login').send({
      email: 'johnny@binar.co.id',
      password: '123456',
    });

    return request(app)
      .post('/v1/cars')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${accessToken.body.accessToken}`)
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
      });
  });

  afterAll(async () => {
    const accessToken = await request(app).post('/v1/auth/login').send({
      email: 'admin@binar.co.id',
      password: 'password',
    });

    return request(app)
      .delete(`/v1/cars/ ${car.id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${accessToken.body.accessToken}`);
  });
});
