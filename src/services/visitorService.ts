import {photoFileName, photoMimeType} from './photoService';
import {CheckInFormData} from '../features/checkin/constants';
import {apiPaths} from '../constants/apiPaths';
import {
  CreateVisitorInput,
  Visitor,
  VisitorListResponse,
} from '../types/visitor';
import {apiFormRequest, apiRequest} from './apiClient';

export async function listVisitors(
  params: {page?: number; search?: string} = {},
): Promise<VisitorListResponse> {
  const query = new URLSearchParams();
  if (params.page) {
    query.set('page', String(params.page));
  }
  if (params.search?.trim()) {
    query.set('search', params.search.trim());
  }

  const suffix = query.toString() ? `?${query.toString()}` : '';
  return apiRequest<VisitorListResponse>(`${apiPaths.visitors.root}${suffix}`, {
    method: 'GET',
  });
}

export async function createVisitor(input: CreateVisitorInput): Promise<Visitor> {
  const result = await apiRequest<{visitor: Visitor}>(apiPaths.visitors.root, {
    method: 'POST',
    data: input,
  });
  return result.visitor;
}

export async function createVisitorFromCheckIn(
  form: CheckInFormData,
): Promise<Visitor> {
  const payload = {
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    purpose: form.purpose.trim(),
    host_name: form.hostName.trim(),
    host_email: form.hostEmail.trim(),
    organization: form.organization.trim(),
    department: form.department.trim(),
  };

  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value) {
      formData.append(key, value);
    }
  });

  if (form.photoUri) {
    formData.append('picture', {
      uri: form.photoUri,
      type: photoMimeType(),
      name: photoFileName(form.photoUri),
    } as unknown as Blob);
  }

  const result = await apiFormRequest<{visitor: Visitor}>(
    apiPaths.visitors.root,
    formData,
  );
  return result.visitor;
}

export async function checkInVisitor(visitorId: string): Promise<Visitor> {
  const result = await apiRequest<{visitor: Visitor}>(
    apiPaths.visitors.checkIn(visitorId),
    {method: 'POST', data: {}},
  );
  return result.visitor;
}

export async function checkOutVisitor(visitorId: string): Promise<Visitor> {
  const result = await apiRequest<{visitor: Visitor}>(
    apiPaths.visitors.checkOut(visitorId),
    {method: 'POST', data: {}},
  );
  return result.visitor;
}
