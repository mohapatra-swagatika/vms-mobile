import {apiPaths} from '../constants/apiPaths';
import {apiRequest} from './apiClient';
import {UserImage} from '../types/user';

type DbUserImage = {
  id?: string;
  _id?: string;
  imageUrl?: string;
  url?: string;
  image_url?: string;
  title?: string;
  name?: string;
  created_at?: string;
};

type UserImagesResponse = {
  images?: DbUserImage[];
};

function mapDbImage(raw: DbUserImage): UserImage | null {
  const id = raw.id ?? raw._id;
  const uri = raw.imageUrl ?? raw.url ?? raw.image_url;

  if (!id || !uri) {
    return null;
  }

  return {
    id: String(id),
    uri,
    label: raw.title ?? raw.name,
  };
}

/**
 * Fetches entity gallery images for the logged-in user's scoped entity
 * (same images shown on the admin dashboard carousel).
 * Endpoint: GET /users/me/images (Bearer token required)
 */
export async function getUserImages(): Promise<UserImage[]> {
  const data = await apiRequest<UserImagesResponse>(apiPaths.users.meImages, {
    method: 'GET',
  });

  const rows = data.images ?? [];
  return rows.map(mapDbImage).filter((image): image is UserImage => image !== null);
}
