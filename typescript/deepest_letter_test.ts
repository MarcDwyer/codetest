import { assertEquals } from "https://deno.land/std@0.97.0/testing/asserts.ts";

function isLetter(c: string): boolean {
  return c.toLowerCase() != c.toUpperCase();
}
function deepestLetter(str: string) {
  let count = 0;
  const mem = new Map<string, number>();

  for (let i = 0; i < str.length; i++) {
    const curr = str[i];

    switch (curr) {
      case "(":
        ++count;
        break;
      case ")":
        --count;
        break;
      default:
        if (isLetter(curr)) {
          mem.set(curr, count);
        }
    }
  }

  let result = "?";
  let lastcount = 0;

  for (const [k, v] of mem.entries()) {
    if (v > lastcount) {
      result = k.toLowerCase();
      lastcount = v;
    }
  }
  return result;
}
const testCases = [
  { input: "a(b)c", expected: "b" },
  { input: "((a))(((M)))(c)(D)(e)(((f))(((G))))h(i)", expected: "g" },
  // c is epected however it is not properly closed by a paranthesis
  // this confuses me a little
  { input: "((A)(b)((c)))", expected: "c" },
  { input: "(a)((G)c)", expected: "g" },
  { input: "(z()a(b)((c))e(((f))))", expected: "f" },
  { input: "(8)", expected: "?" },
  { input: "(!)", expected: "?" },
];

testCases.forEach((test, pi) => {
  Deno.test(`Test: ${pi}`, () => {
    const res = deepestLetter(test.input);
    assertEquals(test.expected, res);
  });
});
export {};
