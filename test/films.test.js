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
      .send({ title: 'Aladin', studio: studio._id, released: 1992, cast: [{ role: '', actor: actor._id }] })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String), 
          title: 'Aladin', 
          studio: studio._id, 
          released: 1992, 
          cast: [{ role: '', actor: actor._id, _id: expect.any(String) }],
          __v: 0
        });
      });
  });

  it('can get a list of films', async() => {
    const films = await Film.create([ 
      { title: 'Aladin', studio: studio._id, released: 1992, cast: [{ role: '', actor: actor._id }] },
      { title: 'Toy Story', studio: studio._id, released: 1992, cast: [{ role: '', actor: actor._id }] }
    ]);

    return request(app)
      .get('/api/v1/films')
      .then(res => {
        const filmsJSON = JSON.parse(JSON.stringify(films));
        filmsJSON.forEach(film => {
          expect(res.body).toContainEqual(film);
        });
      });
  });
});
