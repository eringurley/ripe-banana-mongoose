require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');
const Film = require('../lib/models/Film');
const Actor = require('../lib/models/Actor');
const Review = require('../lib/models/Review');
const Reviewer = require('../lib/models/Reviewer');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let studio = null;
  let film = null;
  let actor = null;
  let review = null; 
  let reviewer = null; 
  beforeEach(async() => {
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'Disney' })));
    actor = JSON.parse(JSON.stringify(await Actor.create({ name: 'Robin Williams' })));
    film = await Film.create({ title: 'Aladin', studio: studio._id, released: 1992, cast: [{ actor: actor._id }] });
    reviewer = JSON.parse(JSON.stringify(await Reviewer.create({ name: 'Eli', company: 'Alchemy' })));
    review = JSON.parse(JSON.stringify(await Review.create({ review: 'It was good', film: film._id, rating: 3, reviewer: reviewer._id })));
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

  it('can get a film by id', async() => {

    return request(app)
      .get(`/api/v1/films/${film._id}`)
      .then(res => {
        const filmJSON = JSON.parse(JSON.stringify(film));
        expect(res.body).toEqual({
          ...filmJSON, 
          title: 'Aladin', 
          studio: studio,
          cast: [{ _id: expect.any(String), actor: { _id: expect.any(String), name: 'Robin Williams', __v: 0 } }], 
          reviews: [review], 
          __v: 0
        });
      });
  });
});
