import { ImaggaImageTag } from '../types/types';

const IMAGGA_API_KEY = process.env.IMAGGA_API_KEY || '';
const IMAGGA_API_SECRET = process.env.IMAGGA_API_SECRET || '';
const IMAGGA_ENDPOINT =
  process.env.IMAGGA_ENDPOINT || 'https://api.imagga.com/v2/tags';

export async function detectObjects(
  imageUrl: string,
): Promise<ImaggaImageTag[]> {
  try {
    const response = await fetch(
      `${IMAGGA_ENDPOINT}?image_url=${encodeURIComponent(imageUrl)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${Buffer.from(`${IMAGGA_API_KEY}:${IMAGGA_API_SECRET}`).toString('base64')}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }

    // TODO should have zod type validation on third party response
    // before converting to typescript
    const jsonResponse = (await response.json()) as {
      result: { tags: ImaggaImageTag[] };
    };
    return jsonResponse.result?.tags;
  } catch (error) {
    console.error('Error detecting objects:', error);
    return [];
  }
}
