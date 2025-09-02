import request from 'supertest';
import { server } from '../../../koaServer';
import { db } from '../../../knex';

describe('CONTROLLERS', () => {
  afterAll(async () => {
    console.log('🛑 Closing database connection...');
    await db.destroy();
  });

  describe('getImages', () => {
    beforeAll(async () => {
      await db('imageTag').del();
      await db('image').del();

      await request(server).post('/images').send({
        url: 'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg',
        label: 'Earth',
        enableObjectDetection: true,
      });

      await request(server).post('/images').send({
        url: 'https://content.dogagingproject.org/wp-content/uploads/2020/11/helena-lopes-S3TPJCOIRoo-unsplash-scaled.jpg',
        label: 'Nice Dog',
        enableObjectDetection: true,
      });
    });

    describe('When calling without query params', () => {
      it('should return all images', async () => {
        const response = await request(server).get('/images');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(response.body[0]).toHaveProperty('url');
        expect(response.body[0]).toHaveProperty('label');
      });
    });

    describe('When calling with object filters', () => {
      it('should return only images with the specified objects', async () => {
        const response = await request(server).get('/images?objects=planet');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].label).toBe('Earth');
      });

      it('should return image with all metadata', async () => {
        const response = await request(server).get('/images?objects=planet');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].label).toBe('Earth');
        expect(response.body[0].url).not.toBeUndefined();
        expect(response.body[0].imageTags.length).toBeGreaterThan(1);
        expect(response.body[0].imageTags[0].confidence).toBeGreaterThan(0.001);
        expect(response.body[0].imageTags[0].name).not.toBeUndefined();
      });

      it('should return an empty array if no images match the filter', async () => {
        const response = await request(server).get(
          '/images?objects=NonExistentTag',
        );
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
      });
    });
    describe('When calling with object filter containing more than one term', () => {
      it('should return only images with the specified objects', async () => {
        const response = await request(server).get(
          '/images?objects=planet,fur',
        );
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(response.body[0].label).toBe('Earth');
        expect(response.body[1].label).toBe('Nice Dog');
      });
    });
  });
});
