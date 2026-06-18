export type ScopedEntityType = 'tower' | 'company' | 'organization' | 'location';

export type EntityConfig = {
  whatsapp: boolean;
  email: boolean;
  call: boolean;
  push: boolean;
  notify_gate: boolean;
  notify_front_desk: boolean;
  notify_admin: boolean;
  gate_user_ids: string[];
  front_desk_user_ids: string[];
  request_timeout_minutes: number;
};

export type NotificationRecipient = {
  id: string;
  name: string;
  email: string;
  level: number;
  role_name: string;
  role_display: string;
};

export type NotificationRecipients = {
  gate: NotificationRecipient[];
  front_desk: NotificationRecipient[];
  admin: NotificationRecipient[];
  level_bands: Record<string, {min: number; max: number}>;
};

export type UserConfig = {
  entity_type: ScopedEntityType | null;
  entity_id: string | null;
  entity_name: string | null;
  source: 'self' | 'parent' | null;
  config: EntityConfig;
  recipients: NotificationRecipients;
};
