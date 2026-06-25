import axios from "axios";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
export type UserRole = "employee" | "admin";
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  leave_balance: number;
}
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";
export interface LeaveRequest {
  id: number;
  user_id: number;
  user_name?: string;
  reason: string;
  start_date: string;
  end_date: string;
  days: number;
  status: LeaveStatus;
  applied_on?: string;
  created_at?: string;
}
export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const { data } = await api.post<User>("/auth/login", { email, password });
    console.log("[loginUser] response:", data);
    return data;
  } catch (err: any) {
    console.error("[loginUser] error:", err.response?.data ?? err.message);
    throw err;
  }
}
export async function getMyLeaves(userId: number): Promise<LeaveRequest[]> {
  const { data } = await api.get<LeaveRequest[]>(`/leave/my/${userId}`);
  return data;
}
export async function applyLeave(payload: {
  user_id: number;
  reason: string;
  start_date: string;
  end_date: string;
  days: number;
}): Promise<LeaveRequest> {
  const { data } = await api.post<LeaveRequest>("/leave/apply", payload);
  return data;
}
export async function getAllLeaves(): Promise<LeaveRequest[]> {
  const { data } = await api.get<LeaveRequest[]>("/leave/all");
  return data;
}
export async function actionLeave(
  leaveId: number,
  action: "APPROVED" | "REJECTED",
): Promise<LeaveRequest> {
  const { data } = await api.patch<LeaveRequest>(`/leave/action/${leaveId}`, null, {
    params: { action },
  });
  return data;
}
export async function getAllUsers(): Promise<User[]> {
  const { data } = await api.get<User[]>("/users/all");
  return data;
}