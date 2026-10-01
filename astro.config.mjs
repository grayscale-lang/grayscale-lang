// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://grayscale-lang.github.io',
  base: '/grayscale-lang',
  integrations: [
    starlight({
      title: 'Grayscale',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/grayscale-lang/grayscale' },
      ],
      components: {
        SocialIcons: './src/components/SocialIcons.astro',
      },
      customCss: ['./src/styles/custom.css'],
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://fonts.googleapis.com',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            crossorigin: true,
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
          },
        },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [{ label: 'Overview', slug: 'overview' }],
        },
        {
          label: 'Guide',
          items: [{ autogenerate: { directory: 'guide' } }],
        },
        {
          label: 'Language Reference',
          items: [{ autogenerate: { directory: 'language' } }],
        },
        {
          label: 'Standard Library',
          items: [{ autogenerate: { directory: 'stdlib' } }],
        },
        {
          label: 'CLI Reference',
          items: [{ autogenerate: { directory: 'cli' } }],
        },
      ],
      expressiveCode: {
        themes: ['github-light', 'github-dark'],
        shiki: {
          langs: [
            {
              ...JSON.parse(
                (await import('fs')).readFileSync(
                  new URL('./src/grammars/grayscale.tmLanguage.json', import.meta.url),
                  'utf-8'
                )
              ),
              name: 'gray',
              aliases: ['grayscale'],
            },
          ],
        },
      },
    }),
  ],
});
