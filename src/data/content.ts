import {
  Archive,
  BookOpen,
  Boxes,
  BrainCircuit,
  Code2,
  FileCode2,
  GitBranch,
  Layers3,
  Library,
  ListChecks,
  Network,
  Radar,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Waypoints,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Chapter = {
  id: string;
  kicker: string;
  title: string;
  summary: string;
  points: string[];
  deepDive: string[];
  callout?: string;
};

export type SkillCard = {
  name: string;
  role: string;
  trigger: string;
  reading: string;
  icon: LucideIcon;
};

export type Principle = {
  name: string;
  short: string;
  detail: string;
  icon: LucideIcon;
};

export type SourceLink = {
  label: string;
  url: string;
  note: string;
};

export const sources: SourceLink[] = [
  {
    label: "Agent Skills Specification",
    url: "https://agentskills.io/specification",
    note: "用于核对通用 Skill 文件格式、必需 frontmatter 字段和可选目录。",
  },
  {
    label: "obra/superpowers",
    url: "https://github.com/obra/superpowers",
    note: "用于确认 Superpowers 是一组可组合的 Agent Skill，而不是单个提示词。",
  },
  {
    label: "Anthropic Agent Skills Docs",
    url: "https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills/overview",
    note: "用于对照跨 Agent 生态中 Skill 的概念、加载方式和安全注意事项。",
  },
  {
    label: "本地安装路径",
    url: "file:///Users/edy/.codex/skills",
    note: "用于读取已安装的 Superpowers Skill 原文并生成文件浏览器内容。",
  },
];

export const principles: Principle[] = [
  {
    name: "Skill 是给 Agent 的操作规程",
    short: "它不是博客，不是复盘，不是长 prompt。",
    detail:
      "有效 Skill 把可复用的判断、流程、边界和验证方式写成 Agent 可执行的工作习惯。人类读起来应该清楚，Agent 执行起来应该少走弯路。",
    icon: ScrollText,
  },
  {
    name: "description 决定发现",
    short: "触发条件比功能简介更重要。",
    detail:
      "Agent 通常先看到 name 和 description，再决定是否加载全文。description 应该描述任务场景、症状、文件类型、风险信号，而不是压缩版教程。",
    icon: Radar,
  },
  {
    name: "渐进披露控制上下文成本",
    short: "常用规则放主文件，重资料放 references。",
    detail:
      "SKILL.md 应保持可快速扫描；大段 API、模板、案例和工具说明放入 references、scripts、assets，让 Agent 需要时再读取。",
    icon: Layers3,
  },
  {
    name: "Superpowers 把方法论拆成技能网",
    short: "每个 Skill 负责一个工作状态。",
    detail:
      "brainstorming 管创意澄清，writing-plans 管计划，executing-plans 管执行，systematic-debugging 管故障，verification-before-completion 管交付前证据。",
    icon: Network,
  },
  {
    name: "写 Skill 也需要验证",
    short: "好 Skill 能改变 Agent 的默认行为。",
    detail:
      "Superpowers 的 writing-skills 把 Skill 写作看成流程文档的 TDD：先设计压力场景，再观察没有 Skill 时的失败，再写最小规则，最后复测。",
    icon: ShieldCheck,
  },
  {
    name: "跨 Agent 迁移要保留语义",
    short: "工具名会变，工作约束不应变。",
    detail:
      "Claude、Codex、Gemini、Copilot 等环境的工具调用不同，但 Skill 的核心结构通常仍是触发条件、过程、约束、引用和验证。",
    icon: Waypoints,
  },
];

export const chapters: Chapter[] = [
  {
    id: "skill-map",
    kicker: "01 / 概念底图",
    title: "Agent Skill 到底是什么",
    summary:
      "Agent Skill 是一种把专业流程写成可加载知识包的方式。它的价值不是让模型“知道更多常识”，而是让模型在特定场景下按你认可的顺序行动。",
    points: [
      "Skill 的最小单位是一个目录和一个 `SKILL.md`。",
      "`SKILL.md` 用 YAML frontmatter 描述元数据，用 Markdown 描述流程。",
      "Skill 适合沉淀跨项目复用的工作法、工具集成、领域规则、格式规范和验证清单。",
      "Skill 不适合承载一次性项目背景；这类内容更适合放入项目级 AGENTS.md、CLAUDE.md 或普通文档。",
    ],
    deepDive: [
      "对 AI 工具进阶用户来说，Skill 是把个人经验从聊天窗口里抽离出来的方式。你不再每次手动提醒“先看上下文、不要猜、验证后再说完成”，而是把这些规则做成可发现、可复用、可版本化的能力。",
      "对开发者来说，Skill 更像轻量插件和操作手册之间的中间层：比 prompt 稳定，比完整插件便宜，比项目 README 更具行动性。它能附带脚本、模板和参考资料，但核心仍是指导 Agent 怎么判断和执行。",
    ],
    callout:
      "判断一个主题是否适合写 Skill：如果你已经第 3 次向 Agent 解释同一套流程，它就值得被沉淀。",
  },
  {
    id: "format",
    kicker: "02 / 文件结构",
    title: "从 SKILL.md 拆开一个 Skill",
    summary:
      "规范层面最重要的是两个必填字段：`name` 和 `description`。目录层面最常见的是 `references/`、`scripts/`、`assets/` 三类可选资源。",
    points: [
      "`name` 应短、稳定、可搜索，通常使用小写字母、数字和连字符。",
      "`description` 是触发条件，应该回答“什么时候要加载这个 Skill”。",
      "`references/` 放需要时再读的长资料，例如 API 参考、策略、示例、领域知识。",
      "`scripts/` 放确定性操作，例如转换、验证、批处理、脚手架生成。",
      "`assets/` 放输出会用到的模板、图片、字体、示例文件。",
    ],
    deepDive: [
      "一个新手常犯的错误是把 Skill 写成“完整教程”。这会让每次触发都消耗大量上下文，也会让 Agent 淹没在解释里。更好的结构是：主文件只保留决策入口、关键流程、强约束和引用导航。",
      "如果某段内容超过 100 行，而且不是每次都必须看，它通常应该移到 references。如果某个操作需要精确、可重复、少出错，它通常应该变成 scripts。如果某个文件只在生成结果时被复制或改写，它通常属于 assets。",
    ],
    callout:
      "Skill 的设计目标不是“资料最全”，而是“Agent 在正确时间加载正确信息”。",
  },
  {
    id: "description",
    kicker: "03 / 发现机制",
    title: "description 是 Skill 的索引入口",
    summary:
      "Agent 在决定是否加载 Skill 时，最先依赖的通常就是描述字段。因此 description 不应该写成广告语，也不应该写成流程摘要。",
    points: [
      "好 description 包含任务、症状、上下文和触发信号。",
      "坏 description 只说“这个 Skill 教你如何……”。",
      "不要把完整工作流塞进 description，否则 Agent 可能只按摘要行动而不读全文。",
      "应该覆盖用户可能使用的同义词、错误描述、工具名称和文件类型。",
      "如果 Skill 只适用于某个平台，要在 description 里明确限制。",
    ],
    deepDive: [
      "Superpowers 的 `writing-skills` 明确强调 description 只描述使用条件，不总结流程。这个观点很关键：如果 description 写着“先写测试、再实现、再重构”，Agent 可能把它当成完整指令，跳过正文里的例外、门禁和验证细节。",
      "一个可复用句式是：`Use when [任务类型], especially [症状/风险/文件/工具/场景].` 中文内容也可以保持这个英文触发句式，因为很多 Agent 对这类模式识别稳定。",
    ],
    callout:
      "description 的目标不是让人觉得这个 Skill 很厉害，而是让 Agent 在对的时刻想起它。",
  },
  {
    id: "superpowers",
    kicker: "04 / Superpowers 总览",
    title: "为什么 Superpowers 是一组 Skill",
    summary:
      "Superpowers 不是单个“超级提示词”，而是一组围绕软件工作流拆分的 Skill。每个 Skill 接管一个工作阶段或风险场景。",
    points: [
      "`using-superpowers` 建立“看到相关场景就加载 Skill”的元规则。",
      "`brainstorming` 管需求澄清和方案确认。",
      "`writing-plans` 把确认后的设计转成可执行计划。",
      "`executing-plans` 和 `subagent-driven-development` 管计划执行。",
      "`systematic-debugging`、`test-driven-development`、`verification-before-completion` 管质量门禁。",
      "`requesting-code-review` 和 `receiving-code-review` 管审查反馈闭环。",
    ],
    deepDive: [
      "把方法论拆成多个 Skill 的好处是触发更精确。并非每次开发都需要读取所有 Superpowers 内容；遇到 bug 时需要系统调试，写新能力时需要头脑风暴和计划，收尾时需要验证和分支整理。",
      "这种结构也降低了维护成本。某个实践变化时，只需修改对应 Skill，而不是重写一个庞大的总提示词。它体现了 Skill 设计里的模块化和渐进披露。",
    ],
    callout:
      "学习 Superpowers 的重点不是背诵每个 Skill，而是理解它如何把复杂工作流切成可触发的状态机。",
  },
  {
    id: "writing-skills",
    kicker: "05 / 核心拆解",
    title: "writing-skills：把 Skill 写作当成 TDD",
    summary:
      "`writing-skills` 最有教学价值的地方，是它把文档写作从“凭感觉总结”改造成“用压力场景验证 Agent 行为”。",
    points: [
      "先定义 Agent 在没有 Skill 时可能犯错的场景。",
      "观察失败，而不是假设失败。",
      "写最小规则修正具体失败。",
      "重新运行场景，确认 Agent 行为改变。",
      "继续补漏洞，但避免把主文件写成百科全书。",
    ],
    deepDive: [
      "传统文档常常解释“我们希望人怎么做”。Skill 文档更苛刻：它要让未来的 Agent 在有限上下文里稳定执行。`writing-skills` 因此把 Skill 看成可测试的流程文档。",
      "这也是为什么好 Skill 经常包含 Common Mistakes、Forbidden Responses、Red Flags、When to Stop 等段落。它们不是为了吓人，而是为了堵住 Agent 常见的合理化路径。",
    ],
    callout:
      "写 Skill 时最重要的问题不是“我知道什么”，而是“Agent 在什么情况下会走偏”。",
  },
  {
    id: "knowledge-architecture",
    kicker: "06 / 内容架构",
    title: "高质量 Skill 的信息层次",
    summary:
      "一个可维护 Skill 通常有三层：元数据负责发现，主文档负责行动，外部资源负责细节和确定性执行。",
    points: [
      "第一层：`name` 和 `description`，决定是否被加载。",
      "第二层：`SKILL.md` 主体，提供最短可执行流程。",
      "第三层：`references/scripts/assets`，按需提供长资料、工具和素材。",
      "第四层：真实使用反馈，驱动迭代。",
    ],
    deepDive: [
      "如果你要写一个 `api-debugging` Skill，主文件应该写排查顺序、禁止猜参数、验证方式；API 细节、错误码表、curl 模板可以放 references；批量重放请求或检查配置的逻辑可以放 scripts。",
      "如果你要写一个 `brand-writing` Skill，主文件应该写语气原则和使用边界；品牌词表、禁用词、示例段落可以放 references；资产模板可以放 assets。",
    ],
    callout:
      "Skill 越成熟，越像一个小型知识产品：入口短、路径清、资料分层、验证可复现。",
  },
  {
    id: "cross-agent",
    kicker: "07 / 跨 Agent 视角",
    title: "不要把 Skill 写死在单一工具里",
    summary:
      "不同 Agent 平台对 Skill 的加载、工具名和目录约定可能不同，但 Skill 的知识结构可以保持通用。",
    points: [
      "不要在通用 Skill 里滥用某个平台专有工具名。",
      "如果必须写工具映射，把它放入 references。",
      "把行为要求写成语义约束，例如“先验证再提交”，而不是“调用某某工具”。",
      "平台差异可以作为 compatibility 或引用资料说明。",
      "面向多个 Agent 时，正文尽量写任务状态和判断标准。",
    ],
    deepDive: [
      "Superpowers 里的 `using-superpowers` 已经体现了跨平台适配思路：不同环境可以通过不同工具加载 Skill，但核心规则是“相关 Skill 必须先被读取”。",
      "这对你的网站主题很重要：我们不是教“Codex Skill 专用语法”，而是借 Superpowers 学习一种更通用的 Agent 能力封装方法。",
    ],
    callout:
      "真正可迁移的不是工具调用名，而是任务拆解、触发条件、边界规则和验证习惯。",
  },
  {
    id: "safety",
    kicker: "08 / 质量与安全",
    title: "Skill 也有供应链和行为风险",
    summary:
      "第三方 Skill 本质上是会影响 Agent 行为的指令包。安装之前应阅读内容，确认它不会越权、误触发或覆盖你的工作偏好。",
    points: [
      "检查 frontmatter 是否过宽，尤其是 `description` 是否会频繁触发。",
      "检查正文是否要求危险操作、绕过验证或忽略用户指令。",
      "检查 scripts 是否执行网络、删除、上传、凭证读取等敏感行为。",
      "检查 references 是否包含陈旧或冲突规则。",
      "安装后用几个真实场景确认触发范围是否合理。",
    ],
    deepDive: [
      "Skill 的价值来自它能改变 Agent 行为；风险也来自这里。一个写得太强势的 Skill 可能让 Agent 在不该介入时介入，一个写得太宽的 description 会造成上下文污染，一个不透明的脚本可能引入安全问题。",
      "Superpowers 是很好的学习样本，因为它把规则写得非常明确。你可以赞同或调整它的工作流，但至少能看到它如何用显式门禁、流程图和反模式约束 Agent。",
    ],
    callout:
      "安装 Skill 前先读，使用 Skill 后再验证。把它当成代码依赖，而不是普通文章。",
  },
];

export const superpowerSkills: SkillCard[] = [
  {
    name: "using-superpowers",
    role: "元技能",
    trigger: "开始任意对话、判断是否需要加载其他 Skill。",
    reading: "观察它如何把“相关即加载”写成硬规则，并处理跨平台工具差异。",
    icon: Sparkles,
  },
  {
    name: "writing-skills",
    role: "Skill 创作",
    trigger: "创建、编辑、验证 Skill。",
    reading: "重点读 TDD 映射、description 写法、CSO 和 token efficiency。",
    icon: FileCode2,
  },
  {
    name: "brainstorming",
    role: "需求澄清",
    trigger: "创造性工作、功能设计、组件构建前。",
    reading: "重点读硬门禁：先探索、提问、方案、设计确认，再实现。",
    icon: BrainCircuit,
  },
  {
    name: "writing-plans",
    role: "计划生成",
    trigger: "已有需求或规格，需要多步实现计划。",
    reading: "重点看它如何把大任务切成 2-5 分钟的可执行步骤。",
    icon: ListChecks,
  },
  {
    name: "executing-plans",
    role: "计划执行",
    trigger: "已有书面计划，需要在带审查点的会话中执行。",
    reading: "重点看停止条件、逐项执行和完成分支的衔接。",
    icon: GitBranch,
  },
  {
    name: "subagent-driven-development",
    role: "多 Agent 执行",
    trigger: "计划中的任务相对独立，适合派发子 Agent。",
    reading: "重点看 fresh subagent、spec review、quality review 的两阶段闭环。",
    icon: Boxes,
  },
  {
    name: "systematic-debugging",
    role: "故障排查",
    trigger: "bug、测试失败、异常行为、构建失败。",
    reading: "重点读“没有根因就不修”的铁律，以及四阶段调查法。",
    icon: Radar,
  },
  {
    name: "test-driven-development",
    role: "开发节奏",
    trigger: "实现功能或修 bug 前。",
    reading: "重点看 RED-GREEN-REFACTOR 和它反对的伪 TDD。",
    icon: Code2,
  },
  {
    name: "verification-before-completion",
    role: "收尾验证",
    trigger: "声明完成、提交、推送、合并前。",
    reading: "重点看证据标准：测试、构建、diff、需求清单。",
    icon: ShieldCheck,
  },
  {
    name: "using-git-worktrees",
    role: "隔离工作区",
    trigger: "开始需要隔离的功能工作或执行计划前。",
    reading: "重点看它如何先检测现有隔离，再创建 worktree。",
    icon: GitBranch,
  },
  {
    name: "requesting-code-review",
    role: "发起审查",
    trigger: "完成任务、主要功能或合并前。",
    reading: "重点看如何给 reviewer 精准上下文，而不是共享完整会话历史。",
    icon: BookOpen,
  },
  {
    name: "receiving-code-review",
    role: "处理反馈",
    trigger: "收到代码审查反馈，尤其反馈不清或可疑时。",
    reading: "重点看技术评估优先于表演式同意。",
    icon: Library,
  },
  {
    name: "dispatching-parallel-agents",
    role: "并行调查",
    trigger: "存在 2 个以上独立任务或独立故障域。",
    reading: "重点看如何分组、隔离上下文、并发派发。",
    icon: Network,
  },
  {
    name: "finishing-a-development-branch",
    role: "分支收尾",
    trigger: "实现完成、测试通过，需要选择合并/PR/保留/丢弃。",
    reading: "重点看完成前验证、环境检测和结构化选项。",
    icon: Archive,
  },
];

export const anatomyRows = [
  ["name", "必需", "短、稳定、可搜索；让人和 Agent 都能快速识别。"],
  ["description", "必需", "触发条件；描述何时使用，而不是摘要流程。"],
  ["SKILL.md body", "必需", "核心工作流、规则、停止条件、验证方式。"],
  ["references/", "可选", "长文档、规范、案例、工具映射、领域资料。"],
  ["scripts/", "可选", "确定性检查、转换、生成、批处理。"],
  ["assets/", "可选", "模板、图片、字体、可复用输出资源。"],
  ["agents/openai.yaml", "推荐", "UI 元数据；方便 Skill 列表和入口展示。"],
];

export const densityNotes = [
  "把 Skill 当成可版本化的行为依赖，而不是聊天技巧。",
  "优先写 Agent 会犯错的地方，而不是你想展示的知识。",
  "主文件写“何时、先后、边界、证据”；参考文件写“细节、枚举、例子”。",
  "每个 Skill 都应该能回答：触发什么场景、改变什么行为、如何确认有效。",
  "Superpowers 的价值在组合：设计、计划、执行、调试、验证、审查、收尾各司其职。",
];
