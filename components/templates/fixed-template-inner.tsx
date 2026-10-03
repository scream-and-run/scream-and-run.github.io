import { FixedAdPortals } from "@/components/integrations/fixed-ad-portals";
import { JsonLd } from "@/components/site/json-ld";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { SeoPageDefinition } from "@/config/types";
import { getRelatedPages, visibleCorePages } from "@/content/registry";
import { esc, renderFixedDocument } from "@/lib/fixed-template/render";
import { placeFixedInnerAds } from "@/lib/fixed-template/ad-placement";
import { renderSectionsHtml } from "@/lib/fixed-template/sections";
import { pageSchemas } from "@/lib/schema";
import { routePath } from "@/lib/urls";

function categoryLabel(page: SeoPageDefinition) {
  if (page.pageType === "legal") return "Site";
  if (page.pageType === "updates") return "Update";
  if (page.pageType === "list") return "Maps";
  return "Guide";
}

function articleInner(page: SeoPageDefinition): string {
  const sections = renderSectionsHtml(page.sections);
  const faq = page.faq?.length
    ? `<section class="guide-copy" id="faq"><h2>FAQ</h2>${page.faq.map((item) => `<h3>${esc(item.question)}</h3><p>${esc(item.answer)}</p>`).join("")}</section>`
    : "";
  const related = getRelatedPages(page);
  const relatedHtml = related.length
    ? `<section class="guide-copy" id="related"><h2>Related</h2><ul class="guide-links">${related.map((item) => `<li><a href="${esc(routePath(item.slug))}">${esc(item.navLabel)}</a></li>`).join("")}</ul></section>`
    : "";
  return `${sections}${faq}${relatedHtml}`;
}

export function FixedTemplateInner({ page }: { page: SeoPageDefinition }) {
  const skin = siteSkin();
  const nav = visibleCorePages
    .filter((item) => item.slug.replace(/^\/+|\/+$/g, ""))
    .map((item) => ({ slug: item.slug.replace(/^\/+|\/+$/g, ""), label: item.navLabel, href: routePath(item.slug) }));
  const rendered = renderFixedDocument({
    skin,
    page: "inner",
    accentColorId: siteConfig.theme.accentColorId,
    gameName: siteConfig.game.name || siteConfig.shortName,
    nav,
    currentSlug: page.slug,
    homeHref: "/",
    logoUrl: null,
    heading: page.hero.heading,
    lead: page.hero.lead,
    articleHtml: articleInner(page),
    categoryLabel: categoryLabel(page),
    reviewedLabel: `Reviewed ${page.lastReviewed}`,
  });
  return (
    <>
      <JsonLd data={pageSchemas(page)} />
      <div dangerouslySetInnerHTML={{ __html: placeFixedInnerAds(rendered.rest) }} />
      <FixedAdPortals />
    </>
  );
}
