require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');
const Film = require('../lib/models/Film');
const Actor = require('../lib/models/Actor');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let studio = null;
  let actor = null;
  beforeEach(async() => {
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'Disney' })));
    actor = JSON.parse(JSON.stringify(await Actor.create({ name: 'Robin Williams' })));
  });


  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can POST a film', () => {
    return request(app)
      .post('/api/v1/films')
      .send({ title: 'Aladin', studio: studio.name, released: 1992, cast: { role: '', actor: actor.name } })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String), 
          title: 'Aladin', 
          studio: studio.name, 
          released: 1992, 
          cast: { role: '', actor: actor.name },
          __v: 0
        });
      });
  });
});
