import {
  assertEquals,
  assertObjectMatch,
} from "https://deno.land/std@0.97.0/testing/asserts.ts";
import { getShipCoords } from "./battleship_util.ts";

export type Position = {
  start: Coordinate;
  end: Coordinate;
};
export type Coordinate = {
  y: number;
  x: X;
};
export interface ShipCoords extends Coordinate {
  hit: boolean;
}
export type X = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J";

export type Shot = {
  num: number;
  letter: X;
  expectedHit: boolean;
};

export type ShootResult = {
  hit: boolean;
  sunk: boolean;
};
const alphas = "abcdefghij".toUpperCase();

class Grid {
  constructor(private ships: Ship[]) {}

  shoot(shotNum: number, shotLetter: X): ShootResult {
    const result = {
      hit: false,
      sunk: false,
    };

    for (const ship of this.ships) {
      const coords = ship.coords;
      const first = coords[0];
      if (shotNum !== first.y && shotLetter !== first.x) {
        continue;
      }
      coords.forEach(({ x, y }, index) => {
        if (x === shotLetter && y === shotNum) {
          // We've hit something
          result.sunk = ship.hit(index);
          result.hit = true;
        }
      });
    }
    return result;
  }
}
class Ship {
  hits: number = 0;

  coords: ShipCoords[];
  constructor(private pos: Position) {
    this.coords = getShipCoords(pos);
  }

  get isSunk(): boolean {
    return this.hits === this.coords.length;
  }
  hit(index: number) {
    //TODO Check if ship has already been sunk here
    this.coords[index].hit = true;
    ++this.hits;
    return this.isSunk;
  }
}
function getShips() {
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

  const ships: Ship[] = [];

  for (const pos of positions) {
    ships.push(new Ship(pos));
  }
  return ships;
}

enum Errors {
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
      { num: 8, letter: "I", expectedHit: false },
      //@ts-ignore
      { num: 10, letter: "CC", expectedHit: false },
      { num: 10, letter: "G", expectedHit: true },
    ],
    expectedSunk: false,
    err: Errors.ErrIncorrectLetter,
  },
];

testCases.forEach((test, pi) => {
  Deno.test(`Failure ${pi}`, () => {
    const ships = getShips();
    const grid = new Grid(ships);

    let isSunk = false;
    test.shots.forEach((shot, si) => {
      const res = grid.shoot(shot.num, shot.letter);
      assertEquals(
        shot.expectedHit,
        res.hit,
        `Error on ${pi} shot: ${si}. Result: ${JSON.stringify(res)}`
      );
      if (res.sunk) {
        isSunk = res.sunk;
        return;
      }
    });

    assertEquals(test.expectedSunk, isSunk);
  });
});
const ships = getShips();

const ship = ships[0];

const grid = new Grid(ships);
// {
//   start: { y: 2, x: "A" },
//   end: { y: 2, x: "A" },
// },
// {
//   // D = 4 H = 8
//   start: { y: 10, x: "D" },
//   end: { y: 10, x: "H" },
// },
console.log(grid.shoot(10, "D"));
console.log(grid.shoot(10, "E"));
console.log(grid.shoot(10, "F"));
console.log(grid.shoot(10, "G"));
console.log(grid.shoot(10, "H"));
// Sunk ship
export {};
