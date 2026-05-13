import { apiRequest } from './apiClient';
import type { UserProfile, Feedback } from '../types';

interface UsersResponse {
  success: boolean;
  message: string;
  data: UserProfile[];
}

interface UserResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

interface FeedbacksResponse {
  success: boolean;
  message: string;
  data: Feedback[];
}

interface FeedbackResponse {
  success: boolean;
  message: string;
  data: Feedback;
}

export async function fetchAllUsers(): Promise<UserProfile[]> {
  const res = await apiRequest<UsersResponse>('/admin/users');
  return res.data;
}

export async function updateUserStatus(userId: string, status: 'Active' | 'Suspended'): Promise<UserProfile> {
  const res = await apiRequest<UserResponse>(`/admin/users/${userId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return res.data;
}

export async function deleteUser(userId: string): Promise<void> {
  await apiRequest(`/admin/users/${userId}`, { method: 'DELETE' });
}

export async function fetchFeedbacks(): Promise<Feedback[]> {
  const res = await apiRequest<FeedbacksResponse>('/admin/feedbacks');
  return res.data;
}

export async function updateFeedbackStatus(id: string, status: 'Read' | 'Resolved'): Promise<Feedback> {
  const res = await apiRequest<FeedbackResponse>(`/admin/feedbacks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return res.data;
}
