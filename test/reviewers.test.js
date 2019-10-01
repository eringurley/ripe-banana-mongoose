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

describe('reviewers routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let studio = null;
  let film = null;
  let actor = null;
  let reviewer = null; 
  beforeEach(async() => {
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'Disney' })));
    actor = JSON.parse(JSON.stringify(await Actor.create({ name: 'Robin Williams' })));
    film = JSON.parse(JSON.stringify(await Film.create({ title: 'Aladin', studio: studio._id, released: 1992, cast: [{ actor: actor._id }] })));
    reviewer = JSON.parse(JSON.stringify(await Reviewer.create({ name: 'Eli', company: 'Alchemy' })));
    await Review.create({ review: 'It was good', film: film._id, rating: 3, reviewer: reviewer._id });
  });


  afterAll(() => {
    return mongoose.connection.close();
  });
  it('can POST a reviewer', () => {
    return request(app)
      .post('/api/v1/reviewers')
      .send({ name: 'Eli', company: 'Alchemy' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String), 
          name: 'Eli', company: 'Alchemy', 
          __v: 0
        });
      });
  }); 

  it('can get a list of reviewers', async() => {
    const reviewers = await Reviewer.create([
      { name: 'Eli', company: 'Alchemy' },
      { name: 'Erin', company: 'Alchemy' },
      { name: 'Emily', company: 'Alchemy' },
    ]);
    
    return request(app)
      .get('/api/v1/reviewers')
      .then(res => {
        const reviewersJSON = JSON.parse(JSON.stringify(reviewers));
        reviewersJSON.forEach(() => {
          expect(res.body).toContainEqual(
            { _id: expect.any(String), name: 'Eli', company: 'Alchemy' }
          );
        });
      });
  });

  it('can get reviewers by id', async() => {
    return request(app)
      .get(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        const reviewerJSON = JSON.parse(JSON.stringify(reviewer));
        expect(res.body).toEqual({
          ...reviewerJSON, 
          _id: expect.any(String),
          name: 'Eli', 
          company: 'Alchemy',
          reviews: [{ _id: expect.any(String),
            rating: 3, 
            review: 'It was good',
            film: {
              _id: expect.any(String), 
              title: 'Aladin'
            },
          }],
          __v: 0
        });
      });
  });

  it('can update a reviewer with PUT by id', async() => {
      
    return request(app)
      .put(`/api/v1/reviewers/${reviewer._id}`)
      .send({ name: 'Ryan', company: 'Alchemy' })
      .then(res => {
        const reviewerJSON = JSON.parse(JSON.stringify(reviewer));
        expect(res.body).toEqual({ 
          ...reviewerJSON, 
          name: 'Ryan'
        });
      });
  });
});

