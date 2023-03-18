class Entity {
    constructor(spriteManager, physicManager, gameManager, soundManager) {
        this.spriteManager = spriteManager
        this.physicManager = physicManager
        this.gameManager = gameManager
        this.soundManager = soundManager
        this.pos_x = 0
        this.pos_y = 0 // позиция обьекта
        this.size_x = 0
        this.size_y = 0 // размеры объекта
    }

}

class Player extends Entity{
    constructor(spriteManager, physicManager, gameManager, soundManager) {
        super();
        this.soundManager = soundManager
        this.spriteManager = spriteManager
        this.physicManager = physicManager
        this.gameManager = gameManager
        this.lifetime = 100
        this.mana = 100
        this.score = 0
        this.move_x = 0
        this.move_y = 0
        this.speed = 2
    }

    draw(ctx){
        if(this.move_x === -1){
            this.spriteManager.drawSprite(ctx, "player_left", this.pos_x, this.pos_y);
        }
        else {
            this.spriteManager.drawSprite(ctx, "player_right", this.pos_x, this.pos_y);
        }

    }

    update(){
        //console.log("UPDATE", this)
        this.physicManager.update(this);
    }
    onTouchEntity (obj){
        if (obj.name.match("hp")){
            if(this.lifetime > 50){
                this.lifetime = 100;
                obj.kill();
            }
            else{
                this.lifetime += 50;
                obj.kill();
            }
        }
        if (obj.name.match("mana")){
            if(this.mana > 50){
                this.mana = 100;
                obj.kill();
            }
            else{
                this.mana += 50;
                obj.kill();
            }

        }
        if (obj.name.match("money")){
            this.score += 10;
            obj.kill();
        }

        if (obj.name.match("trap")){
            obj.kill();
            this.gameManager.level++;
        }

    }

    kill(){
        this.gameManager.laterKill.push(this);
        this.gameManager.player = null;
    }

    fire() {
        if (this.mana > 0){
            this.soundManager.play("cat.mp3", {volume: 1})
            this.mana -= 2;
            const r = new Rocket(this.spriteManager, this.physicManager, this.gameManager);
            r.size_x = 20;
            r.size_y = 15;
            r.name = "rocket" + (++this.gameManager.fireNum);
            if (this.move_x === 0 && this.move_y === 0){
                r.move_x = 1;
            }
            else {
                r.move_x = this.move_x;
                r.move_y = this.move_y;
            }

            switch (r.move_x + 2 * r.move_y) {
                case -1: // выстрел влево
                    r.pos_x = this.pos_x - r.size_x + 22;
                    r.pos_y = this.pos_y;
                    break;
                case 1: // выстрел вправо
                    r.pos_x = this.pos_x + this.size_x - 20;
                    r.pos_y = this.pos_y;
                    break;
                case -2: // выстрел вверх
                    r.pos_x = this.pos_x + 17;
                    r.pos_y = this.pos_y - r.size_y + 22;
                    break;
                case 2: // выстрел вниз
                    r.pos_x = this.pos_x;
                    r.pos_y=this.pos_y + this.size_y -20;
                    break;
                default: return;
            }
            this.gameManager.entities.push(r);
        }
    }

}

class Enemy extends Entity {
    constructor(spriteManager, physicManager, gameManager, player, soundManager) {
        super();
        this.spriteManager = spriteManager
        this.physicManager = physicManager
        this.gameManager = gameManager
        this.soundManager = soundManager
        this.lifetime = 5
        this.move_x = 0
        this.move_y = 0
        this.speed = 1
        this.Player = player
    }

    draw(ctx){
        if(this.move_x === -1){
            this.spriteManager.drawSprite(ctx, "deamon_left", this.pos_x, this.pos_y);
        }
        else{
            this.spriteManager.drawSprite(ctx, "deamon_right", this.pos_x, this.pos_y);
        }
    }

    update(){
        let Player = this.Player
        if (Math.abs(this.pos_x - Player.pos_x) <  350 && Math.abs(this.pos_y - Player.pos_y) < 350){
            if(this.pos_x >= Player.pos_x){
                this.move_x = -1;
            }
            if(this.pos_y >= Player.pos_y){
                this.move_y = -1;
            }
            if(this.pos_x <= Player.pos_x){
                this.move_x = 1;
            }
            if(this.pos_y <= Player.pos_y){
                this.move_y = 1;
            }
        }
        this.physicManager.update(this);
    }

    onTouchEntity(obj){
        obj.lifetime -= 1;
    }

    kill(){
        this.soundManager.play("deamon.mp3", {volume: 1})
        this.Player.score += 10;
        this.gameManager.laterKill.push(this);
    }

}

class Rocket extends Entity {
    constructor(spriteManager, physicManager, gameManager) {
        super();
        this.spriteManager = spriteManager
        this.physicManager = physicManager
        this.gameManager = gameManager
        this.move_y = 0
        this.speed = 25
    }

    draw(ctx){
        if(this.move_x === -1){
            this.spriteManager.drawSprite(ctx, "cat_left", this.pos_x, this.pos_y);
        }
        else if (this.move_x === 1){
            this.spriteManager.drawSprite(ctx, "cat_right", this.pos_x, this.pos_y);
        }
        else if (this.move_y === 1){
            this.spriteManager.drawSprite(ctx, "cat_down", this.pos_x, this.pos_y);
        }
        else if (this.move_y === -1){
            this.spriteManager.drawSprite(ctx, "cat_up", this.pos_x, this.pos_y);
        }
    }
    update(){
        this.physicManager.update(this);
    }
    onTouchEntity(obj){
        if(obj.name.match("tank") || obj.name.match(/rocket[\d*]/)){
            obj.lifetime -= 10;
        }
        this.kill();
    }
    onTouchMap(obj){
        this.kill();
    }
    kill(){
        this.gameManager.laterKill.push(this);
    }
}

class HP extends Entity {
    draw (ctx) {
        this.spriteManager.drawSprite(ctx, "hp", this.pos_x, this.pos_y);
    }
    kill() {
        this.soundManager.play("drink.mp3", {volume: 2})
        this.gameManager.laterKill.push(this);
    }
}

class Mana extends Entity {
    draw(ctx) {
        this.spriteManager.drawSprite(ctx, "mana", this.pos_x, this.pos_y);
    }
    kill() {
        this.soundManager.play("drink.mp3", {volume: 2})
        this.gameManager.laterKill.push(this);
    }
}


class Money extends Entity {
    draw(ctx) {
        this.spriteManager.drawSprite(ctx, "money", this.pos_x, this.pos_y);
    }
    kill() {
        this.soundManager.play("money.mp3", {volume: 1})
        this.gameManager.laterKill.push(this);
    }
}


class Portal extends Entity {
    draw(ctx) {
        this.spriteManager.drawSprite(ctx, "trap", this.pos_x, this.pos_y);
    }
    kill() {
        this.gameManager.laterKill.push(this);
    }
}

