import { parse } from "./rules.js";
import { compile } from "./compiler-core.js";
import formatPeggyError from "./errorFormatter.js";

let editor;

// Monaco loader (AMD)
require.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs",
  },
});

require(["vs/editor/editor.main"], function () {

  // Register language
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

  // Theme
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

  // Create editor
  editor = monaco.editor.create(document.getElementById("editor"), {
    value: `igo word = "madam";
igo start = 0;
igo end = word.length - 1;
igo palindrome = nijam;

chestoone undu {

  okavela word[start] != word[end] {
    palindrome = abaddam;
    start = end;
  } lekunte {
    start = start + 1;
    end = end - 1;
  }

} (start < end) varuku

okavela palindrome {
  chupi("Palindrome ra baabu");
} lekunte {
  chupi("Palindrome kaadu");
}`,
    language: "telugitha",
    theme: "telugitha-dark",
    fontSize: 15,
    minimap: { enabled: false },
    automaticLayout: true,
  });

  // ✅ Monaco-native keybinding: Shift + Enter → Run
  editor.addCommand(
    monaco.KeyMod.Shift | monaco.KeyCode.Enter,
    () => run()
  );
});

window.run = function () {
  if (!editor) return; // safety

  const output = document.getElementById("output");
  output.classList.remove("error");
  output.textContent = "";

  const code = editor.getValue();

  try {
    const ast = parse(code);
    const js = compile(ast);

    const logs = [];
    const fakeConsole = { log: (x) => logs.push(String(x)) };

    new Function("console", js)(fakeConsole);

    output.textContent = logs.join("\n") || "✅ Program executed.";
  } catch (e) {
    output.classList.add("error");

    if (e.location)
      output.textContent = formatPeggyError(e, code);
    else
      output.textContent = "Runtime Error:\n" + e.message;
  }
};
