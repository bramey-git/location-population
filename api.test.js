'use strict'
const request = require('supertest')

const baseUrl = 'http://localhost:5555'

describe('GET /population', () => {

  it('should return 200', async () => {
    const response = await request(baseUrl).get('/');
    expect(response.statusCode).toBe(200);
  });

  it('should find population', async () => {
    const response = await request(baseUrl)
      .get('/api/population/state/Alabama/city/Birmingham');
    expect(response.body.population).toBe('197575');
  });

});

describe('Update population', () => {

  it('should update population if location exists', async () => {
    const response = await request(baseUrl)
      .put(`/api/population/state/Alabama/city/Birmingham`).send({population: '197576'});
    expect(response.statusCode).toBe(200);
    expect(response.body.population).toBe('197576');
  });

  it('should create location if new location', async () => {
    const response = await request(baseUrl)
      .put(`/api/population/state/Testing/city/Testingham`).send({population: '124578'});
    expect(response.statusCode).toBe(201);
    expect(response.body.population).toBe('124578');
  });

  it('should reset population', async () => {
    const response = await request(baseUrl)
      .put(`/api/population/state/Alabama/city/Birmingham`).send({population: '197575'});
    expect(response.statusCode).toBe(200);
    expect(response.body.population).toBe('197575');
  })
});
