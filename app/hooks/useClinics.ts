import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clinicService, GetClinicsParams, CreateClinicData } from '../services/clinicService';

export const CLINIC_QUERY_KEYS = {
  all: ['clinics'] as const,
  lists: () => [...CLINIC_QUERY_KEYS.all, 'list'] as const,
  list: (params: GetClinicsParams) => [...CLINIC_QUERY_KEYS.lists(), params] as const,
  details: () => [...CLINIC_QUERY_KEYS.all, 'detail'] as const,
  detail: (slug: string) => [...CLINIC_QUERY_KEYS.details(), slug] as const,
};

/**
 * Hook for fetching paginated list of clinics
 */
export function useClinics(params: GetClinicsParams = {}) {
  return useQuery({
    queryKey: CLINIC_QUERY_KEYS.list(params),
    queryFn: () => clinicService.getClinics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching single clinic by slug
 */
export function useClinic(slug: string, enabled: boolean = true) {
  return useQuery({
    queryKey: CLINIC_QUERY_KEYS.detail(slug),
    queryFn: () => clinicService.getClinic(slug),
    enabled: enabled && !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for creating a new clinic
 */
export function useCreateClinic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClinicData) => clinicService.createClinic(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLINIC_QUERY_KEYS.lists() });
    },
  });
}

/**
 * Hook for updating a clinic
 */
export function useUpdateClinic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: Partial<CreateClinicData> }) =>
      clinicService.updateClinic(slug, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: CLINIC_QUERY_KEYS.detail(variables.slug) });
      queryClient.invalidateQueries({ queryKey: CLINIC_QUERY_KEYS.lists() });
    },
  });
}

/**
 * Hook for deleting a clinic
 */
export function useDeleteClinic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => clinicService.deleteClinic(slug),
    onSuccess: (_data, slug) => {
      queryClient.removeQueries({ queryKey: CLINIC_QUERY_KEYS.detail(slug) });
      queryClient.invalidateQueries({ queryKey: CLINIC_QUERY_KEYS.lists() });
    },
  });
}
