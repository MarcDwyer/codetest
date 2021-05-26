import { Position, X, Coordinate, ShipCoords } from "./battleship_test.ts";

const alphas = "abcdefghij".toUpperCase();

export function letterToNum(letter: string): number {
  let num = -1;
  alphas.split("").forEach((alpha, i) => {
    if (alpha === letter) {
      num = i;
      return;
    }
  });
  return num;
}

export function numToLetter(num: number): X {
  return alphas[num] as X;
}
export function isHorizontal(pos: Position): boolean {
  // If y same its horizontal else its vertical
  const { start, end } = pos;

  if (start.y === end.y) {
    return true;
  }
  return false;
}

export function getShipCoords(pos: Position): ShipCoords[] {
  const coords: Coordinate[] = [];
  const { start, end } = pos;
  const isHoriz = isHorizontal(pos);

  let difference = 1;

  if (isHoriz) {
    const endX = letterToNum(end.x);
    const startX = letterToNum(start.x);
    difference += endX - startX;

    let alphaPos = startX;

    for (let x = 0; x < difference; x++) {
      const letter = numToLetter(alphaPos);
      coords.push({ y: start.y, x: letter });
      ++alphaPos;
    }
  } else {
    difference += end.y - start.y;
    let yCoord = start.y;
    for (let i = 0; i < difference; i++) {
      coords.push({ x: start.x, y: yCoord });
      ++yCoord;
    }
  }
  const shipCoords: ShipCoords[] = coords.map((coord) => {
    return { ...coord, hit: false };
  });
  return shipCoords;
}
