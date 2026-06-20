export const bold = (s) => `[1m${s}[0m`;
export const dim = (s) => `[2m${s}[0m`;
export const red = (s) => `[31m${s}[0m`;
export const green = (s) => `[32m${s}[0m`;
export const yellow = (s) => `[33m${s}[0m`;
export const heading = (s) => `[1m[36m${s}[0m`;
export const kitLine = (s) => `[2m[langchain-kit][0m ${s}`;
export const toolLine = (s) => `[2m[tool][0m ${s}`;
export const colorizeJson = (v) => JSON.stringify(v, null, 2);
