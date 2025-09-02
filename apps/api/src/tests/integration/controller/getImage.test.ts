import request from 'supertest';
import { server } from '../../../koaServer';
import { db } from '../../../knex';

describe('CONTROLLERS', () => {
  afterAll(async () => {
    console.log('🛑 Closing database connection...');
    await db.destroy();
  });

  describe('getImage', () => {
    let imageId: string;

    beforeAll(async () => {
      await db('imageTag').del();
      await db('image').del();

      const response = await request(server).post('/images').send({
        url: 'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg',
        label: 'Earth',
        enableObjectDetection: false,
      });

      imageId = response.body.id;
    });

    describe('When calling with a valid image ID', () => {
      it('should return the image details', async () => {
        const response = await request(server).get(`/images/${imageId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', imageId);
        expect(response.body).toHaveProperty('url');
        expect(response.body).toHaveProperty('label', 'Earth');
      });
    });

    describe('When calling with a non-existent image ID', () => {
      it('should return 404', async () => {
        const response = await request(server).get('/images/a');
        expect(response.status).toBe(404);
        expect(response.body.error).not.toBeUndefined();
      });
    });
  });
});
