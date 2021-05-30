import { assertEquals } from "https://deno.land/std@0.97.0/testing/asserts.ts";
import { getShipCoords } from "./battleship_util.ts";
import { Grid, Shot } from "./grid.ts";

export type PositionCoord = {
  y: number;
  x: X;
};
export type Position = {
  start: PositionCoord;
  end: PositionCoord;
};
export type Coordinate = {
  y: number;
  x: number;
};
export type X = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J";

export function getShips() {
  // count  name              size
  //   1    Aircraft Carrier   5
  //   1    Battleship         4
  //   1    Cruiser            3
  //   2    Destroyer          2
  //   2    Submarine          1
  //
  // 		  A B C D E F G H I J
  //		1               @
  //		2 @             @
  //		3         @     @
  //		4               @
  //		5   @ @
  //		6
  //		7           @       @
  //		8           @       @
  //		9                   @
  //	 10       @ @ @ @ @
  //

  const positions: Position[] = [
    {
      start: { y: 2, x: "A" },
      end: { y: 2, x: "A" },
    },
    {
      start: { y: 1, x: "H" },
      end: { y: 4, x: "H" },
    },
    {
      start: { y: 3, x: "E" },
      end: { y: 3, x: "E" },
    },
    {
      start: { y: 5, x: "B" },
      end: { y: 5, x: "C" },
    },
    {
      start: { y: 7, x: "F" },
      end: { y: 8, x: "F" },
    },
    {
      start: { y: 7, x: "I" },
      end: { y: 9, x: "I" },
    },
    {
      // D = 4 H = 8
      start: { y: 10, x: "D" },
      end: { y: 10, x: "H" },
    },
  ];

  const coords: Coordinate[][] = [];

  for (const pos of positions) {
    coords.push(getShipCoords(pos));
  }
  return coords;
}

export enum Errors {
  ErrOutOfGridBoundaries = "outofbounds",
  ErrIncorrectLetter = "incorrectletter",
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
