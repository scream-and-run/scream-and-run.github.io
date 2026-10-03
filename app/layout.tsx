import type { CSSProperties, ReactNode } from "react";
import Script from "next/script";
import { Analytics } from "@/components/integrations/analytics";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import { scopedTemplateCss } from "@/lib/fixed-template/render";
import { isFixedTemplate } from "@/lib/fixed-template/mode";
import { themes } from "@/config/themes";
import { homePage } from "@/content/home";
import { enabledCorePages, enabledLegalPages } from "@/content/registry";
import { fontFaceCss } from "@/lib/fonts";
import { rootMetadata } from "@/lib/seo";
import "./globals.css";

export const metadata = rootMetadata();

const navLinks = enabledCorePages.map((page) => ({ label: page.navLabel, slug: page.slug }));
const footerLinks = enabledCorePages.map((page) => ({ label: page.navLabel, slug: page.slug }));
const legalLinks = enabledLegalPages.map((page) => ({ label: page.navLabel, slug: page.slug }));

const fixedReadableCss = `
body[data-fixed-template="editorial"] header .head{height:auto;min-height:64px;display:flex;align-items:center;justify-content:space-between;flex-wrap:nowrap;gap:20px;padding:10px 0}
body[data-fixed-template="editorial"] .logo{display:inline-flex;align-items:center;gap:10px;font-size:18px;font-weight:800;letter-spacing:-.03em;line-height:1;white-space:nowrap;flex:none}
body[data-fixed-template="editorial"] .logo img{display:block;width:36px;height:36px;margin:0;object-fit:cover;border-radius:6px;flex:none}
body[data-fixed-template="editorial"] header .nav{display:flex;margin-left:auto;justify-content:flex-end;flex-wrap:wrap;gap:4px;max-width:none}
body[data-fixed-template="editorial"] header .nav-link{padding:8px 10px;font-size:13px;white-space:nowrap}
body[data-fixed-template="editorial"] .home-hero{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(280px,.85fr);gap:28px;align-items:center;margin:8px 0 28px}
body[data-fixed-template="editorial"] .home-hero-copy h1{margin:0 0 14px}
body[data-fixed-template="editorial"] .home-hero-banner{display:block;width:100%;height:auto;border-radius:8px;object-fit:contain;box-shadow:none;background:transparent}
body[data-fixed-template="editorial"] .text-cards{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:0 0 8px}
body[data-fixed-template="editorial"] .text-card{display:block;background:#fff;border:1px solid #DEDEDE;border-radius:8px;padding:16px 18px}
body[data-fixed-template="editorial"] .text-card b{display:block;font-size:17px}
body[data-fixed-template="editorial"] .text-card span{display:block;margin-top:6px;color:#686868;font-size:14px;line-height:1.5}
body[data-fixed-template="editorial"] .article>a{display:block}
body[data-fixed-template="editorial"] .story-art,
body[data-fixed-template="editorial"] .thumb,
body[data-fixed-template="editorial"] .hero-img{display:none}
body[data-fixed-template="editorial"] .lead-card:before{display:none}
body[data-fixed-template="editorial"] .guide-copy{max-width:74ch}
body[data-fixed-template="editorial"] main.wrap>.guide-copy{max-width:none;width:100%}
body[data-fixed-template="editorial"] .body article{max-width:74ch}
body[data-fixed-template="editorial"] .guide-copy p,
body[data-fixed-template="editorial"] .guide-copy li,
body[data-fixed-template="editorial"] .body article p,
body[data-fixed-template="editorial"] .body article li{line-height:1.75}
body[data-fixed-template="editorial"] .guide-copy a,
body[data-fixed-template="editorial"] .body article a{color:#b4232c;text-decoration:underline}
body[data-fixed-template="editorial"] .lead-card a{color:#fff;text-decoration:underline}
body[data-fixed-template="editorial"] .table-scroll{overflow-x:auto;margin:16px 0 22px;-webkit-overflow-scrolling:touch}
body[data-fixed-template="editorial"] .table-scroll table{width:100%;min-width:36rem;border-collapse:collapse;background:#fff;font-size:15px}
body[data-fixed-template="editorial"] .table-scroll caption{caption-side:top;text-align:left;font-weight:800;padding:0 0 8px}
body[data-fixed-template="editorial"] .table-scroll th,
body[data-fixed-template="editorial"] .table-scroll td{border:1px solid #DEDEDE;padding:8px 10px;text-align:left;vertical-align:top}
body[data-fixed-template="editorial"] .table-scroll th{background:#f3f3f3}
body[data-fixed-template="editorial"] h1{overflow-wrap:break-word}
@media(max-width:820px){
  body[data-fixed-template="editorial"] header .head{flex-wrap:wrap;align-items:flex-start}
  body[data-fixed-template="editorial"] header .nav{width:100%;justify-content:flex-end}
  body[data-fixed-template="editorial"] .home-hero,
  body[data-fixed-template="editorial"] .text-cards{grid-template-columns:1fr}
  body[data-fixed-template="editorial"] .article-head h1{font-size:32px}
}
`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  // Unknown/stale presets (e.g. R2 template older than generator) must not crash preview.
  const fixed = isFixedTemplate();
  const fixedSkin = siteSkin();
  const theme = themes[siteConfig.theme.preset] ?? themes["obsidian-red"] ?? themes["midnight-red"] ?? Object.values(themes)[0];
  const headerStyle = siteConfig.theme.headerStyle ?? "solid";
  const componentStyle = siteConfig.theme.componentStyle ?? "rounded";
  const style = Object.fromEntries(
    Object.entries({ ...(theme?.tokens ?? {}), ...(siteConfig.theme.overrides ?? {}) }).map(([key, value]) => [`--${key}`, value]),
  ) as CSSProperties;

  return (
    <html
      lang={siteConfig.language}
      data-theme={theme?.name ?? siteConfig.theme.preset}
      data-skin={siteConfig.theme.skin ?? "portal"}
      data-font={siteConfig.theme.fontId ?? "inter"}
      data-header-style={headerStyle}
      data-component-style={componentStyle}
      data-fixed-template={fixed ? fixedSkin : undefined}
      style={style}
    >
      <head>
        <Analytics />
      </head>
      <body data-fixed-template={fixed ? fixedSkin : undefined}>
        {fixed ? <style dangerouslySetInnerHTML={{ __html: `${scopedTemplateCss(fixedSkin, siteConfig.theme.accentColorId)}\n${fixedReadableCss}` }} /> : null}
        <style dangerouslySetInnerHTML={{ __html: fontFaceCss(siteConfig.hosting.basePath) }} />
        <a href="#main-content" className="skip-link">Skip to content</a>
        <SiteHeader links={navLinks} homeHeading={homePage.hero.heading} homeLead={homePage.hero.lead} />
        <div id="main-content">{children}</div>
        <SiteFooter coreLinks={footerLinks} legalLinks={legalLinks} />
        <Script
          id="adsterra-social-bar"
          src="https://pl31582257.profitableratecpmnetwork.com/ec/56/8f/ec568f8adf1ee80a3feb83b3f422ca53.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
