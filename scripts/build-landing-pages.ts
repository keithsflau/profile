import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { watch } from 'node:fs';
import path from 'node:path';

interface ActionLink {
  label: string;
  href: string;
}

interface Feature {
  title: string;
  description: string;
  icon?: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role?: string;
}

interface Stat {
  label: string;
  value: string;
}

interface Milestone {
  label: string;
  status: string;
}

interface Theme {
  heroGradient: string;
  accent: string;
  background: string;
}

interface ProductMeta {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  folderPath: string;
  badge?: string;
  tags?: string[];
  theme: Theme;
  stats?: Stat[];
  milestones?: Milestone[];
  features: Feature[];
  testimonials?: Testimonial[];
  primaryAction: ActionLink;
  secondaryAction?: ActionLink;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

const ROOT_DIR = process.cwd();
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const DATA_PATH = path.join(ROOT_DIR, 'data', 'products.json');
const TEMPLATE_PATH = path.join(ROOT_DIR, 'templates', 'landing.html');

const args = process.argv.slice(2);
const watchMode = args.includes('--watch');

async function buildAll() {
  const [template, productsRaw] = await Promise.all([
    readFile(TEMPLATE_PATH, 'utf8'),
    readFile(DATA_PATH, 'utf8')
  ]);

  const products: ProductMeta[] = JSON.parse(productsRaw);

  await mkdir(path.join(DIST_DIR, 'assets'), { recursive: true });

  await Promise.all(
    products.map(async (product) => {
      const html = renderPage(template, product, products);
      const productDir = path.join(DIST_DIR, product.id);
      await mkdir(productDir, { recursive: true });
      await writeFile(path.join(productDir, 'index.html'), html, 'utf8');
    })
  );

  console.log(
    `✅ Generated ${products.length} landing page${
      products.length === 1 ? '' : 's'
    }`
  );
}

function renderPage(
  template: string,
  product: ProductMeta,
  allProducts: ProductMeta[]
) {
  const replacements: Record<string, string> = {
    '{{PAGE_TITLE}}':
      product.seo?.title ?? `${product.title} | Learning Experiences`,
    '{{META_DESCRIPTION}}':
      product.seo?.description ?? product.description,
    '{{META_KEYWORDS}}': product.seo?.keywords?.join(', ') ?? product.tags?.join(', ') ?? '',
    '{{PAGE_BACKGROUND}}': product.theme.background ?? 'bg-slate-950',
    '{{CSS_PATH}}': resolveCssPath(product),
    '{{NAV}}': renderNav(allProducts, product),
    '{{HERO}}': renderHero(product),
    '{{STATS}}': renderStats(product),
    '{{FEATURES}}': renderFeatures(product),
    '{{MILESTONES}}': renderMilestones(product),
    '{{TESTIMONIALS}}': renderTestimonials(product),
    '{{CTA}}': renderCta(product),
    '{{FOOTER}}': renderFooter()
  };

  return Object.entries(replacements).reduce((acc, [token, value]) => {
    return acc.split(token).join(value);
  }, template);
}

function renderNav(products: ProductMeta[], current: ProductMeta) {
  const links = products
    .map((product) => {
      const href =
        product.id === current.id ? '#top' : `../${product.id}/`;

      return `<a href="${href}" class="text-sm font-medium text-white/70 hover:text-white ${
        product.id === current.id ? 'text-white' : ''
      }">${escapeHtml(product.title)}</a>`;
    })
    .join('');

  return `
    <header class="px-6 py-6">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-6">
        <div>
          <p class="text-xs uppercase tracking-[0.4em] text-white/60">Learning Portfolio</p>
          <p class="text-base font-semibold text-white">Education Engineering Landing Pages</p>
        </div>
        <div class="hidden items-center gap-6 md:flex">${links}</div>
        <button data-nav-toggle class="md:hidden rounded-full border border-white/15 px-4 py-2 text-sm text-white/70">Menu</button>
      </div>
      <div data-nav-menu class="mx-auto mt-4 flex max-w-6xl flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:hidden hidden">${links}</div>
    </header>
  `;
}

function renderHero(product: ProductMeta) {
  const tags = (product.tags ?? [])
    .map(
      (tag) =>
        `<span class="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/70">${escapeHtml(
          tag
        )}</span>`
    )
    .join('');

  const secondary = product.secondaryAction
    ? `<a href="${product.secondaryAction.href}" class="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 hover:border-white/40">${escapeHtml(
        product.secondaryAction.label
      )}</a>`
    : '';

  return `
    <section id="top" class="px-6 pb-6 pt-10 sm:pt-16">
      <div class="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
        <div class="space-y-6">
          <span class="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">${escapeHtml(
            product.badge ?? 'Featured Experience'
          )}</span>
          <div>
            <p class="text-lg font-semibold text-white/70">
              ${escapeHtml(product.subtitle)}
            </p>
            <h1 class="mt-3 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              ${escapeHtml(product.title)}
            </h1>
          </div>
          <p class="text-lg text-white/80">${escapeHtml(product.description)}</p>
          <div class="flex flex-wrap gap-3">${tags}</div>
          <div class="flex flex-wrap gap-4">
            <a href="${product.primaryAction.href}" class="inline-flex items-center justify-center rounded-full bg-gradient-to-r ${
              product.theme.heroGradient
            } px-8 py-3 text-sm font-semibold text-black shadow-lg shadow-black/40">
              ${escapeHtml(product.primaryAction.label)}
            </a>
            ${secondary}
          </div>
        </div>
        <div class="glass-card space-y-6 p-8">
          <div>
            <p class="text-sm uppercase tracking-[0.3em] text-white/60">Folder Path</p>
            <p class="mt-2 font-mono text-sm text-white/80">${escapeHtml(
              product.folderPath
            )}</p>
          </div>
          <div class="grid gap-4 text-sm text-white/80">
            <p class="flex items-start gap-2"><span class="text-white">•</span><span>Ready-to-use landing banner, features grid, milestones, and CTA built with Tailwind.</span></p>
            <p class="flex items-start gap-2"><span class="text-white">•</span><span>Ideal for GitHub Pages or static hosting.</span></p>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderStats(product: ProductMeta) {
  if (!product.stats?.length) return '';

  const cards = product.stats
    .map(
      (stat) => `
        <div class="rounded-2xl border border-white/15 bg-white/5 px-6 py-6 text-center shadow-inner shadow-black/30">
          <p class="text-3xl font-semibold text-white">${escapeHtml(
            stat.value
          )}</p>
          <p class="mt-2 text-sm uppercase tracking-[0.3em] text-white/60">${escapeHtml(
            stat.label
          )}</p>
        </div>
      `
    )
    .join('');

  return `
    <section class="px-6 py-10">
      <div class="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        ${cards}
      </div>
    </section>
  `;
}

function renderFeatures(product: ProductMeta) {
  const cards = product.features
    .map(
      (feature) => `
        <div class="glass-card p-6">
          <div class="flex items-center gap-3">
            ${renderIcon(feature.icon)}
            <h3 class="text-lg font-semibold text-white">${escapeHtml(
              feature.title
            )}</h3>
          </div>
          <p class="mt-3 text-sm text-white/80">${escapeHtml(
            feature.description
          )}</p>
        </div>
      `
    )
    .join('');

  return `
    <section class="px-6 py-12">
      <div class="mx-auto max-w-6xl">
        <p class="section-title">Experience design</p>
        <h2 class="mt-2 text-3xl font-semibold text-white">What educators receive</h2>
        <div class="mt-8 grid gap-6 md:grid-cols-2">${cards}</div>
      </div>
    </section>
  `;
}

function renderMilestones(product: ProductMeta) {
  if (!product.milestones?.length) return '';

  const items = product.milestones
    .map(
      (milestone) => `
        <li class="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
          <span class="text-sm font-medium text-white/80">${escapeHtml(
            milestone.label
          )}</span>
          <span class="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">${escapeHtml(
            milestone.status
          )}</span>
        </li>
      `
    )
    .join('');

  return `
    <section class="px-6 pb-12">
      <div class="mx-auto max-w-6xl">
        <p class="section-title">Roadmap</p>
        <h2 class="mt-2 text-3xl font-semibold text-white">Shipping cadence</h2>
        <ul class="mt-6 space-y-3">${items}</ul>
      </div>
    </section>
  `;
}

function renderTestimonials(product: ProductMeta) {
  if (!product.testimonials?.length) return '';

  const cards = product.testimonials
    .map(
      (testimonial) => `
        <div class="glass-card flex h-full flex-col gap-4 p-6">
          <p class="text-lg text-white/90">“${escapeHtml(testimonial.quote)}”</p>
          <div>
            <p class="font-semibold text-white">${escapeHtml(
              testimonial.name
            )}</p>
            <p class="text-sm text-white/70">${escapeHtml(
              testimonial.role ?? ''
            )}</p>
          </div>
        </div>
      `
    )
    .join('');

  return `
    <section class="px-6 pb-12">
      <div class="mx-auto max-w-6xl">
        <p class="section-title">Voices</p>
        <h2 class="mt-2 text-3xl font-semibold text-white">Classroom impact</h2>
        <div class="mt-8 grid gap-6 md:grid-cols-2">${cards}</div>
      </div>
    </section>
  `;
}

function renderCta(product: ProductMeta) {
  return `
    <section class="px-6 pb-16">
      <div class="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-gradient-to-r ${product.theme.heroGradient} p-10 text-slate-900 shadow-xl">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-black/60">Next Step</p>
        <h3 class="mt-3 text-3xl font-semibold">Publish to GitHub Pages in minutes</h3>
        <p class="mt-2 text-base text-black/80">Use the buttons below to jump straight into the working prototype or inspect the folder containing build assets.</p>
        <div class="mt-6 flex flex-wrap gap-4">
          <a href="${product.primaryAction.href}" class="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white">Open Experience</a>
          ${
            product.secondaryAction
              ? `<a href="${product.secondaryAction.href}" class="rounded-full border border-black/20 px-6 py-3 text-sm font-semibold text-black">Inspect Source</a>`
              : ''
          }
        </div>
      </div>
    </section>
  `;
}

function renderFooter() {
  return `
    <footer class="px-6 pb-10">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-sm text-white/60">
        <p>© ${new Date().getFullYear()} Education Engineering Landing Pages</p>
        <p>Generated with HTML5 + TailwindCSS</p>
      </div>
    </footer>
  `;
}

function renderIcon(name = 'sparkles') {
  const icons: Record<string, string> = {
    sparkles:
      '<svg class="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3v4m0 10v4m7-7h-4M9 12H5m11.657-6.657L14.828 8.17m-5.657 7.657-1.829 1.829m0-11.314 1.829 1.829m5.657 7.657 1.829 1.829"/></svg>',
    scale:
      '<svg class="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3v3m0 12v3m-7-8 3-7 3 7a3 3 0 1 1-6 0zm14 0-3-7-3 7a3 3 0 1 0 6 0zM3 21h18"/></svg>',
    command:
      '<svg class="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 3a3 3 0 0 0 0 6h8a3 3 0 0 0 0-6m0 0a3 3 0 1 0 0 6M8 15a3 3 0 0 0 0 6h8a3 3 0 0 0 0-6m0 0a3 3 0 1 0 0 6M4.5 9v6m15-6v6"/></svg>',
    book:
      '<svg class="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5A2.5 2.5 0 0 1 17.5 21H6.5A2.5 2.5 0 0 1 4 18.5V5.5z"/><path d="M8 7h8"/></svg>',
    bolt:
      '<svg class="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2 4 14h6l-1 8 9-12h-6z"/></svg>',
    shield:
      '<svg class="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3 5 6v6c0 5 3.5 9 7 9s7-4 7-9V6l-7-3z"/></svg>',
    gauge:
      '<svg class="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 19a9 9 0 1 1 14 0H5z"/><path d="M12 12v4"/><path d="m9 12-1.5 4"/></svg>',
    chat:
      '<svg class="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 8h10M7 12h6"/><path d="M21 12a9 9 0 1 0-3.1 6.7L21 21z"/></svg>',
    offline:
      '<svg class="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 8c0-2.21 1.79-4 4-4h4c2.21 0 4 1.79 4 4v8c0 2.21-1.79 4-4 4h-4c-2.21 0-4-1.79-4-4z"/><path d="M9 12h6"/><path d="M9 16h3"/></svg>',
    compass:
      '<svg class="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m6 20 6-16 6 16M3 12h18"/><path d="M6 20h12"/></svg>',
    camera:
      '<svg class="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 7h-3l-2-3h-6L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><circle cx="12" cy="13" r="3"/></svg>'
  };

  return icons[name] ?? icons.sparkles;
}

function resolveCssPath(product: ProductMeta) {
  const productDir = path.join(DIST_DIR, product.id);
  const cssPath = path.join(DIST_DIR, 'assets', 'tailwind.css');
  const relative = path.relative(productDir, cssPath);
  return posixPath(relative || 'assets/tailwind.css');
}

function posixPath(p: string) {
  return p.replace(/\\/g, '/');
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function start() {
  await buildAll();

  if (watchMode) {
    console.log('👀 Watch mode enabled. Regenerating on changes...');
    const handler = async (eventType: string, filename: string | Buffer) => {
      if (!filename) return;
      console.log(`• Change detected: ${filename.toString()} (${eventType})`);
      try {
        await buildAll();
      } catch (error) {
        console.error('Build failed:', error);
      }
    };

    const watchers = ['data', 'templates', 'scripts'].map((dir) =>
      createWatcher(path.join(ROOT_DIR, dir), handler)
    );

    process.on('SIGINT', () => {
      watchers.forEach((w) => w.close());
      console.log('\n👋 Stopped watch mode.');
      process.exit(0);
    });
  }
}

function createWatcher(
  target: string,
  handler: (eventType: string, filename: string | Buffer) => void
) {
  try {
    return watch(target, { recursive: true }, handler);
  } catch (error) {
    console.warn(
      `Watcher fallback (non-recursive) for ${target}: ${(error as Error).message}`
    );
    return watch(target, handler);
  }
}

start().catch((error) => {
  console.error('Landing page build failed:', error);
  process.exit(1);
});

