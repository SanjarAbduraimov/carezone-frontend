'use client';
import { NextSeo, LocalBusinessJsonLd } from 'next-seo';

type ClinicSeoProps = {
  name: string;
  description?: string | null;
  url?: string | null;
  logo?: string | null;
  telephone?: string | null;
  address?: string | null;
};

export function ClinicSEO({ name, description, url, logo, telephone, address }: ClinicSeoProps) {
  const fullUrl = url ?? `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}`;
  return (
    <>
      <NextSeo title={name} description={description || undefined} canonical={fullUrl} />
      <LocalBusinessJsonLd
        type="MedicalOrganization"
        id={fullUrl}
        name={name}
        description={description || ''}
        url={fullUrl}
        telephone={telephone || ''}
        logo={logo || ''}
        address={address || ''}
      />
    </>
  );
}

type DoctorSeoProps = {
  name: string;
  description?: string | null;
  url?: string | null;
  image?: string | null;
};

export function DoctorSEO({ name, description, url, image }: DoctorSeoProps) {
  const fullUrl = url ?? `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}`;
  return (
    <>
      <NextSeo title={name} description={description ?? undefined} canonical={fullUrl} />
      {/* JSON-LD Physician */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Physician',
        name,
        description,
        image,
        url: fullUrl,
      }) }} />
    </>
  );
}
