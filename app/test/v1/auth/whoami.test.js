const request = require('supertest');
const app = require('../../..');

describe('GET /v1/auth/whoami', () => {
  it('should response with 200 as status code', async () => {
    const accessToken = await request(app).post('/v1/auth/login').send({
      email: 'fikri@binar.co.id',
      password: '123456',
    });

    return request(app)
      .get('/v1/auth/whoami')
      .set('Authorization', `Bearer ${accessToken.body.accessToken}`)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          id: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
          image: null,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });
  });

  it('should response with 401 as status code', async () => request(app)
    .get('/v1/auth/whoami')
    .set('Authorization', `Bearer ${'invalidtoken'}`)
    .then((res) => {
      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({
        error: {
          name: expect.any(String),
          message: expect.any(String),
          details: null,
        },
      });
    }));
});
