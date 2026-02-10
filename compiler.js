import fs from "fs";
import * as parser from "./rules.js";
import { compile } from "./compiler-core.js";
import formatPeggyError from "./errorFormatter.js";

let ast;
const source = fs
  .readFileSync("./playground.txt", "utf8")
  .replace(/\r\n/g, "\n");
try {
  ast = parser.parse(source);
} catch (e) {
  console.error(formatPeggyError(e, source));
  process.exit(1);
}




const jsCode = `"use strict";\n\n${compile(ast)}\n`;
fs.writeFileSync("./out.js", jsCode);

console.log("✅ Compilation successful → out.js");
