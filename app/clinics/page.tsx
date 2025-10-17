import { ClinicsClient } from './ClinicsClient';

export default async function ClinicsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; city?: string }>;
}) {
  const params = await searchParams;
  const initialSearch = params.q || '';
  const initialCity = params.city || '';

  return <ClinicsClient initialSearch={initialSearch} initialCity={initialCity} />;
}
