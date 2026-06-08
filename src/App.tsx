import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowUpRight,
  BookMarked,
  ChevronRight,
  ChevronDown,
  Clipboard,
  FileText,
  Folder,
  FolderOpen,
  Github,
  Hash,
  LibraryBig,
  Menu,
  PanelLeftClose,
  Search,
  ShieldAlert,
  X,
} from "lucide-react";
import {
  anatomyRows,
  chapters,
  densityNotes,
  principles,
  sources,
  superpowerSkills,
} from "./data/content";
import { fileCorpus } from "./data/fileCorpus.generated";
import type { FileEntry } from "./data/fileCorpus.generated";

const heroImage = `${import.meta.env.BASE_URL}assets/agent-skills-atlas.png`;

type FileTreeNode = {
  id: string;
  name: string;
  file?: FileEntry;
  children: FileTreeNode[];
};

function getTreeParts(file: FileEntry) {
  if (file.path.startsWith("superpowers/")) {
    return file.path.replace("superpowers/", "").split("/");
  }
  return file.path.split("/");
}

function insertFileNode(parent: FileTreeNode, parts: string[], file: FileEntry, prefix: string) {
  const [name, ...rest] = parts;
  if (!name) return;

  const id = `${prefix}/${name}`;
  let child = parent.children.find((node) => node.name === name);
  if (!child) {
    child = { id, name, children: [] };
    parent.children.push(child);
  }

  if (rest.length === 0) {
    child.file = file;
    return;
  }

  insertFileNode(child, rest, file, id);
}

