import { Errors } from "./battleship_test.ts";
import { getShipCoords } from "./battleship_util.ts";

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
export interface ShipCoord extends Coordinate {
  hit: boolean;
}
export type X = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J";

function toShipCoords(coords: Coordinate[]): ShipCoord[] {
  return coords.map((coord) => {
    return {
      ...coord,
      hit: false,
    };
  });
}
export class Ship {
  private hits: number = 0;
  private shipCoords: ShipCoord[];
  constructor(coords: Coordinate[]) {
    this.shipCoords = toShipCoords(coords);
  }
  /**
   *
   * @returns Whether the ship has sunk or not
   */
  hit(x: number, y: number) {
    const coord = this.searchCoord(x, y);
    if (!coord) throw Errors.ErrNoCoord;
    if (coord.hit) throw Errors.ErrAlreadyHit;
    coord.hit = true;
    ++this.hits;
    return this.hits === this.shipCoords.length;
  }

  private searchCoord(x: number, y: number) {
    for (const coord of this.shipCoords) {
      if (coord.x === x && coord.y === y) {
        return coord;
      }
    }
    return null;
  }
}
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
