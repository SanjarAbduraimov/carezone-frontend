import { apiClient, PaginatedResponse } from './apiClient';
import { IClinic } from '../lib/models';

export interface GetClinicsParams {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
}

export interface CreateClinicData {
  name: string;
  slug: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  country?: string;
  logoUrl?: string;
  lat?: number;
  lng?: number;
}

export const clinicService = {
  async getClinics(params: GetClinicsParams = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    return apiClient.get<PaginatedResponse<IClinic>>(
      `/clinics?${queryParams.toString()}`
    );
  },

  async getClinic(slug: string) {
    return apiClient.get<IClinic>(`/clinics/${slug}`);
  },

  async createClinic(data: CreateClinicData) {
    return apiClient.post<IClinic>('/clinics', data);
  },

  async updateClinic(slug: string, data: Partial<CreateClinicData>) {
    return apiClient.put<IClinic>(`/clinics/${slug}`, data);
  },

  async deleteClinic(slug: string) {
    return apiClient.delete(`/clinics/${slug}`);
  },
};
