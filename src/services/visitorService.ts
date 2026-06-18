import {photoFileName, photoMimeType} from './photoService';
import {CheckInFormData} from '../features/checkin/constants';
import {
  CreateVisitorInput,
  Visitor,
  VisitorListResponse,
} from '../types/visitor';
import {apiFormRequest, apiRequest} from './apiClient';

export async function listVisitors(
  accessToken: string,
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
  return apiRequest<VisitorListResponse>(`/visitors${suffix}`, {
    accessToken,
  });
}

export async function createVisitor(
  accessToken: string,
  input: CreateVisitorInput,
): Promise<Visitor> {
  const result = await apiRequest<{visitor: Visitor}>('/visitors', {
    method: 'POST',
    accessToken,
    body: JSON.stringify(input),
  });
  return result.visitor;
}

export async function createVisitorFromCheckIn(
  accessToken: string,
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
    '/visitors',
    formData,
    accessToken,
  );
  return result.visitor;
}

export async function checkInVisitor(
  accessToken: string,
  visitorId: string,
): Promise<Visitor> {
  const result = await apiRequest<{visitor: Visitor}>(
    `/visitors/${visitorId}/checkin`,
    {
      method: 'POST',
      accessToken,
      body: JSON.stringify({}),
    },
  );
  return result.visitor;
}

export async function checkOutVisitor(
  accessToken: string,
  visitorId: string,
): Promise<Visitor> {
  const result = await apiRequest<{visitor: Visitor}>(
    `/visitors/${visitorId}/checkout`,
    {
      method: 'POST',
      accessToken,
      body: JSON.stringify({}),
    },
  );
  return result.visitor;
}
