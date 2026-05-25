export const siteMetadata = {
  baseUrl: 'https://aslisite.com',
  name: 'Aslisite',
  legalName: 'Aslisite Technologies',
  description:
    'Aslisite is a web development and SEO agency in Kerala helping businesses grow with custom websites, ecommerce solutions, UI/UX design, and digital strategy.',
  logo: 'https://aslisite.com/AslisiteLogo.svg',
  email: 'info@aslisite.com',
  phone: '+919495664173',
  address: {
    streetAddress: 'Peruvallur',
    addressLocality: 'Malappuram',
    addressRegion: 'Kerala',
    postalCode: '676317',
    addressCountry: 'IN',
  },
  sameAs: [
    'https://www.instagram.com/aslisite_',
    'https://www.linkedin.com/company/aslisite',
    'https://www.facebook.com/aslisite',
  ],
};

export const absoluteUrl = (path = '/') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteMetadata.baseUrl}${normalizedPath === '/' ? '' : normalizedPath}`;
};

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'ProfessionalService'],
  '@id': `${siteMetadata.baseUrl}/#organization`,
  name: siteMetadata.legalName,
  alternateName: siteMetadata.name,
  url: siteMetadata.baseUrl,
  logo: siteMetadata.logo,
  image: siteMetadata.logo,
  description: siteMetadata.description,
  email: siteMetadata.email,
  telephone: siteMetadata.phone,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    ...siteMetadata.address,
  },
  areaServed: [
    { '@type': 'State', name: 'Kerala' },
    { '@type': 'Country', name: 'India' },
  ],
  sameAs: siteMetadata.sameAs,
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteMetadata.baseUrl}/#website`,
  url: siteMetadata.baseUrl,
  name: siteMetadata.name,
  publisher: {
    '@id': `${siteMetadata.baseUrl}/#organization`,
  },
};
