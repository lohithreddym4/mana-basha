
export function compile(ast) {

    const declared = new Set();

    function compileExpr(node) {
        switch (node.type) {
            case "Number": return node.value;
            case "String": return JSON.stringify(node.value);
            case "Boolean": return node.value;
            case "Identifier": return node.name;
            case "Binary":
                return `(${compileExpr(node.left)} ${node.op} ${compileExpr(node.right)})`;
        }
    }

    function compileCompare(node) {
        if (node.type === "Truthy")
            return compileExpr(node.expr);

        return `${compileExpr(node.left)} ${node.op} ${compileExpr(node.right)}`;
    }

    function compileStatement(node) {
        switch (node.type) {

            case "VarDecl":
                declared.add(node.name.name);
                return `let ${node.name.name} = ${compileExpr(node.value)};`;

            case "Assign":
                if (!declared.has(node.name.name))
                    throw new Error(
                        `Runtime Error: '${node.name.name}' variable declare cheyyaledu.`
                    );
                return `${node.name.name} = ${compileExpr(node.value)};`;

            case "Print":
                return `console.log(${compileExpr(node.value)});`;

            case "If":
                return `
  if (${compileCompare(node.cond)}) {
  ${node.then.map(compileStatement).join("\n")}
  } else {
  ${node.otherwise.map(compileStatement).join("\n")}
  }`.trim();

            case "Loop":
                return `
  while (${compileCompare(node.cond)}) {
  ${node.body.map(compileStatement).join("\n")}
  }`.trim();
        }
    }

    return ast.body.map(compileStatement).join("\n");
}
