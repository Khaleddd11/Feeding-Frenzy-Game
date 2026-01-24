export const CONFIG = {
    CANVAS_WIDTH: 1200,
    CANVAS_HEIGHT: 700,

    PLAYER: {
        START_WIDTH: 55,
        START_HEIGHT: 45,
        ACCELERATION: 0.1,
        GROWTH_WIDTH: 2,
        GROWTH_HEIGHT: 1.5,
        EAT_POINTS: 10 
    },

    DIRECTION: { RIGHT: 1, LEFT: -1 },

    SIZE: { TINY: 0, SMALL: 1, MEDIUM: 2, LARGE: 3 },

    THRESHOLD: { 
        SMALL: 100, 
        MEDIUM: 250, 
        LARGE: 450, 
        WIN: 650 
    },
      sizeMap : [
                { width: 55, height: 45 },
                { width: 110, height: 70 },
                { width: 155, height: 100 },
                { width: 200, height: 130 }
            ]
};