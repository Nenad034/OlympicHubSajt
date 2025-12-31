/**
 * Product JSON-LD Component
 * Provides Schema.org structured data for SEO optimization
 */

import Script from 'next/script';

export default function ProductJsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": "OlympicHub Travel Packages",
    "description": "Discover and book complete travel packages including flights, hotels, and transfers",
    "provider": {
      "@type": "TravelAgency",
      "name": "OlympicHub",
      "url": "https://olympichub.com",
      "logo": "https://olympichub.com/logo.png",
      "sameAs": [
        "https://facebook.com/olympichub",
        "https://instagram.com/olympichub"
      ]
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "EUR",
      "lowPrice": "299",
      "highPrice": "2999",
      "offerCount": "100+"
    },
    "touristType": [
      "Family",
      "Couples",
      "Solo Travelers",
      "Business"
    ],
    "itinerary": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Flight Booking"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Hotel Accommodation"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Airport Transfer"
        }
      ]
    }
  };

  return (
    <Script
      id="product-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
