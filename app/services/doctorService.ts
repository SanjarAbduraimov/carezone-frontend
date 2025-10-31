import { apiClient, PaginatedResponse } from './apiClient';
import { IDoctor } from '../lib/models';

export interface GetDoctorsParams {
  page?: number;
  limit?: number;
  search?: string;
  clinicId?: string;
  specialtyId?: string;
  isActive?: boolean;
}

export interface CreateDoctorData {
  firstName: string;
  lastName: string;
  slug: string;
  bio?: string;
  yearsOfExp?: number;
  photoUrl?: string;
  clinicId?: string;
  specialtyIds?: string[];
  priceMin?: number;
  priceMax?: number;
  metaTitle?: string;
  metaDescription?: string;
}

export const doctorService = {
  async getDoctors(params: GetDoctorsParams = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    return apiClient.get<PaginatedResponse<IDoctor>>(
      `/doctors?${queryParams.toString()}`
    );
  },

  async getDoctor(slug: string) {
    return apiClient.get<IDoctor>(`/doctors/${slug}`);
  },

  async createDoctor(data: CreateDoctorData) {
    return apiClient.post<IDoctor>('/doctors', data);
  },

  async updateDoctor(slug: string, data: Partial<CreateDoctorData>) {
    return apiClient.put<IDoctor>(`/doctors/${slug}`, data);
  },

  async deleteDoctor(slug: string) {
    return apiClient.delete(`/doctors/${slug}`);
  },
};
