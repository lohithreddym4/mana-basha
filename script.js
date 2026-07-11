import { parse } from "./rules.js";
import { compile } from "./compiler-core.js";
import formatPeggyError from "./errorFormatter.js";

let editor;

const examples = {
  palindrome: `igo word = "madam";
igo start = 0;
igo end = word.length - 1;
igo palindrome = adugu("Oka padham cheppu");

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
  count: `igo i = 1;

chestoone undu {
  chupi("Telugitha count: " + i);
  i = i + 1;
} (i <= 5) varuku

chupi("Mana basha wins.");`,
  input: `igo name = adugu("Mee peru");
igo language = adugu("Mee basha");

chupi("Namaskaram " + name);
chupi(language + " supremacy starts with code.");`,
};

require.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs",
  },
});

require(["vs/editor/editor.main"], function () {
  monaco.languages.register({ id: "telugitha" });

  monaco.languages.setMonarchTokensProvider("telugitha", {
    tokenizer: {
      root: [
        [/\b(igo|okavela|lekunte|chestoone|undu|varuku|chupi|adugu|nijam|abaddam)\b/, "keyword"],
        [/[0-9]+/, "number"],
        [/".*?"/, "string"],
        [/[a-zA-Z_][a-zA-Z0-9_]*/, "identifier"],
      ],
    },
  });

  monaco.editor.defineTheme("telugitha-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "f5a524", fontStyle: "bold" },
      { token: "number", foreground: "56a7ff" },
      { token: "string", foreground: "36d399" },
      { token: "identifier", foreground: "e5edf7" },
    ],
    colors: {
      "editor.background": "#0b101a",
      "editor.foreground": "#e5edf7",
      "editor.lineHighlightBackground": "#151f2f",
      "editorCursor.foreground": "#f5a524",
      "editorLineNumber.foreground": "#526074",
      "editorLineNumber.activeForeground": "#f5a524",
      "editor.selectionBackground": "#2c4a63",
    },
  });

  editor = monaco.editor.create(document.getElementById("editor"), {
    value: examples.palindrome,
    language: "telugitha",
    theme: "telugitha-dark",
    fontSize: 15,
    lineHeight: 24,
    padding: { top: 18, bottom: 18 },
    minimap: { enabled: false },
    automaticLayout: true,
    fontLigatures: true,
    smoothScrolling: true,
  });

  editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => run());
});

document.querySelectorAll("[data-example]").forEach((button) => {
  button.addEventListener("click", () => {
    const nextExample = examples[button.dataset.example];
    if (!editor || !nextExample) return;

    editor.setValue(nextExample);
    editor.focus();
    setStatus("Loaded");
  });
});

window.run = function () {
  if (!editor) return;

  const output = document.getElementById("output");
  output.classList.remove("error");
  output.textContent = "";
  setStatus("Running");

  const code = editor.getValue();

  try {
    const ast = parse(code);
    const js = compile(ast);

    const logs = [];
    const fakeConsole = { log: (x) => logs.push(String(x)) };
    const inputValues = getRuntimeInputs();
    let inputIndex = 0;
    const input = (label) => {
      const value = inputValues[inputIndex];
      logs.push(`? ${label}`);
      inputIndex += 1;

      if (value === undefined) {
        throw new Error(`Input kavali: ${label}`);
      }

      logs.push(`> ${value}`);
      return value;
    };

    new Function("console", "input", js)(fakeConsole, input);

    output.textContent = logs.join("\n") || "Program executed.";
    setStatus("Success");
  } catch (e) {
    output.classList.add("error");
    setStatus("Error");

    if (e.location) output.textContent = formatPeggyError(e, code);
    else output.textContent = "Runtime Error:\n" + e.message;
  }
};

function setStatus(label) {
  const status = document.getElementById("run-status");
  if (status) status.textContent = label;
}

function getRuntimeInputs() {
  const source = document.getElementById("runtime-input")?.value ?? "";
  return source === "" ? [] : source.split(/\r?\n/);
}
