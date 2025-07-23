import { StreamLanguage } from "@codemirror/language";
import { simpleMode } from "@codemirror/legacy-modes/mode/simple-mode";
import { availableFunctions } from "../constants/available-functions";

export const filterDSL = StreamLanguage.define(
    simpleMode({
        start: [
            { regex: /#[\w]+/, token: "variableName" },
            { regex: />=|<=|<|>|=/, token: "operator" },
            { regex: /\b(AND|OR)\b/i, token: "keyword" },
            { regex: new RegExp(`\\b(${availableFunctions.join("|")})\\b`, "i"), token: "atom" },
            { regex: /\d+/, token: "number" },
            { regex: /\s+/, token: "space" },
        ],
    })
);