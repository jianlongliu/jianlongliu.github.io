# Copilot Instructions for AI Agents

This project is a static blog built with [Astro](https://astro.build), using [Tailwind CSS](https://tailwindcss.com), [pnpm](https://pnpm.io), and several custom conventions. Follow these guidelines to be productive and maintain consistency.

## Project Structure & Key Files
- **`src/config.ts`**: Central config for site metadata, navigation, profile, license, and code highlighting. Update this to change site-wide settings.
- **`src/`**: Main source code for the Astro site, including components, pages, and content logic.
- **`public/`**: Static assets (images, etc.) served as-is.
- **`docs/`**: Documentation and guides.
- **`astro.config.mjs`**: Astro project configuration.
- **`tailwind.config.cjs`**: Tailwind CSS configuration.
- **`biome.json`**: Biome code formatter/linter config.
- **`package.json`**: Declares scripts, dependencies, and project metadata.

## Developer Workflows
- **Install dependencies**: `pnpm install`
- **Start dev server**: `pnpm dev` (serves at `localhost:4321`)
- **Build for production**: `pnpm build` (output in `./dist/`)
- **Preview build**: `pnpm preview`
- **Check code**: `pnpm check` (runs Astro and type checks)
- **Format code**: `pnpm format` (uses Biome)
- **Create new post**: `pnpm new-post <filename>` (generates a markdown file in `src/content/posts/`)
- **Astro CLI**: Use `pnpm astro ...` for advanced commands

## CI/CD & Quality
- **GitHub Actions**:
  - `.github/workflows/build.yml`: Checks and builds on Node.js 22/23 for pushes/PRs to `main`.
  - `.github/workflows/deploy.yml`: Deploys to GitHub Pages on push to `main`.
  - `.github/workflows/biome.yml`: Runs Biome for code quality on `src/`.
- **Commit messages**: Use [Conventional Commits](https://www.conventionalcommits.org/) for clarity.

## Project-Specific Patterns
- **Config-driven**: Most site-wide changes (title, theme, navigation, profile, license) are made in `src/config.ts`.
- **Content**: Blog posts are markdown files in `src/content/posts/` with frontmatter (see README for schema).
- **Theme**: Customizable via `src/config.ts` and Tailwind config. Banner, avatar, and color settings are centralized.
- **External links**: Use the `external: true` property in navigation config for external URLs.
- **Icons**: Use [Iconify](https://icones.js.org/) icon codes in config for social/profile links.

## Integration Points
- **Pagefind**: For search functionality (see README for details).
- **Expressive Code**: Enhanced code blocks, configured in `src/config.ts` and `astro.config.mjs`.
- **Deployment**: GitHub Pages via Actions; see workflow files for details.

## Conventions & Tips
- Prefer editing config files over hardcoding values in components.
- Run `pnpm check` and `pnpm format` before submitting code.
- For new features or major changes, open an issue/discussion first.
- See `README.md` and `CONTRIBUTING.md` for more details.

---

For questions about project structure or workflows, check the above files or ask in project discussions.
