const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { adminAccessToken } = require('../fixtures/token.fixture');
const imageService = require('../../src/services/openai.service');

setupTestDB();
jest.mock('../../src/services/openai.service');

describe('Cat routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /v1/cat', () => {
    test('should return 201 and successfully create generate a cat image', async () => {
      imageService.generateImage.mockResolvedValue({
        imageUrl: '/images/cat.jpg',
        expertDescription: 'Cat in Paris',
      });

      const res = await request(app)
        .post('/v1/cat')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(null)
        .expect(httpStatus.CREATED);

      expect(res.body).toHaveProperty('imageUrl');
      expect(res.body).toHaveProperty('expertDescription');
    });
  });
});
