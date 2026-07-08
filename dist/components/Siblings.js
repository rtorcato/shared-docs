import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from '@docusaurus/Link';
import { siblings } from '../index.js';
import styles from './Siblings.module.css';
/** The "Sibling projects" section: cross-links to the rest of the @rtorcato family. */
export default function Siblings({ self }) {
    return (_jsxs("section", { className: styles.section, children: [_jsx("div", { className: styles.sectionHead, children: _jsxs("div", { children: [_jsx("h2", { className: styles.h2, children: "Sibling projects" }), _jsxs("p", { className: styles.sub, children: ["More from ", _jsx("code", { children: "@rtorcato" }), " \u2014 same conventions, same release pipeline."] })] }) }), _jsx("div", { className: styles.siblingGrid, children: siblings(self).map((s) => (_jsxs(Link, { href: s.href, className: styles.card, children: [_jsxs("div", { className: styles.cardHead, children: [_jsx("div", { className: styles.cardName, style: { color: s.accent }, children: s.name }), _jsxs("div", { className: styles.cardCount, children: [s.dest, " \u2197"] })] }), _jsx("p", { className: styles.cardDesc, children: s.tagline })] }, s.name))) })] }));
}
