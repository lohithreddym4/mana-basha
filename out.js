"use strict";

let x = 5;
let alive = false;
if (alive) {
  console.log("Still breathing");
} else {
  console.log("Ghost mode");
}
while (x < 8) {
  console.log(x);
  x = (x + 1);
}
