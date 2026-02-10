import { parse } from "./rules.js";
import { compile } from "./compiler-core.js";
import formatPeggyError from "./errorFormatter.js";

let editor;

// Monaco loader
require.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs",
  },
});

require(["vs/editor/editor.main"], function () {

  // --- Register Telugitha language ---
  monaco.languages.register({ id: "telugitha" });

  monaco.languages.setMonarchTokensProvider("telugitha", {
    tokenizer: {
      root: [
        [/\b(igo|okavela|lekunte|chestoone|undu|varuku|chupi|nijam|abaddam)\b/, "keyword"],
        [/[0-9]+/, "number"],
        [/".*?"/, "string"],
        [/[a-zA-Z_][a-zA-Z0-9_]*/, "identifier"],
      ],
    },
  });

  // --- Theme ---
  monaco.editor.defineTheme("telugitha-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "22c55e" },
      { token: "number", foreground: "60a5fa" },
      { token: "string", foreground: "fbbf24" },
    ],
    colors: {
      "editor.background": "#020617",
    },
  });

  // --- Create editor ---
  editor = monaco.editor.create(document.getElementById("editor"), {
    value: `igo x = 5;
igo alive = nijam;

okavela alive {
  chupi("Still breathing");
} lekunte {
  chupi("Ghost mode");
}

chestoone undu {
  chupi(x);
  x = x + 1;
} (x < 8) varuku`,
    language: "telugitha",
    theme: "telugitha-dark",
    fontSize: 15,
    minimap: { enabled: false },
    automaticLayout: true,
  });

});

document.addEventListener("keydown", (e) => {
  if (e.shiftKey && e.key === "Enter") {
    run();
  }
});

window.run = function () {
  const output = document.getElementById("output");
  output.classList.remove("error");
  output.textContent = "";

  const code = editor.getValue();

  try {
    const ast = parse(code);
    const js = compile(ast);

    const logs = [];
    const fakeConsole = { log: (x) => logs.push(x) };

    new Function("console", js)(fakeConsole);

    output.textContent = logs.join("\n") || "✅ Program executed.";
  } catch (e) {
    output.classList.add("error");

    if (e.location) output.textContent = formatPeggyError(e, code);
    else output.textContent = "Runtime Error:\n" + e.message;
  }
};
