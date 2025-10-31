import { DoctorsClient } from './DoctorsClient';

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const initialSearch = params.q || '';

  return <DoctorsClient initialSearch={initialSearch} />;
}
