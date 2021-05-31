import { assertEquals } from "https://deno.land/std@0.97.0/testing/asserts.ts";
import { Grid, Shot } from "./grid.ts";
import { getShips } from "./ships.ts";

export enum Errors {
  ErrOutOfGridBoundaries = "outofbounds",
  ErrIncorrectLetter = "incorrectletter",
  ErrNoCoord = "no coordinate found",
  ErrAlreadyHit = "already hit coordinate",
}

type TestCase = {
  shots: Shot[];
  expectedSunk: boolean;
  err?: string;
};

const testCases: TestCase[] = [
  {
    shots: [
      { num: 1, letter: "G", expectedHit: false },
      { num: 1, letter: "H", expectedHit: true },
      { num: 1, letter: "I", expectedHit: false },
    ],
    expectedSunk: false,
  },
  {
    shots: [
      { num: 1, letter: "H", expectedHit: true },
      { num: 2, letter: "H", expectedHit: true },
      { num: 3, letter: "H", expectedHit: true },
      { num: 4, letter: "H", expectedHit: true },
    ],
    expectedSunk: true,
  },
  {
    shots: [
      { num: 1, letter: "D", expectedHit: false },
      { num: 7, letter: "F", expectedHit: true },
      { num: 8, letter: "F", expectedHit: true },
    ],
    expectedSunk: true,
  },
  {
    shots: [
      { num: 1, letter: "G", expectedHit: false },
      { num: 1, letter: "H", expectedHit: true },
      { num: 11, letter: "G", expectedHit: false },
    ],
    expectedSunk: false,
    err: Errors.ErrOutOfGridBoundaries,
  },
  {
    shots: [
      { num: 1, letter: "H", expectedHit: true },
      // This test case had expectedHit set to false
      // However there is a ship there that starts at I7 - I9
      // So it should be set to true
      { num: 8, letter: "I", expectedHit: true },
      // TypeScript checks if letters are within range
      //@ts-ignore
      { num: 10, letter: "CC", expectedHit: false },
      { num: 10, letter: "G", expectedHit: true },
    ],
    expectedSunk: false,
    err: Errors.ErrIncorrectLetter,
  },
];

testCases.forEach((test, pi) => {
  const ships = getShips();

  const grid = new Grid(ships);

  Deno.test(`Test ${pi}`, () => {
    test.shots.forEach((shot, si) => {
      try {
        const testShot = grid.shoot(shot.num, shot.letter);
        assertEquals(shot.expectedHit, testShot.hit);
        if (testShot.sunk) {
          assertEquals(test.expectedSunk, testShot.sunk);
          return;
        }
      } catch (e) {
        if (test.err) {
          assertEquals(test.err, e, `Improper error ${si}: ${e}`);
        }
      }
    });
  });
});
