require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');
const Film = require('../lib/models/Film');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let studio = null;
  beforeEach(async() => {
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'Disney' })));
  });


  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can POST a film', () => {
    return request(app)
      .post('/api/v1/films')
      .send({ title: 'Aladin', studio: studio.name, released: 1992, cast: { role: '', actor: 'Robin Williams' } })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String), 
          title: 'Aladin', 
          studio: studio.name, 
          released: 1992, 
          cast: { role: '', actor: 'Robin Williams' },
          __v: 0
        });
      });
  });
});
