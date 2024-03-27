const mongoose = require('mongoose');
const request = require('supertest');
const server = require('../app');

const exampleProfile = {
  name: 'test name',
  description: 'test description',
  mbti: 'test mbti',
  enneagram: 'test enneagram',
  variant: 'test variant',
  tritype: 1234,
  socionics: 'test socionics',
  sloan: 'test sloan',
  psyche: 'abc',
};

const exampleComment = {
  title: 'test comment',
  text: 'test description',
  voting: {
    mbti: 'ENTJ',
    enneagram: '6w5',
    zodiac: 'Leo',
  },
};

const testUsername = 'test_username';
let createdProfileId;
let createdCommentId;

afterAll((done) => {
  mongoose.connection.close();
  server.close();
  done();
});

describe('POST /', () => {
  it('should create new profile', async () => {
    const res = await request(server)
      .post('/')
      .send(exampleProfile)
      .expect(201);

    createdProfileId = res.body.id;
  });
});

describe('GET /:profileId', () => {
  it('should render profile page based on profileId', async () => {
    await request(server)
      .get(`/${createdProfileId}`)
      .send(exampleProfile)
      .expect(200);
  });
});

describe('POST /:profileId/comment', () => {
  it('should post new comment', async () => {
    const res = await request(server)
      .post(`/${createdProfileId}/comment`)
      .set('username', testUsername)
      .send(exampleComment)
      .expect(201);

    createdCommentId = res.body.id;
  });
});

describe('GET /:profileId/comment', () => {
  it('should return all comments from the profile', async () => {
    const res = await request(server)
      .get(`/${createdProfileId}/comment`)
      .expect(200);

    const { comments } = res.body;
    const [comment] = comments;

    expect(comment.id).toBe(createdCommentId);
  });
});

describe('PATCH /:profileId/toggle-like', () => {
  it('should return all comments from the profile', async () => {
    const res = await request(server)
      .patch(`/${createdProfileId}/comment/${createdCommentId}/toggle-like`)
      .set('username', testUsername)
      .expect(200);

    expect(res.body.message).toBe('Liked');
  });
});
