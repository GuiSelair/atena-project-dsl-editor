import { CompletionContext, autocompletion } from "@codemirror/autocomplete";
import { availableFields } from "../constants/available-fields";
import { availableFunctions } from "../constants/available-functions";
import { availableOperators } from "../constants/available-operators";

function dslCompletions(ctx: CompletionContext) {
  const word = ctx.matchBefore(/[#\w(]+/);
  if (!word || (word.from == word.to && !ctx.explicit)) return null;
  const list = [
    ...availableFields.map(l => ({ label: l, type: "variable" })),
    ...availableOperators.map(o => ({ label: o, type: "operator" })),
    ...availableFunctions.map(f => ({ label: f, type: "atom" })),
  ];

  return {
    from: word.from,
    options: list,
    validFor: /^[\w#(]*$/,
  };
}

export const dslAutocompletion = autocompletion({
  override: [dslCompletions],
  icons: true,
  activateOnTyping: true,
});