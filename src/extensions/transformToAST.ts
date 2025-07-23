// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: No type definitions for dsl-parser.js
import { parser } from '../dsl-parser.js';
import type { EditorState } from '@codemirror/state';
import { availableFunctions } from '../constants/available-functions';
import { TreeCursor } from '@lezer/common';

export function transformToAST(state: EditorState) {
  const code = state.sliceDoc(0);
  const tree = parser.parse(code);

  function walk(cursor: TreeCursor): unknown {
    switch (cursor.name) {
      case "Number":
        return { type: "number", value: Number(code.slice(cursor.from, cursor.to)) };
      case "String":
        return { type: "string", value: code.slice(cursor.from + 1, cursor.to - 1) };
      case "Field":
        return { type: "field", value: code.slice(cursor.from, cursor.to) };
      case "FunctionCall": {
        let functionName = "";
        const params: unknown[] = [];
        if (cursor.firstChild()) {
          functionName = cursor.name;
          do {
            if (cursor.name.endsWith("Function")) {
              if (cursor.firstChild()) {
                do {
                  if ((cursor.name as string) === "String" || (cursor.name as string) === "Number" || (cursor.name as string) === "Field") {
                    params.push(walk(cursor));
                  }
                } while (cursor.nextSibling());
                cursor.parent();
              }
            }
          } while (cursor.nextSibling());
          cursor.parent();
        }
        const name = functionName.replace(/Function$/, "").replace(/^./, c => c.toLowerCase());
        if (availableFunctions.includes(name)) {
          return { type: "function", name, param: params };
        }
        return null;
      }
      case "MathExpr": {
        let node = null;
        if (cursor.firstChild()) {
          node = walk(cursor);
          while (cursor.nextSibling()) {
            if ((cursor.name as string) === "MathOperators") {
              const operator = code.slice(cursor.from, cursor.to);
              if (cursor.nextSibling()) {
                const right = walk(cursor);
                node = { type: "BinaryExpression", operator, left: node, right };
              }
            }
          }
          cursor.parent();
        }
        return node;
      }
      default:
        if (cursor.firstChild()) {
          const result = walk(cursor);
          cursor.parent();
          return result;
        }
        return null;
    }
  }

  const cursor = tree.cursor() as TreeCursor;
  const asts: unknown[] = [];
  if (cursor.firstChild()) {
    do {
      const ast = walk(cursor);
      if (ast) asts.push(ast);
    } while (cursor.nextSibling());
  }

  return asts;
}
