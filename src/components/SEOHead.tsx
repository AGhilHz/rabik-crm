import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  schema?: object;
}

export const SEOHead = ({
  title = "رابیک - ارتباط بی‌نهایت با مشتری",
  description = "طراحی هوشمند وب، رشد پایدار کسب‌وکار شما. خدمات طراحی سایت، سئو، CRM و بازاریابی دیجیتال",
  keywords = "طراحی سایت, سئو, CRM, بازاریابی دیجیتال, توسعه وب",
  ogImage = "/og-image.png",
  canonical,
  schema,
}: SEOHeadProps) => {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);
    updateMetaTag("og:title", title, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:image", ogImage, true);
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", ogImage);

    // Update canonical link
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }

    // Add JSON-LD schema
    if (schema) {
      const scriptId = "json-ld-schema";
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    }
  }, [title, description, keywords, ogImage, canonical, schema]);

  return null;
};

// Default schema for the website
export const defaultSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "رابیک",
  description: "طراحی هوشمند وب، رشد پایدار کسب‌وکار شما",
  url: "https://rabik.ir",
  logo: "https://rabik.ir/logo.svg",
  image: "https://rabik.ir/og-image.png",
  telephone: "+98-XXX-XXX-XXXX",
  email: "info@rabik.ir",
  address: {
    "@type": "PostalAddress",
    addressLocality: "گرگان",
    addressRegion: "گلستان",
    addressCountry: "IR",
  },
  sameAs: [
    "https://t.me/rabik_ir",
    "https://instagram.com/rabik.ir",
  ],
  priceRange: "$$",
  areaServed: {
    "@type": "Country",
    name: "ایران",
  },
};
