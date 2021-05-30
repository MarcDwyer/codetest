import { Position, X, Coordinate } from "./ships.ts";

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

  return start.y === end.y;
}

export function getShipCoords(pos: Position): Coordinate[] {
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
      coords.push({ y: start.y - 1, x: alphaPos });
      ++alphaPos;
    }
  } else {
    difference += end.y - start.y;
    let yCoord = start.y - 1;
    for (let i = 0; i < difference; i++) {
      coords.push({ x: letterToNum(start.x), y: yCoord });
      ++yCoord;
    }
  }

  return coords;
}
