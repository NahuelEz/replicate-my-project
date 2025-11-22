import { Helmet } from 'react-helmet';
import React from 'react';
import JsonLdSchema from '@/components/JsonLdSchema';

export const generateTitle = (parts: string[] = []): string => {
    const baseTitle = 'PropiedadesArgentinas.com';
    if (parts.length === 0) {
        return baseTitle;
    }
    return `${parts.join(' en ')} - ${baseTitle}`;
};

export const generateDescription = (parts: string[] = [], defaultDesc?: string): string => {
    if (parts.length === 0) {
        return defaultDesc || "El portal inmobiliario líder de Argentina. Encontrá tu próximo hogar.";
    }
    return `Encontrá ${parts.join(' en ')}. Miles de propiedades te esperan en el portal inmobiliario líder de Argentina.`;
};

export const generateCanonicalUrl = (path: string): string => {
    const baseUrl = 'https://www.propiedadesargentinas.com';
    return `${baseUrl}${path}`;
};

interface SEOManagerProps {
  titleParts?: string[];
  descriptionParts?: string[];
  canonicalPath?: string;
  schema?: any;
}

export const SEOManager: React.FC<SEOManagerProps> = ({ 
  titleParts, 
  descriptionParts, 
  canonicalPath, 
  schema 
}) => {
  const title = generateTitle(titleParts);
  const description = generateDescription(descriptionParts);
  const canonical = generateCanonicalUrl(canonicalPath || window.location.pathname);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Helmet>
      {schema && <JsonLdSchema schema={schema} />}
    </>
  );
};