function sortTree(nodes: FileTreeNode[]) {
  nodes.sort((a, b) => {
    const aIsFolder = a.children.length > 0;
    const bIsFolder = b.children.length > 0;
    if (aIsFolder !== bIsFolder) return aIsFolder ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  nodes.forEach((node) => sortTree(node.children));
}

function buildFileTree(files: FileEntry[]) {
  const roots: FileTreeNode[] = [
    { id: "Superpowers", name: "Superpowers", children: [] },
  ];

  for (const file of files) {
    const root = roots.find((node) => node.name === file.group);
    if (!root) continue;
    insertFileNode(root, getTreeParts(file), file, root.id);
  }

  sortTree(roots);
  return roots.filter((root) => root.children.length > 0);
}

type FileTreeProps = {
  node: FileTreeNode;
  level: number;
  activePath: string;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (file: FileEntry) => void;
};

function FileTreeItem({
  node,
  level,
  activePath,
  expandedIds,
  onToggle,
  onSelect,
}: FileTreeProps) {
  const isFolder = node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isActive = node.file?.path === activePath;

  if (!isFolder && node.file) {
    return (
      <button
        type="button"
        className={`tree-row file-row ${isActive ? "active" : ""}`}
        style={{ "--tree-level": level } as CSSProperties}
        onClick={() => onSelect(node.file!)}
      >
        <FileText size={15} />
        <span>{node.name}</span>
      </button>
    );
  }

  return (
    <div className="tree-node">
      <button
        type="button"
        className="tree-row folder-row"
        style={{ "--tree-level": level } as CSSProperties}
        onClick={() => onToggle(node.id)}
      >
        {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        {isExpanded ? <FolderOpen size={15} /> : <Folder size={15} />}
        <span>{node.name}</span>
      </button>
      {isExpanded ? (
        <div className="tree-children">
          {node.children.map((child) => (
            <FileTreeItem
              key={child.id}
              node={child}
              level={level + 1}
              activePath={activePath}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function App() {
  const [activeFile, setActiveFile] = useState<FileEntry>(fileCorpus[0]);
  const [fileFilter, setFileFilter] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [expandedFileNodes, setExpandedFileNodes] = useState(
    () =>
      new Set([
        "Superpowers",
        "Superpowers/brainstorming",
        "Superpowers/using-superpowers",
        "Superpowers/writing-skills",
      ]),
  );

  const filteredFiles = useMemo(() => {
    const keyword = fileFilter.trim().toLowerCase();
    if (!keyword) return fileCorpus;
    return fileCorpus.filter((file) =>
      `${file.group} ${file.path} ${file.language}`.toLowerCase().includes(keyword),
    );
  }, [fileFilter]);

  const fileTree = useMemo(() => buildFileTree(filteredFiles), [filteredFiles]);

  const toggleFileNode = (id: string) => {
    setExpandedFileNodes((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const copyActiveFile = async () => {
    await navigator.clipboard.writeText(activeFile.content);
  };

  return (
    <div className="site-shell">
      <header className="topbar">
        <a href="#top" className="brand">
          <span className="brand-mark">AS</span>
          <span>Learn Agent Skills</span>
        </a>
        <nav className="topnav" aria-label="Primary">
          <a href="#chapters">Chapters</a>
          <a href="#superpowers">Superpowers</a>
          <a href="#files">Files</a>
          <a href="#sources">Sources</a>
        </nav>
        <button
          className="icon-button nav-toggle"
          type="button"
          aria-label="Open navigation"
          onClick={() => setMobileNavOpen(true)}
        >
          <Menu size={18} />
        </button>
      </header>

      {mobileNavOpen ? (
        <div className="mobile-drawer">
          <button
            className="icon-button drawer-close"
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
          >
            <X size={18} />
          </button>
          {chapters.map((chapter) => (
            <a
              key={chapter.id}
              href={`#${chapter.id}`}
              onClick={() => setMobileNavOpen(false)}
            >
              {chapter.title}
            </a>
          ))}
        </div>
      ) : null}

      <main id="top">
        <section className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="hero-scrim" />
          <div className="hero-content">
            <p className="eyebrow">Knowledge magazine / Superpowers field notes</p>
            <h1>
              <span>Learn Agent</span>
              <span>Skills via</span>
              <span>Superpowers</span>
            </h1>
            <p className="hero-copy">
              从 0 理解 Agent Skill 的结构、触发、文件组织和验证方式；以
              Superpowers 为样本，学习如何把个人工作流变成可复用、可审查、可迁移的
              Agent 能力。
            </p>
            <div className="hero-actions">
              <a href="#chapters" className="text-button primary">
                开始阅读 <ChevronRight size={16} />
              </a>
              <a href="#files" className="text-button ghost">
                查看文件解剖 <FolderOpen size={16} />
              </a>
            </div>
          </div>
        </section>

        <section className="briefing-band">
          <div className="briefing-grid">
            <div>
              <p className="section-kicker">Research framing</p>
              <h2>把 Skill 当作 Agent 的知识工程单元</h2>
            </div>
            <p>
              本站面向 AI 工具进阶用户和开发者，不做练习题，而是提供高密度阅读：
              每一章都围绕一个可复用判断展开，并把 Superpowers 的真实文件放在同一页面中拆解。
            </p>
            <ul className="density-list">
              {densityNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </section>

        <div className="reading-layout">
          <aside className="toc">
            <div className="toc-title">
              <BookMarked size={16} />
              阅读目录
            </div>
            {chapters.map((chapter) => (
              <a key={chapter.id} href={`#${chapter.id}`}>
                <span>{chapter.kicker.split(" / ")[0]}</span>
                {chapter.title}
              </a>
            ))}
          </aside>

          <div className="content-flow">
            <section className="principles-grid" aria-label="Core principles">
              {principles.map((principle) => {
                const Icon = principle.icon;
                return (
                  <article className="principle-card" key={principle.name}>
                    <div className="principle-icon">
                      <Icon size={20} />
                    </div>
                    <h3>{principle.name}</h3>
                    <p className="principle-short">{principle.short}</p>
                    <p>{principle.detail}</p>
                  </article>
                );
              })}
            </section>

            <section id="chapters" className="chapter-stack">
              {chapters.map((chapter) => (
                <article className="chapter" id={chapter.id} key={chapter.id}>
                  <div className="chapter-heading">
                    <p className="section-kicker">{chapter.kicker}</p>
                    <h2>{chapter.title}</h2>
                    <p className="chapter-summary">{chapter.summary}</p>
                  </div>
                  <div className="chapter-body">
                    <div className="point-panel">
                      <h3>
                        <Hash size={16} />
                        核心要点
                      </h3>
                      <ul>
                        {chapter.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="deep-copy">
                      {chapter.deepDive.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                      {chapter.callout ? (
                        <blockquote>{chapter.callout}</blockquote>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <section className="anatomy-section">
              <div className="section-header-row">
                <div>
                  <p className="section-kicker">Reference anatomy</p>
                  <h2>Skill 文件组成速查</h2>
                </div>
                <p>
                  这张表对应通用 Skill 结构，也对应本站文件浏览器里能看到的真实样本。
                </p>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>组成</th>
                      <th>状态</th>
                      <th>作用</th>
                    </tr>
                  </thead>
                  <tbody>
                    {anatomyRows.map(([name, status, role]) => (
                      <tr key={name}>
                        <td>
                          <code>{name}</code>
                        </td>
                        <td>{status}</td>
                        <td>{role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="superpowers" className="superpowers-section">
              <div className="section-header-row">
                <div>
                  <p className="section-kicker">Superpowers atlas</p>
                  <h2>14 个 Skill 的阅读路线</h2>
                </div>
                <p>
                  先读 `using-superpowers` 理解元规则，再读 `writing-skills` 理解创作方法；
                  其余 Skill 按开发工作流阶段展开。
                </p>
              </div>
              <div className="skill-grid">
                {superpowerSkills.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <article className="skill-card" key={skill.name}>
                      <div className="skill-card-top">
                        <div className="skill-icon">
                          <Icon size={18} />
                        </div>
                        <span>{skill.role}</span>
                      </div>
                      <h3>{skill.name}</h3>
                      <p>
                        <strong>触发：</strong>
                        {skill.trigger}
                      </p>
                      <p>
                        <strong>读法：</strong>
                        {skill.reading}
                      </p>
                    </article>
                  );
                })}
              </div>
            </section>

            <section id="files" className="file-lab">
              <div className="file-lab-header">
                <div>
                  <p className="section-kicker">Source dissection</p>
                  <h2>Superpowers 文件内容</h2>
                  <p>
                    左侧只展示 Superpowers 的原始 Skill 文件目录树；右侧显示完整文件内容。
                    这里保留真实 `SKILL.md`、references、scripts 和相关文本资料，方便直接拆解学习。
                  </p>
                </div>
                <button className="icon-button copy-button" type="button" onClick={copyActiveFile}>
                  <Clipboard size={18} />
                  <span>复制当前文件</span>
                </button>
              </div>

              <div className="file-browser">
                <aside className="file-list">
                  <label className="file-search">
                    <Search size={16} />
                    <input
                      value={fileFilter}
                      onChange={(event) => setFileFilter(event.target.value)}
                      placeholder="过滤文件"
                    />
                  </label>
                  <div className="file-tree" aria-label="Superpowers file tree">
                    {fileTree.map((node) => (
                      <FileTreeItem
                        key={node.id}
                        node={node}
                        level={0}
                        activePath={activeFile.path}
                        expandedIds={expandedFileNodes}
                        onToggle={toggleFileNode}
                        onSelect={setActiveFile}
                      />
                    ))}
                  </div>
                </aside>
                <section className="code-reader">
                  <div className="code-reader-header">
                    <div>
                      <span>{activeFile.group}</span>
                      <h3>{activeFile.path}</h3>
                    </div>
                    <code>{activeFile.language}</code>
                  </div>
                  <pre>
                    <code>{activeFile.content}</code>
                  </pre>
                </section>
              </div>
            </section>

            <section id="sources" className="sources-section">
              <div className="section-header-row">
                <div>
                  <p className="section-kicker">Research trail</p>
                  <h2>调研来源</h2>
                </div>
                <p>
                  公开资料用于确认通用规范和生态背景；本地文件用于展示实际安装后的
                  Superpowers 内容。
                </p>
              </div>
              <div className="source-list">
                {sources.map((source) => (
                  <a
                    key={source.label}
                    href={source.url}
                    target={source.url.startsWith("file:") ? undefined : "_blank"}
                    rel={source.url.startsWith("file:") ? undefined : "noreferrer"}
                  >
                    <LibraryBig size={18} />
                    <span>
                      <strong>{source.label}</strong>
                      <small>{source.note}</small>
                    </span>
                    <ArrowUpRight size={16} />
                  </a>
                ))}
              </div>
            </section>

            <section className="closing-note">
              <ShieldAlert size={20} />
              <p>
                安装第三方 Skill 前，先把它当成代码依赖审查：读 frontmatter，读门禁规则，
                看 scripts 做什么，再决定是否长期启用。
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer>
        <span>Learn Agent Skills via Superpowers</span>
        <a href="https://github.com/obra/superpowers" target="_blank" rel="noreferrer">
          <Github size={16} />
          obra/superpowers
        </a>
      </footer>
      <button
        className="floating-toc"
        type="button"
        aria-label="Collapse table of contents"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <PanelLeftClose size={18} />
      </button>
    </div>
  );
}

export default App;
