import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from '@lezer/highlight';

const dslHighlight = HighlightStyle.define([
  { tag: t.variableName, class: "field" },
  { tag: t.operator, color: "#e91e63" },
  { tag: t.keyword, color: "#43a047", fontStyle: "italic" },
  { tag: t.number, color: "#f57f17" },
  { tag: t.atom, color: "#6a1b9a" },
]);

export const dslSyntaxHighlight = syntaxHighlighting(dslHighlight)
