import { linter } from "@codemirror/lint";
import type { Diagnostic } from "@codemirror/lint";
import type { Tree } from "@lezer/common";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: No type definitions for dsl-parser.js
import { parser } from "../dsl-parser.js";

export const dslLinter = linter(view => {
  const diagnostics: Diagnostic[] = [];
  const tree = parser.parse(view.state.doc.toString()) as Tree;
  
  tree.iterate({
    enter: (node) => {
      if (node.type.isError) {
        diagnostics.push({
          from: node.from,
          to: node.to,
          message: `Erro de sintaxe: ${node.name}`,
          severity: "error"
        });
      }
    }
  });
  
  return diagnostics;
});
