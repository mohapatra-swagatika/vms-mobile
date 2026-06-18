export type VisitorStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'checked_in'
  | 'checked_out';

export type Visitor = {
  id: string;
  entity_type: string;
  entity_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  purpose: string | null;
  host_name: string | null;
  host_email: string | null;
  organization: string | null;
  department: string | null;
  status: VisitorStatus;
  check_in_at: string | null;
  check_out_at: string | null;
  photo_url: string | null;
  entity_name?: string | null;
  created_at: string;
  updated_at: string;
};

export type VisitorListResponse = {
  visitors: Visitor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
};

export type CreateVisitorInput = {
  name: string;
  email?: string;
  phone?: string;
  purpose?: string;
  host_name?: string;
  host_email?: string;
  organization?: string;
  department?: string;
};
