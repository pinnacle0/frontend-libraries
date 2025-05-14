import {Direction} from "../../hooks/useSwipe";

function getDirection(start: [number, number], end: [number, number]): Direction {
    const vector = [end[0] - start[0], start[1] - end[1]];
    let degree = (Math.atan2(vector[1], vector[0]) * 180) / Math.PI;
    degree = degree < 0 ? degree + 360 : degree;

    if ((degree >= 315 && degree < 360) || (degree >= 0 && degree < 45)) {
        return Direction.RIGHT;
    } else if (degree >= 45 && degree < 135) {
        return Direction.UP;
    } else if (degree >= 135 && degree < 225) {
        return Direction.LEFT;
    } else {
        return Direction.DOWN;
    }
}

function getDisplacement(start: [number, number], end: [number, number]): number {
    return Math.sqrt(Math.pow(start[0] - end[0], 2) + Math.pow(start[1] - end[1], 2));
}

const isHorizontal = (direction: Direction) => [Direction.RIGHT, Direction.LEFT].includes(direction);
const isVertical = (direction: Direction) => [Direction.UP, Direction.DOWN].includes(direction);

export const SwipeUtil = Object.freeze({
    isHorizontal,
    isVertical,
    getDirection,
    getDisplacement,
});
