require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');

describe('actors routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can POST an actor', () => {
    const dob = new Date();
    return request(app)
      .post('/api/v1/actors')
      .send({ name: 'Erin', dob, pob: 'Birmingham, AL' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String), 
          name: 'Erin', 
          dob: dob.toISOString(),
          pob: 'Birmingham, AL', 
          __v: 0
        });
      });
  });
});
