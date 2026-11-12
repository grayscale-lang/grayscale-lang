import { marked } from 'marked';
import source from '../data/CHANGELOG.md?raw';

export interface ChangelogEntry {
  id: string;
  title: string;
  date: string;
  group: string;
  tag: string;
  repo: string;
  html: string;
}

// Everything after the "Prehistory (as EZ)" heading is the EZ repository's history, and its
// version numbers overlap Grayscale's.
let inEz = false;

// Every "## " line starts one entry; the "# Changelog" title before the first is dropped.
export const entries: ChangelogEntry[] = source
  .split(/^## /m)
  .slice(1)
  .map((chunk) => {
    const newline = chunk.indexOf('\n');
    const heading = chunk.slice(0, newline).trim();
    const body = chunk.slice(newline + 1).replace(/\n---\s*$/, '');
    const date = heading.match(/\((\d{4}-\d{2}-\d{2})\)\s*$/)?.[1] ?? '';
    const bare = heading.replace(/\s*\(\d{4}-\d{2}-\d{2}\)\s*$/, '');
    if (heading.startsWith('Prehistory')) inEz = true;
    const version = heading.match(/^\[([0-9]+\.[0-9]+\.[0-9]+[^\]]*)\]/)?.[1]
      ?? bare.match(/^(?:Grayscale )?([0-9]+\.[0-9]+\.[0-9]+)$/)?.[1];
    const title = version ?? bare;
    const parts = title.split('.');
    let group = 'Experimental builds';
    if (inEz) group = `EZ ${version ? parts[0] : '3'}.x`;
    else if (version) group = `${parts[0]}.${parts[1]}.x`;
    const id = (inEz ? 'ez-' : '') + title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    let tag = '';
    if (version) tag = inEz ? `v${title}` : `grayscale-v${title}`;
    else if (title.startsWith('experimental-')) tag = title;
    const repo = inEz ? 'SchoolyB/EZ' : 'grayscale-lang/grayscale';
    return { id, title, date, group, tag, repo, html: marked.parse(body, { gfm: true }) as string };
  });

// The table of contents Starlight shows under "On this page": one level-2 heading per group,
// with its entries nested beneath it.
export const headings = (() => {
  const result: { depth: number; slug: string; text: string }[] = [];
  let current = '';
  for (const entry of entries) {
    if (entry.group !== current) {
      current = entry.group;
      result.push({ depth: 2, slug: `group-${current.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, text: current });
    }
    result.push({ depth: 3, slug: entry.id, text: entry.title });
  }
  return result;
})();
