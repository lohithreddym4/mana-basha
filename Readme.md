# Telugitha

> **Write code in Telugu.**

Telugitha is an experimental programming language that lets developers write programs using Telugu-inspired syntax while executing as JavaScript. It was created to explore what programming feels like when the language itself speaks Telugu.

## Features

* Telugu-inspired programming syntax
* Compiles to JavaScript
* Browser-based playground powered by Monaco Editor
* Variables, assignments, arithmetic expressions
* Conditional statements (`okavela`, `lekunte`)
* Looping constructs (`chestoone undu ... varuku`)
* User input using `adugu()`
* Console output using `chupi()`
* Boolean literals (`nijam`, `abaddam`)
* Property and array indexing support

---

## Example

```telugitha
igo name = adugu("Mee Peru");

okavela name == "Lohith" {
    chupi("Namaskaram!");
} lekunte {
    chupi("Welcome!");
}
```

---

## Language Overview

### Variables

```telugitha
igo age = 21;
igo name = "Lohith";
igo active = nijam;
```

---

### Printing

```telugitha
chupi("Namaskaram");
chupi(age);
```

---

### Input

```telugitha
igo name = adugu("Mee Peru");
chupi(name);
```

---

### Conditions

```telugitha
okavela marks >= 35 {
    chupi("Pass");
} lekunte {
    chupi("Fail");
}
```

---

### Loops

```telugitha
igo i = 1;

chestoone undu {
    chupi(i);
    i = i + 1;
} (i <= 5) varuku
```

---

### Expressions

```telugitha
igo result = (10 + 5) * 2;
igo even = result % 2 == 0;
```

---

## Grammar

The language currently supports:

* Variable declarations
* Variable assignment
* Arithmetic expressions
* Comparison operators
* Boolean expressions
* Conditional statements
* Loop statements
* User input
* Console output
* Property access
* Array indexing

---

## Motivation

Programming languages today almost universally rely on English keywords. Telugitha explores an alternative approach by allowing developers to express programs using Telugu-inspired syntax while preserving familiar programming concepts.

The project is an experiment in language design, parser construction, compiler implementation, and programming language tooling.

---

## Built With

* JavaScript
* PEG.js
* Monaco Editor

---

## License

MIT
