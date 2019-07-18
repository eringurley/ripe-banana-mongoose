require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../lib/models/Reviewer');

describe('reviewers routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });
  it('can POST a reviewer', () => {
    return request(app)
      .post('/api/v1/reviewers')
      .send({ name: 'Eli', company: 'Alchemy' })
      .then(res => () => {
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
        reviewersJSON.forEach(reviewer => {
          expect(res.body).toContainEqual(reviewer);
        });
      });
  });
});

