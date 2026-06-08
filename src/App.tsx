import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookMarked,
  ChevronRight,
  Clipboard,
  FileText,
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

function App() {
  const [activeFile, setActiveFile] = useState<FileEntry>(fileCorpus[0]);
  const [fileFilter, setFileFilter] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const filteredFiles = useMemo(() => {
    const keyword = fileFilter.trim().toLowerCase();
    if (!keyword) return fileCorpus;
    return fileCorpus.filter((file) =>
      `${file.group} ${file.path} ${file.language}`.toLowerCase().includes(keyword),
    );
  }, [fileFilter]);

  const groupedFiles = useMemo(() => {
    return filteredFiles.reduce<Record<string, FileEntry[]>>((acc, file) => {
      acc[file.group] ??= [];
      acc[file.group].push(file);
      return acc;
    }, {});
  }, [filteredFiles]);

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
            <h1>Learn Agent Skills via Superpowers</h1>
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
                  <h2>完整项目文件内容</h2>
                  <p>
                    左侧是 Superpowers 原始 Skill 文件和本站源码文本；右侧显示完整文件内容。
                    构建产物、依赖目录、二进制图片和 lockfile 不放入浏览器，以免淹没阅读。
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
                  {Object.entries(groupedFiles).map(([group, files]) => (
                    <div className="file-group" key={group}>
                      <h3>{group}</h3>
                      {files.map((file) => (
                        <button
                          type="button"
                          key={`${file.group}-${file.path}`}
                          className={file.path === activeFile.path ? "active" : ""}
                          onClick={() => setActiveFile(file)}
                        >
                          <FileText size={15} />
                          <span>{file.path}</span>
                        </button>
                      ))}
                    </div>
                  ))}
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
