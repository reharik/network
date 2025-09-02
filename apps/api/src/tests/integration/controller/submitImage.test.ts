import request from 'supertest';
import { server } from '../../../koaServer';
import { db } from '../../../knex';

describe('CONTROLLERS', () => {
  afterAll(async () => {
    console.log('🛑 Closing database connection...');
    await db.destroy();
  });

  beforeEach(async () => {
    await db('imageTag').del();
    await db('image').del();
  });
  describe('submitImage', () => {
    describe('When calling function with no parameters', () => {
      it('should return 400 with error message', async () => {
        const response = await request(server).post('/images').send({});
        expect(response.status).toBe(400);
        expect(response.body.error).not.toBeUndefined();
      });
    });

    describe('When calling function with a valid image URL but no label', () => {
      it('should return 200 and image metadata with a custom label', async () => {
        const response = await request(server)
          .post('/images')
          .send({ url: 'https://example.com/image.jpg' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty(
          'url',
          'https://example.com/image.jpg',
        );
        expect(response.body.label).toContain('Image');
        expect(response.body).not.toHaveProperty('imageTags');
      });
    });

    describe('When calling function with a valid image URL', () => {
      it('should return 200 and image metadata', async () => {
        const response = await request(server)
          .post('/images')
          .send({ url: 'https://example.com/image.jpg', label: 'Sunset' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty(
          'url',
          'https://example.com/image.jpg',
        );
        expect(response.body).toHaveProperty('label', 'Sunset');
        expect(response.body).not.toHaveProperty('imageTags');
      });
    });

    describe('When calling function with object detection enabled', () => {
      it('should return 200 and detected objects', async () => {
        const response = await request(server).post('/images').send({
          url: 'https://imagga.com/static/images/tagging/wind-farm-538576_640.jpg',
          enableObjectDetection: true,
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('imageTags');
        expect(Array.isArray(response.body.imageTags)).toBe(true);
        expect(response.body.imageTags.length).toBeGreaterThan(1);
      });
    });
  });
});
