import { Errors } from "./battleship_test.ts";
import { letterToNum } from "./battleship_util.ts";
import { Coordinate, X, Ship } from "./ships.ts";

export type Shot = {
  num: number;
  letter: X;
  expectedHit: boolean;
};

export type ShootResult = {
  hit: boolean;
  sunk: boolean;
};
type BoardPos = Ship | number;
export type Board = BoardPos[][];

export class Grid {
  /**
   *
   * @param board 0 is ocean, 1 is ship and 2 is an already hit ship
   */
  private board: Board;
  constructor(coords: Coordinate[][]) {
    this.board = getBoard(coords);
  }

  shoot(shotNum: number, shotLetter: X): ShootResult {
    const y = shotNum - 1;
    const x = letterToNum(shotLetter);

    if (x === -1 || x > 9) throw Errors.ErrIncorrectLetter;

    const yAxis = this.board[y];
    if (!yAxis) throw Errors.ErrOutOfGridBoundaries;

    const xAxis = yAxis[x];

    if (!xAxis) throw Errors.ErrOutOfGridBoundaries;
    if (xAxis instanceof Ship) {
      const isSunk = xAxis.hit(x, y);
      return { hit: true, sunk: isSunk };
    } else {
      return { hit: false, sunk: false };
    }
  }
}

function getBoard(coords: Coordinate[][]) {
  // Board is 10 by 10
  const board: Board = [];

  for (let i = 0; i < 10; i++) {
    const row = [];
    for (let x = 0; x < 10; x++) {
      row.push(0);
    }
    board.push(row);
  }

  for (const coord of coords) {
    const ship = new Ship(coord);
    for (const { x, y } of coord) {
      board[y][x] = ship;
    }
  }

  return board;
}

// shots: [
//     { num: 1, letter: "G", expectedHit: false },
//     { num: 1, letter: "H", expectedHit: true },
//     { num: 11, letter: "G", expectedHit: false },
//   ],
//@ts-ignore
// console.log(grid.shoot(1, "GG"));
