import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
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

entries.sort((a, b) => {
  return a.path.localeCompare(b.path);
});

const output = `export type FileEntry = {
  group: "Superpowers";
  path: string;
  language: string;
  content: string;
};

export const fileCorpus: FileEntry[] = ${JSON.stringify(entries, null, 2)};
`;

await writeFile(
  path.resolve("src/data/fileCorpus.generated.ts"),
  output,
);
console.log(`Generated ${entries.length} file entries.`);
