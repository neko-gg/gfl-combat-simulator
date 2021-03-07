export enum EchelonGridPosition {
    TOP_LEFT,
    TOP_CENTER,
    TOP_RIGHT,

    MIDDLE_LEFT,
    MIDDLE_CENTER,
    MIDDLE_RIGHT,

    BOTTOM_LEFT,
    BOTTOM_CENTER,
    BOTTOM_RIGHT
}

export function getStandNumber(echelonGridPosition: EchelonGridPosition): number {
    switch (echelonGridPosition) {
        case EchelonGridPosition.TOP_LEFT:
            return 9;
        case EchelonGridPosition.TOP_CENTER:
            return 14;
        case EchelonGridPosition.TOP_RIGHT:
            return 19;
        case EchelonGridPosition.MIDDLE_LEFT:
            return 8;
        case EchelonGridPosition.MIDDLE_CENTER:
            return 13;
        case EchelonGridPosition.MIDDLE_RIGHT:
            return 18;
        case EchelonGridPosition.BOTTOM_LEFT:
            return 7;
        case EchelonGridPosition.BOTTOM_CENTER:
            return 12;
        case EchelonGridPosition.BOTTOM_RIGHT:
            return 17;
    }
}
