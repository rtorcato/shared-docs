import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { CopyIcon } from './InstallTabs.js';
import styles from './CommandBlock.module.css';
function CommandRow({ cmd }) {
    const [copied, setCopied] = useState(false);
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
    return (_jsxs("div", { className: styles.row, children: [_jsx("code", { className: styles.cmd, children: cmd }), _jsx("button", { type: "button", className: styles.copy, onClick: copy, "aria-label": copied ? 'Copied' : `Copy command: ${cmd}`, "data-copied": copied, children: _jsx(CopyIcon, { done: copied }) })] }));
}
export default function CommandBlock({ commands }) {
    return (_jsx("div", { className: styles.wrap, children: commands.map((cmd) => (_jsx(CommandRow, { cmd: cmd }, cmd))) }));
}
