Program
  = _ statements:Statement* _ {
      return { type: "Program", body: statements };
    }

Statement
  = stmt:(VariableDeclaration
        / Assignment
        / PrintStatement
        / IfStatement
        / LoopStatement) _ {
      return stmt;
    }

VariableDeclaration
  = "igo" __ name:Identifier _ "=" _ value:Expression ";" {
      return { type: "VarDecl", name, value };
    }

Assignment
  = name:Identifier __ "=" __ value:Expression ";" {
      return { type: "Assign", name, value };
    }

PrintStatement
  = "chupi" _ "(" _ value:Expression _ ")" ";" {
      return { type: "Print", value };
    }

IfStatement
  = "okavela" __ cond:Comparison __
    "{" _ then:Statement* _ "}"
    __ "lekunte" __
    "{" _ otherwise:Statement* _ "}" {
      return { type: "If", cond, then, otherwise };
    }

LoopStatement
  = "chestoone" __ "undu" __
    "{" _ body:Statement* _ "}"
    _ "(" _ cond:Comparison _ ")" _ "varuku" {
      return { type: "Loop", cond, body };
    }

Comparison
  = left:Expression __ op:("==" / "!=" / "<=" / ">=" / "<" / ">") __ right:Expression {
      return { type: "Compare", op, left, right };
    }
  / expr:Expression {
      return { type: "Truthy", expr };
    }

Expression
  = Additive


Additive
  = left:Multiplicative rest:(_ ("+" / "-") _ Multiplicative)* {
      return rest.reduce((acc, r) => ({
        type: "Binary",
        op: r[1],
        left: acc,
        right: r[3]
      }), left);
    }


Multiplicative
  = left:Postfix rest:(_ ("*" / "/" / "%") _ Postfix)* {
      return rest.reduce((acc, r) => ({
        type: "Binary",
        op: r[1],
        left: acc,
        right: r[3]
      }), left);
    }


Postfix
  = obj:Primary ops:(
        idx:IndexOp
      / prop:PropertyOp
    )* {

      return ops.reduce((acc, op) => {

        if (op.type === "IndexOp") {
          return {
            type: "Index",
            object: acc,
            index: op.index
          };
        }

        if (op.type === "PropertyOp") {
          return {
            type: "Property",
            object: acc,
            property: op.name
          };
        }

      }, obj);
    }


IndexOp
  = "[" _ expr:Expression _ "]" {
      return {
        type: "IndexOp",
        index: expr
      };
    }


PropertyOp
  = "." id:Identifier {
      return {
        type: "PropertyOp",
        name: id.name
      };
    }

Primary
  = Boolean
  / Number
  / String
  / Identifier
  / "(" _ Expression _ ")"

Index
  = obj:Primary rest:("[" _ Expression _ "]")* {
      return rest.reduce((acc, r) => ({
        type: "Index",
        object: acc,
        index: r[2]
      }), obj);
    }


Boolean
  = "nijam" { return { type: "Boolean", value: true }; }
  / "abaddam" { return { type: "Boolean", value: false }; }

Identifier
  = !Keyword $([a-zA-Z_][a-zA-Z0-9_]*) {
      return { type: "Identifier", name: text() };
    }

Keyword
  = "igo"
  / "chupi"
  / "okavela"
  / "lekunte"
  / "chestoone"
  / "undu"
  / "varuku"
  / "nijam"
  / "abaddam"

Number
  = digits:[0-9]+ {
      return { type: "Number", value: Number(digits.join("")) };
    }

String
  = "\"" chars:([^"]*) "\"" {
      return { type: "String", value: chars.join("") };
    }

_  = [ \t\r\n]*
__ = [ \t\r\n]+
