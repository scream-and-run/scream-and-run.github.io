import { FixedAdPortals } from "@/components/integrations/fixed-ad-portals";
import { Faq } from "@/components/site/faq";
import { JsonLd } from "@/components/site/json-ld";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { HomePageDefinition, InternalLink } from "@/config/types";
import { enabledCorePages } from "@/content/registry";
import { esc, renderFixedDocument } from "@/lib/fixed-template/render";
import { placeFixedHomeAds } from "@/lib/fixed-template/ad-placement";
import { renderSectionsHtml } from "@/lib/fixed-template/sections";
import { homeSchemas } from "@/lib/schema";
import { assetPath, routePath } from "@/lib/urls";

const cardText: Record<string, string> = {
  "scream-and-run-grinch-update": "The live [GRINCH UPD] title, the official event, and WhoVille.",
  "scream-and-run-key-locations": "How the school key search works, and what the other maps ask for.",
  "scream-and-run-maps": "School, Mines, Play Place, Pizzeria, and the newest map.",
  "how-to-escape-scream-and-run": "Name the map first, then follow the objective that actually opens the exit.",
  "scream-and-run-pizzeria": "Fuses, the Power Box, doors, and the clock to 6 AM.",
  "scream-and-run-play-place": "A screwdriver, the gate panel, then the colored exit keys.",
  "scream-and-run-mines": "Pickaxe, coal, furnace, then the explosive exit. Not a key hunt.",
};

function textCard(slug: string, title: string, text: string) {
  return `<a class="text-card" href="${esc(routePath(slug))}"><b>${esc(title)}</b><span>${esc(text)}</span></a>`;
}

function polishHome(html: string, home: HomePageDefinition) {
  const banner = assetPath(siteConfig.assets.cover);
  const hero = `<section class="home-hero"><div class="home-hero-copy"><h1>${esc(home.hero.heading)}</h1><p class="deck">${esc(home.hero.lead)}</p></div><img class="home-hero-banner" src="${esc(banner)}" alt="${esc(`${siteConfig.game.name} cover`)}"></section>`;
  const cards = `<div class="text-cards">${textCard("scream-and-run-key-locations", "Key locations", "Search the school backpacks, then see which maps do not use keys.")}${textCard("how-to-escape-scream-and-run", "Escape guide", "School, Mines, Play Place, and Pizzeria each open the exit differently.")}</div>`;
  let next = html.replace(/<h1>[\s\S]*?<\/h1>/, "");
  next = next.replace(/<section class="leadgrid">[\s\S]*?<\/section>/, `${hero}${cards}`);
  return next.replace(/<h2>\s*Latest Guides\s*<\/h2>/, "<h2>Browse The Guides</h2>");
}

export function FixedTemplateHome({ home }: { home: HomePageDefinition }) {
  const skin = siteSkin();
  const links: InternalLink[] = enabledCorePages
    .filter((page) => page.slug.replace(/^\/+|\/+$/g, ""))
    .map((page) => ({ slug: page.slug, label: page.navLabel }));
  const entries = links.map((link) => ({
    href: routePath(link.slug),
    title: link.label,
    text: cardText[link.slug] || link.label,
  }));
  const rendered = renderFixedDocument({
    skin,
    page: "home",
    accentColorId: siteConfig.theme.accentColorId,
    gameName: siteConfig.game.name || siteConfig.shortName,
    nav: links.map((link) => ({ slug: link.slug, label: link.label, href: routePath(link.slug) })),
    homeHref: "/",
    logoUrl: assetPath(siteConfig.assets.logo),
    bannerUrl: assetPath(siteConfig.assets.cover),
    heading: home.hero.heading,
    lead: home.hero.lead,
    entries,
    supplementHtml: renderSectionsHtml(home.sections),
  });
  return (
    <>
      <JsonLd data={homeSchemas(home)} />
      <div dangerouslySetInnerHTML={{ __html: placeFixedHomeAds(polishHome(rendered.rest, home)) }} />
      <FixedAdPortals />
      {home.faq.length ? (
        <div className="site-container"><Faq items={home.faq} /></div>
      ) : null}
    </>
  );
}
