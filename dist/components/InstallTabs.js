import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import styles from './InstallTabs.module.css';
const MANAGERS = [
    { id: 'npm', cmd: (p) => `npm install ${p}` },
    { id: 'pnpm', cmd: (p) => `pnpm add ${p}` },
    { id: 'yarn', cmd: (p) => `yarn add ${p}` },
    { id: 'bun', cmd: (p) => `bun add ${p}` },
];
/** Copy / checkmark icon — shared with CommandBlock. */
export function CopyIcon({ done }) {
    return (_jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", role: "img", children: [_jsx("title", { children: done ? 'Copied' : 'Copy' }), done ? (_jsx("path", { d: "M20 6 9 17l-5-5" })) : (_jsxs(_Fragment, { children: [_jsx("rect", { x: "9", y: "9", width: "11", height: "11", rx: "2" }), _jsx("path", { d: "M5 15V5a2 2 0 0 1 2-2h10" })] }))] }));
}
export default function InstallTabs({ pkg }) {
    const [active, setActive] = useState('npm');
    const [copied, setCopied] = useState(false);
    const cmd = (MANAGERS.find((m) => m.id === active) ?? MANAGERS[0]).cmd(pkg);
    async function copy() {
        try {
            await navigator.clipboard.writeText(cmd);
        }
        catch {
            // Clipboard may be unavailable (e.g., insecure context) — ignore.
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1300);
    }
    return (_jsxs("div", { className: styles.wrap, children: [_jsx("div", { className: styles.tabs, role: "tablist", "aria-label": "Package manager", children: MANAGERS.map((m) => (_jsx("button", { type: "button", role: "tab", "aria-selected": active === m.id, className: active === m.id ? styles.tabActive : styles.tab, onClick: () => {
                        setActive(m.id);
                        setCopied(false);
                    }, children: m.id }, m.id))) }), _jsxs("div", { className: styles.cmdRow, children: [_jsx("span", { className: styles.prompt, "aria-hidden": true, children: "$" }), _jsx("code", { className: styles.cmd, children: cmd }), _jsx("button", { type: "button", className: styles.copy, onClick: copy, "aria-label": copied ? 'Copied' : 'Copy install command', "data-copied": copied, children: _jsx(CopyIcon, { done: copied }) })] })] }));
}
