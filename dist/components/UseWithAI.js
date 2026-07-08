import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import CommandBlock from './CommandBlock.js';
import styles from './UseWithAI.module.css';
/**
 * "Use with AI" section — two lanes: Claude Code (marketplace + plugin install)
 * and other agents (bundled AGENTS.md / pasteable rules). Content is per-package,
 * passed via props; layout and styling are shared.
 */
export default function UseWithAI({ repo, plugin, name = plugin, rules, }) {
    return (_jsxs("section", { className: styles.section, children: [_jsx("div", { className: styles.sectionHead, children: _jsxs("div", { children: [_jsx("h2", { className: styles.h2, children: "Use with AI" }), _jsxs("p", { className: styles.sub, children: ["A skill ships with the package so coding agents use ", name, " correctly \u2014 whichever tool you're in."] })] }) }), _jsxs("div", { className: styles.aiGrid, children: [_jsxs("div", { className: styles.aiLane, children: [_jsx("div", { className: styles.aiLaneHead, children: "Claude Code" }), _jsx("p", { className: styles.aiLaneSub, children: "Register the marketplace once, then install the plugin:" }), _jsx(CommandBlock, { commands: [`/plugin marketplace add ${repo}`, `/plugin install ${plugin}@${plugin}`] })] }), _jsxs("div", { className: styles.aiLane, children: [_jsx("div", { className: styles.aiLaneHead, children: "Cursor, Copilot, Codex & others" }), _jsxs("p", { className: styles.aiLaneSub, children: ["They read the bundled ", _jsx("code", { children: "AGENTS.md" }), " from ", _jsx("code", { children: "node_modules" }), " \u2014 or paste these rules into your agent config."] }), _jsx("div", { className: styles.aiRules, children: _jsx(CodeBlock, { language: "md", children: rules }) }), _jsx(Link, { className: styles.aiLaneLink, href: `https://github.com/${repo}/blob/main/AGENTS.md`, children: "View AGENTS.md \u2192" })] })] })] }));
}
