require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Film = require('../lib/models/Film');
const Reviewer = require('../lib/models/Reviewer');
const Studio = require('../lib/models/Studio');
const Review = require('../lib/models/Review');


describe('reviews routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let studio = null;
  let film = null;
  let reviewer = null;
  beforeEach(async() => {
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'Universal', address: { city: 'Hollywood', state: 'California', country: 'US' } })));
    film = JSON.parse(JSON.stringify(await Film.create({ title: 'Aladin', studio: studio._id, released: 1992, cast: [] })));
    reviewer = JSON.parse(JSON.stringify(await Reviewer.create({ name: 'Eli', company: 'Alchemy' })));
  });


  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can POST a review', () => {
    return request(app)
      .post('/api/v1/reviews')
      .send({ reviewer: reviewer._id, rating: 3, review: 'Aladin was good', film: film._id })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String), 
          reviewer: reviewer._id, 
          rating: 3, 
          review: 'Aladin was good', 
          film: film._id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          __v: 0
        });
      });
  }); 

  it('can get a list of reviews', async() => {
    const reviews = await Review.create([
      { reviewer: reviewer._id, rating: 3, review: 'Aladin was good', film: film._id },
      { reviewer: reviewer._id, rating: 5, review: 'Aladin was great', film: film._id },
    ]);
    
    return request(app)
      .get('/api/v1/reviews')
      .then(res => {
        const reviewsJSON = JSON.parse(JSON.stringify(reviews));
        reviewsJSON.forEach(review => {
          expect(res.body).toContainEqual(review);
        });
      });
  });
});
