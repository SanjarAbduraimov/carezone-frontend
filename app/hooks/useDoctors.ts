import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorService, GetDoctorsParams, CreateDoctorData } from '../services/doctorService';
import { IDoctor } from '../lib/models';

export const DOCTOR_QUERY_KEYS = {
  all: ['doctors'] as const,
  lists: () => [...DOCTOR_QUERY_KEYS.all, 'list'] as const,
  list: (params: GetDoctorsParams) => [...DOCTOR_QUERY_KEYS.lists(), params] as const,
  details: () => [...DOCTOR_QUERY_KEYS.all, 'detail'] as const,
  detail: (slug: string) => [...DOCTOR_QUERY_KEYS.details(), slug] as const,
};

/**
 * Hook for fetching paginated list of doctors
 */
export function useDoctors(params: GetDoctorsParams = {}) {
  return useQuery({
    queryKey: DOCTOR_QUERY_KEYS.list(params),
    queryFn: () => doctorService.getDoctors(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching single doctor by slug
 */
export function useDoctor(slug: string, enabled: boolean = true) {
  return useQuery({
    queryKey: DOCTOR_QUERY_KEYS.detail(slug),
    queryFn: () => doctorService.getDoctor(slug),
    enabled: enabled && !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for creating a new doctor
 */
export function useCreateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDoctorData) => doctorService.createDoctor(data),
    onSuccess: () => {
      // Invalidate and refetch doctors list
      queryClient.invalidateQueries({ queryKey: DOCTOR_QUERY_KEYS.lists() });
    },
  });
}

/**
 * Hook for updating a doctor
 */
export function useUpdateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: Partial<CreateDoctorData> }) =>
      doctorService.updateDoctor(slug, data),
    onSuccess: (_data, variables) => {
      // Invalidate specific doctor and lists
      queryClient.invalidateQueries({ queryKey: DOCTOR_QUERY_KEYS.detail(variables.slug) });
      queryClient.invalidateQueries({ queryKey: DOCTOR_QUERY_KEYS.lists() });
    },
  });
}

/**
 * Hook for deleting a doctor
 */
export function useDeleteDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => doctorService.deleteDoctor(slug),
    onSuccess: (_data, slug) => {
      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: DOCTOR_QUERY_KEYS.detail(slug) });
      queryClient.invalidateQueries({ queryKey: DOCTOR_QUERY_KEYS.lists() });
    },
  });
}

/**
 * Optimistic update helper
 */
export function useOptimisticDoctorUpdate() {
  const queryClient = useQueryClient();

  return {
    setOptimisticDoctor: (slug: string, updater: (old: IDoctor) => IDoctor) => {
      queryClient.setQueryData(DOCTOR_QUERY_KEYS.detail(slug), updater);
    },
    rollbackDoctor: (slug: string) => {
      queryClient.invalidateQueries({ queryKey: DOCTOR_QUERY_KEYS.detail(slug) });
    },
  };
}
