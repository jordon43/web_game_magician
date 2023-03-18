 class PhysicManager {
    constructor(gameManager, mapManager) {
        this.gameManager = gameManager
        this.mapManager = mapManager
    }

    update(obj){
        if (obj.lifetime <= 0)
            obj.kill();
        if(obj.move_x === 0 && obj.move_y === 0)
            return "stop";
        const newX = obj.pos_x + Math.floor(obj.move_x * obj.speed);
        const newY = obj.pos_y + Math.floor(obj.move_y * obj.speed);
        const ts = this.mapManager.getTilesetIdx(newX + obj.size_x / 2, newY + obj.size_y / 2);
        const e = this.entityAtXY(obj, newX, newY);
        if (e !== null && obj.onTouchEntity)
            obj.onTouchEntity(e);
        if (ts !== 225 && ts !== 297 && ts !== 226 && ts !== 350 && ts !== 298 && ts !== 42 && ts !== 111 && ts !== 108 && ts !== 108 && obj.onTouchMap)
            obj.onTouchMap(ts);
        if ((ts === 225 || ts === 297 || ts === 226 || ts === 350 || ts === 298 || ts === 42 || ts === 111 || ts === 108 || ts === 108) && e === null) {
            obj.pos_x = newX;
            obj.pos_y = newY;
        }
    }

    entityAtXY(obj, x, y) {
        for (var i = 0; i < this.gameManager.entities.length; i++) {
            var e = this.gameManager.entities[i];
            if (e.name !== obj.name) {
                if (x + obj.size_x < e.pos_x ||
                    y + obj.size_y < e.pos_y ||
                    x > e.pos_x + e.size_x ||
                    y > e.pos_y + e.size_y){
                    continue;
                }
                return e;
            }
        }
        return null;
    }

}