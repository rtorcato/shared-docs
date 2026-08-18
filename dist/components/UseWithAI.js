import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from '@docusaurus/Link';
import CommandBlock from './CommandBlock.js';
import styles from './UseWithAI.module.css';
/**
 * "Use with AI" section — three cards, one per audience.
 *
 * Ordered by reach, not by our own tooling preference: the skills CLI works in
 * any tool that supports it, so it leads; the Claude Code marketplace is a
 * shortcut for one tool; AGENTS.md is last because that lane is "do nothing, it
 * already shipped in your node_modules" rather than a competing action.
 *
 * Content is per-package via props; layout and styling are shared.
 */
export default function UseWithAI({ repo, plugin, pkg, skill = plugin, name = plugin, blurb, }) {
    const targets = [
        {
            title: 'Any coding agent',
            desc: _jsx(_Fragment, { children: "Pull the skill into any tool the skills CLI supports." }),
            commands: [`npx skills add https://github.com/${repo} --skill ${skill}`],
        },
        {
            title: 'Claude Code',
            desc: _jsx(_Fragment, { children: "The repo is its own plugin marketplace \u2014 add it, then install the skill." }),
            commands: [`/plugin marketplace add ${repo}`, `/plugin install ${plugin}@${plugin}`],
        },
        {
            title: 'Cursor, Copilot, Codex',
            desc: (_jsxs(_Fragment, { children: ["They read ", _jsx("code", { children: "AGENTS.md" }), ". It ships in the npm tarball, so it is already in your", ' ', _jsx("code", { children: "node_modules" }), "."] })),
            commands: [`node_modules/${pkg}/AGENTS.md`],
        },
    ];
    return (_jsxs("section", { className: styles.section, children: [_jsxs("div", { className: styles.sectionHead, children: [_jsxs("div", { children: [_jsx("h2", { className: styles.h2, children: "Use with AI" }), _jsx("p", { className: styles.sub, children: blurb ??
                                    `A skill ships with the package so coding agents use ${name} correctly — whichever tool you're in.` })] }), _jsx(Link, { className: styles.viewAll, href: `https://github.com/${repo}/blob/main/AGENTS.md`, children: "Read the rules \u2192" })] }), _jsx("div", { className: styles.aiStack, children: targets.map((t) => (_jsxs("div", { className: styles.card, children: [_jsx("div", { className: styles.cardTitle, children: t.title }), _jsx("div", { className: styles.cardDesc, children: t.desc }), _jsx("div", { className: styles.cmds, children: _jsx(CommandBlock, { commands: t.commands }) })] }, t.title))) })] }));
}
