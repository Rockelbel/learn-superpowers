# Learn Agent Skills via Superpowers

A high-density Chinese knowledge magazine for learning Agent Skills through the
`obra/superpowers` skill set.

## What It Covers

- Agent Skill concepts that apply across agent platforms
- `SKILL.md` structure and frontmatter design
- `description` as the discovery surface
- Progressive disclosure with `references/`, `scripts/`, and `assets/`
- A guided reading map for the 14 Superpowers skills
- An embedded source file browser for the Superpowers samples and this site

## Development

```bash
npm install
npm run dev
```

Local URL:

```text
http://127.0.0.1:5173/learn-superpowers/
```

## Build

```bash
npm run build
```

## File Browser Data

The embedded file browser is generated from local text files:

```bash
node scripts/generate-file-corpus.mjs
```

It includes only Superpowers text files. It excludes this site's project source,
dependencies, build output, binary assets, and lockfiles.

## Deployment

The project includes a GitHub Actions workflow at
`.github/workflows/pages.yml` for GitHub Pages deployment.
