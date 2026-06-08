import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const skillsRoot = "/Users/edy/.codex/skills";

const superpowerSkillNames = [
  "using-superpowers",
  "writing-skills",
  "brainstorming",
  "writing-plans",
  "executing-plans",
  "finishing-a-development-branch",
  "systematic-debugging",
  "test-driven-development",
  "verification-before-completion",
  "using-git-worktrees",
  "requesting-code-review",
  "receiving-code-review",
  "dispatching-parallel-agents",
  "subagent-driven-development",
];

const projectInclude = [
  ".gitignore",
  ".github/workflows/pages.yml",
  "README.md",
  "package.json",
  "index.html",
  "vite.config.ts",
  "tsconfig.json",
  "tsconfig.app.json",
  "tsconfig.node.json",
  "eslint.config.js",
  "src/main.tsx",
  "src/App.tsx",
  "src/vite-env.d.ts",
  "src/styles.css",
  "src/data/content.ts",
  "scripts/generate-file-corpus.mjs",
];

const languageByExt = new Map([
  [".md", "markdown"],
  [".ts", "ts"],
  [".tsx", "tsx"],
  [".js", "js"],
  [".mjs", "js"],
  [".cjs", "js"],
  [".json", "json"],
  [".yml", "yaml"],
  [".yaml", "yaml"],
  [".html", "html"],
  [".css", "css"],
  [".sh", "bash"],
  [".dot", "dot"],
]);

function languageFor(filePath) {
  return languageByExt.get(path.extname(filePath)) ?? "text";
}

async function walkTextFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkTextFiles(fullPath)));
      continue;
    }
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name);
    if (!languageByExt.has(ext)) continue;
    const info = await stat(fullPath);
    if (info.size > 180_000) continue;
    files.push(fullPath);
  }
  return files;
}

async function readEntry(group, displayPath, absolutePath) {
  const content = await readFile(absolutePath, "utf8");
  return {
    group,
    path: displayPath,
    language: languageFor(absolutePath),
    content,
  };
}

const entries = [];

for (const skillName of superpowerSkillNames) {
  const skillDir = path.join(skillsRoot, skillName);
  const files = await walkTextFiles(skillDir);
  for (const file of files) {
    const displayPath = path.join("superpowers", skillName, path.relative(skillDir, file));
    entries.push(await readEntry("Superpowers", displayPath, file));
  }
}

for (const relPath of projectInclude) {
  const absolutePath = path.join(root, relPath);
  entries.push(await readEntry("Project", relPath, absolutePath));
}

entries.sort((a, b) => {
  if (a.group !== b.group) return a.group.localeCompare(b.group);
  return a.path.localeCompare(b.path);
});

const output = `export type FileEntry = {
  group: "Superpowers" | "Project";
  path: string;
  language: string;
  content: string;
};

export const fileCorpus: FileEntry[] = ${JSON.stringify(entries, null, 2)};
`;

await writeFile(path.join(root, "src/data/fileCorpus.generated.ts"), output);
console.log(`Generated ${entries.length} file entries.`);
