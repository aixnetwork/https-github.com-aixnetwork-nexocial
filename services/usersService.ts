import { apiRequest } from './apiClient';
import type { UserProfile, EngagementSettings, LLMSettings, Feedback } from '../types';

interface UserResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

interface FeedbackResponse {
  success: boolean;
  message: string;
  data: Feedback;
}

export type UpdateProfileInput = {
  name?: string;
  companyName?: string;
  avatar?: string;
  onboardingCompleted?: boolean;
  twoFactorEnabled?: boolean;
  notifEmailDigest?: boolean;
  notifAnnouncements?: boolean;
  notifSecurityAlerts?: boolean;
  brandDescription?: string;
  brandTone?: number;
  preferredPlatforms?: string[];
  primaryGoal?: string;
  engagementSettings?: EngagementSettings;
  llmSettings?: LLMSettings;
};

export async function fetchMe(): Promise<UserProfile> {
  const res = await apiRequest<UserResponse>('/users/me');
  return res.data;
}

export async function updateProfile(data: UpdateProfileInput): Promise<UserProfile> {
  const res = await apiRequest<UserResponse>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await apiRequest('/users/me/password', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function deleteAccount(): Promise<void> {
  await apiRequest('/users/me', { method: 'DELETE' });
}

export async function updateAffiliateCode(code: string): Promise<UserProfile> {
  const res = await apiRequest<UserResponse>('/users/me/affiliate', {
    method: 'PATCH',
    body: JSON.stringify({ code }),
  });
  return res.data;
}

export async function requestPayout(): Promise<UserProfile> {
  const res = await apiRequest<UserResponse>('/users/me/affiliate/payout', {
    method: 'POST',
  });
  return res.data;
}

export interface DiagnosticResult {
  provider: string;
  model: string;
  latency: number;
  status: string;
}

export async function runLlmDiagnostic(): Promise<DiagnosticResult> {
  const res = await apiRequest<{ success: boolean; message: string; data: DiagnosticResult }>('/users/me/llm-diagnostic', {
    method: 'POST',
  });
  return res.data;
}

export async function send2faSetupCode(): Promise<void> {
  await apiRequest('/users/me/2fa/send-code', { method: 'POST' });
}

export async function enable2fa(code: string): Promise<UserProfile> {
  const res = await apiRequest<UserResponse>('/users/me/2fa/enable', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
  return res.data;
}

export async function disable2fa(password: string): Promise<UserProfile> {
  const res = await apiRequest<UserResponse>('/users/me/2fa/disable', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
  return res.data;
}

export async function submitFeedback(type: 'Improvement' | 'Bug' | 'Technical Issue', message: string): Promise<Feedback> {
  const res = await apiRequest<FeedbackResponse>('/feedback', {
    method: 'POST',
    body: JSON.stringify({ type, message }),
  });
  return res.data;
}
