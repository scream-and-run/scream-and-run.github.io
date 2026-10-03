import type { DataTable, InternalLink, PageSection, Subsection } from "@/config/types";
import { routePath } from "@/lib/urls";
import { esc } from "./render";

function renderTable(table: DataTable): string {
  const head = table.columns.map((column) => `<th scope="col">${esc(column)}</th>`).join("");
  const body = table.rows
    .map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`)
    .join("");
  return `<div class="table-scroll"><table><caption>${esc(table.caption)}</caption><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

function renderBullets(bullets?: string[]): string {
  if (!bullets?.length) return "";
  return `<ul>${bullets.map((bullet) => `<li>${esc(bullet)}</li>`).join("")}</ul>`;
}

function renderLinks(links?: InternalLink[]): string {
  if (!links?.length) return "";
  return `<ul class="guide-links">${links
    .map((link) => {
      const description = link.description ? ` ${esc(link.description)}` : "";
      return `<li><a href="${esc(routePath(link.slug))}">${esc(link.label)}</a>${description}</li>`;
    })
    .join("")}</ul>`;
}

function renderSubsection(subsection: Subsection): string {
  const paragraphs = subsection.paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("");
  const table = subsection.table ? renderTable(subsection.table) : "";
  return `<h3>${esc(subsection.heading)}</h3>${paragraphs}${renderBullets(subsection.bullets)}${table}`;
}

export function renderSectionsHtml(sections: PageSection[]): string {
  return sections
    .map((section) => {
      const intro = section.intro ? `<p>${esc(section.intro)}</p>` : "";
      const paragraphs = (section.paragraphs ?? []).map((paragraph) => `<p>${esc(paragraph)}</p>`).join("");
      const subsections = (section.subsections ?? []).map(renderSubsection).join("");
      const steps = section.steps?.length
        ? `<ol>${section.steps
            .map((step) => `<li><b>${esc(step.heading)}</b> ${esc(step.description)}</li>`)
            .join("")}</ol>`
        : "";
      const table = section.table ? renderTable(section.table) : "";
      return `<section class="guide-copy" id="${esc(section.id)}"><h2>${esc(section.heading)}</h2>${intro}${paragraphs}${renderBullets(section.bullets)}${subsections}${steps}${table}${renderLinks(section.links)}</section>`;
    })
    .join("");
}
