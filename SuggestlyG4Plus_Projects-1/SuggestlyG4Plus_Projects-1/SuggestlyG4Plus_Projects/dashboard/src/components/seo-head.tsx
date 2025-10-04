import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  structuredData?: object;
}

export function SEOHead({
  title = 'Quantum Vision AI - Enterprise Camera Analytics',
  description = 'Advanced AI-powered camera monitoring and analytics platform with real-time insights and predictive analytics',
  keywords = ['AI', 'Computer Vision', 'Analytics', 'Real-time', 'Camera Monitoring', 'Machine Learning'],
  image = '/og-image.png',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
  structuredData,
}: SEOHeadProps) {
  const router = useRouter();
  const canonicalUrl = url || `https://quantumvision.ai${router.asPath}`;

  // Generate structured data for the organization
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Quantum Vision AI',
    url: 'https://quantumvision.ai',
    logo: 'https://quantumvision.ai/logo.png',
    description: 'Enterprise-grade AI camera analytics platform',
    foundingDate: '2023',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-0123',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
    sameAs: [
      'https://twitter.com/quantumvisionai',
      'https://linkedin.com/company/quantumvisionai',
      'https://github.com/quantumvisionai',
    ],
    offers: {
      '@type': 'Offer',
      category: 'Software as a Service',
      description: 'AI-powered camera monitoring and analytics',
    },
  };

  const articleStructuredData = type === 'article' ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Quantum Vision AI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://quantumvision.ai/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    articleSection: section,
    keywords: tags?.join(', '),
  } : null;

  const productStructuredData = type === 'product' ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description,
    image,
    brand: {
      '@type': 'Brand',
      name: 'Quantum Vision AI',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  } : null;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image.startsWith('http') ? image : `https://quantumvision.ai${image}`} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Quantum Vision AI" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image.startsWith('http') ? image : `https://quantumvision.ai${image}`} />
      <meta name="twitter:creator" content="@quantumvisionai" />
      <meta name="twitter:site" content="@quantumvisionai" />

      {/* Article-specific meta tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      {type === 'article' && tags && tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Additional SEO meta tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="author" content="Quantum Vision AI Team" />
      <meta name="publisher" content="Quantum Vision AI" />

      {/* Mobile and responsive meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Quantum Vision AI" />
      <meta name="application-name" content="Quantum Vision AI" />
      <meta name="theme-color" content="#8B5CF6" />

      {/* Performance and security */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="format-detection" content="telephone=no" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData || defaultStructuredData),
        }}
      />

      {/* Article structured data */}
      {articleStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleStructuredData),
          }}
        />
      )}

      {/* Product structured data */}
      {productStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productStructuredData),
          }}
        />
      )}

      {/* Breadcrumbs structured data for navigation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://quantumvision.ai',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: title,
                item: canonicalUrl,
              },
            ],
          }),
        }}
      />

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />

      {/* Favicons and icons */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
    </Head>
  );
}

// Hook for dynamic SEO updates
export function useSEO(props: SEOHeadProps) {
  const router = useRouter();

  // Update document title dynamically
  React.useEffect(() => {
    if (props.title && typeof document !== 'undefined') {
      document.title = props.title;
    }
  }, [props.title]);

  // Update meta description dynamically
  React.useEffect(() => {
    if (props.description && typeof document !== 'undefined') {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', props.description);
      }
    }
  }, [props.description]);

  return null; // This hook doesn't render anything
}
