require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');

describe('actors routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let film = null;
  let actor = null;
  let studio = null;
  beforeEach(async() => {
    actor = await Actor.create({
      name: 'Erin', 
      dob: '08-27-1992', 
      pob: 'Alabama'
    });
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'Universal', address: { city: 'Hollywood', state: 'California', country: 'US' } })));
    film = JSON.parse(JSON.stringify(await Film.create({ title: 'Aladin', studio: studio._id, released: 1992, cast: [{ actor: actor._id }] })));
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
  
  it('can get a list of actors', async() => {
    const actors = await Actor.create([
      { name: 'Erin', dob: '08-27-1992', pob: 'Alabama' },
      { name: 'Eli', dob: '07-25-1993', pob: 'Washington' },
      { name: 'Zai', dob: '07-07-1987', pob: 'California' },
    ]);
    
    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        const actorsJSON = JSON.parse(JSON.stringify(actors));
        actorsJSON.forEach(actor => {
          expect(res.body).toContainEqual(actor);
        });
      });
  });
  
  it('can get an actor by id', async() => {
      
    return request(app)
      .get(`/api/v1/actors/${actor._id}`)
      .then(res => {
        const actorJSON = JSON.parse(JSON.stringify(actor));
        expect(res.body).toEqual({
          ...actorJSON, 
          name: 'Erin', 
          films: [film]
        });
      });
  });
    
  it('can update an actor with PUT by id', async() => {
    const actor = await Actor.create({
      name: 'Erin', 
      dob: '08-27-1992',
      pob: 'Alabama'
    });
      
    return request(app)
      .put(`/api/v1/actors/${actor._id}`)
      .send({ name: 'Erin2', dob: '08-27-1992', pob: 'Alabama' })
      .then(res => {
        const actorJSON = JSON.parse(JSON.stringify(actor));
        expect(res.body).toEqual({ 
          ...actorJSON, 
          name: 'Erin2'
        });
      });
  });
});
