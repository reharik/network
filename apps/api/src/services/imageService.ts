import { db } from '../knex';
import {
  fetchAllImages,
  fetchImageById,
  filterAllImages,
  insertImage,
} from '../repositories/imageRepository';
import {
  fetchImageTagsForImage,
  insertImageTags,
} from '../repositories/imageTagRepository';
import { detectObjects } from './objectDetectionService';
import { Image } from '../types/types';

export const saveImage = async (
  url: string,
  label?: string,
  enableObjectDetection?: boolean,
): Promise<Image> => {
  if (!label) {
    label = `Image ${Date.now()}`;
  }
  if (!enableObjectDetection) {
    return await insertImage(url, label);
  }

  const trx = await db.transaction();
  try {
    const image = await insertImage(url, label, trx);
    const imaggaImageTags = await detectObjects(url);

    const imageTagsToInsert = imaggaImageTags.map((x) => ({
      imageId: image.id,
      name: x.tag.en,
      confidence: x.confidence,
    }));
    const imageTags = await insertImageTags(imageTagsToInsert, trx);
    image.imageTags = imageTags;

    await trx.commit();
    return image;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

export const getAllImages = async (filter?: string[]): Promise<Image[]> => {
  const images = filter
    ? await filterAllImages(filter)
    : await fetchAllImages();

  for (let i = 0; i < images.length; i++) {
    const element = images[i];
    const imageTags = await fetchImageTagsForImage(element.id);
    element.imageTags = imageTags;
  }

  return images;
};

export const getImageById = async (
  imageId: string,
): Promise<Image | undefined> => {
  const image = await fetchImageById(imageId);
  if (image) {
    const imageTags = await fetchImageTagsForImage(image.id);
    image.imageTags = imageTags;
  }
  return image;
};
