import { BadInput } from "../errors/custom-errors.js";

export const Category = Object.freeze({
    PROJECTS: Symbol("projects"),
    FINANCE: Symbol("finance"),

    valueOf(value) {
        const entry = Object.entries(Category).
            find(([key, val]) => typeof val === "symbol" && val.description === value);
        if (!entry) throw new BadInput(`Invalid category: ${value}`);
        return entry[1];
    },

    fromSymbol(symbol) {
        const entry = Object.entries(Category).find(([key, val]) => val === symbol);
        return entry ? entry[0].toLowerCase() : null;
    }
})