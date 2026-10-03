const bannerHost = '<div data-fixed-banner-host class="fixed-ad-host"></div>';
const nativeHost = '<div data-fixed-native-host class="fixed-ad-host"></div>';

function insertAfterClass(html: string, tag: string, className: string, ad: string): string {
  const marker = `<${tag} class="${className}"`;
  const start = html.indexOf(marker);
  if (start < 0) throw new Error(`Missing ${className} advertising anchor`);
  const openEnd = html.indexOf(">", start);
  let depth = 1;
  let cursor = openEnd + 1;
  while (depth > 0) {
    const nextOpen = html.indexOf(`<${tag}`, cursor);
    const nextClose = html.indexOf(`</${tag}>`, cursor);
    if (nextClose < 0) throw new Error(`Unclosed ${className} advertising anchor`);
    if (nextOpen >= 0 && nextOpen < nextClose) {
      depth++;
      cursor = nextOpen + tag.length + 1;
    } else {
      depth--;
      cursor = nextClose + tag.length + 3;
    }
  }
  return `${html.slice(0, cursor)}${ad}${html.slice(cursor)}`;
}

export function placeFixedHomeAds(html: string): string {
  return insertAfterClass(
    insertAfterClass(html, "section", "home-hero", bannerHost),
    "div", "text-cards", nativeHost,
  );
}

export function placeFixedInnerAds(html: string): string {
  const withBanner = insertAfterClass(html, "section", "article-head", bannerHost);
  const firstSection = withBanner.indexOf('<section class="guide-copy"');
  if (firstSection < 0) throw new Error("Missing first guide section advertising anchor");
  const firstParagraph = withBanner.indexOf("<p>", firstSection);
  const sectionEnd = withBanner.indexOf("</section>", firstSection);
  if (firstParagraph < 0 || firstParagraph > sectionEnd) {
    return insertAfterClass(withBanner, "section", "guide-copy", nativeHost);
  }
  const paragraphEnd = withBanner.indexOf("</p>", firstParagraph);
  if (paragraphEnd < 0 || paragraphEnd > sectionEnd) throw new Error("Unclosed first guide paragraph");
  const insertionPoint = paragraphEnd + "</p>".length;
  return `${withBanner.slice(0, insertionPoint)}${nativeHost}${withBanner.slice(insertionPoint)}`;
}
