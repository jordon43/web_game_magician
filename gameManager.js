function compareNumbers(a, b) {
    return  map.get(b) - map.get(a);
}

class GameManager {
    constructor(ctx, canvas) {

        this.mapManager = new MapManager();
        this.spriteManager = new SpriteManager(this.mapManager);
        this.eventsManager = new EventsManager();
        this.physicManager = new PhysicManager(this, this.mapManager);
        this.soundManager = new SoundManager();
        this.soundManager.init()
        this.soundManager.loadArray(["cat.mp3", "deamon.mp3", "money.mp3", "drink.mp3"])

        this.entities = []
        this.fireNum = 0
        this.player = null
        this.laterKill = []
        this.ctx = ctx
        this.gameOver = false
        this.score = 0
        this.level = 0
        this.canvas = canvas
    }

    initPlayer(obj) {
        this.player = obj;
    }щл
    kill(obj) {
        this.laterKill.push(obj);
    }

    showGameOver() {

        this.gameOver = true;

        if(map.get(name_player) < this.score || map.get(name_player) === undefined){
            map.set(name_player,this.score);
        }

        if (arr_name.indexOf(name_player) === -1){
            arr_name.push(name_player);
        }
        arr_name.sort(compareNumbers);

        let serialObj1 = JSON.stringify(arr_name);
        localStorage.setItem("arr_name", serialObj1);
        let serialObj = JSON.stringify(Array.from(map.entries()));
        localStorage.setItem("rating", serialObj);
        this.ctx.fillStyle = 'black';
        this.ctx.globalAlpha = 0.75;
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText("RATING", canvas.width / 2, 20);
        let rating_text = '';
        let i = 1;

        for (let key of arr_name) {
            if (i < 11){
                rating_text = i.toString() + ": " + key.toString() + " ==> " + map.get(key).toString() + '\n';
                this.ctx.fillText(rating_text, canvas.width / 2, 20*i+50);
                i++;
            }
        }
    }


    new_level(){
        this.mapManager = null;
        this.spriteManager = null;
        this.eventsManager = null;
        this.physicManager = null;
        this.soundManager = null;
        this.canvas = null
        this.ctx = null

        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");

        this.mapManager = new MapManager();
        this.spriteManager = new SpriteManager(this.mapManager);
        this.eventsManager = new EventsManager();
        this.physicManager = new PhysicManager(this, this.mapManager);
        this.soundManager = new SoundManager();



        this.soundManager.init()
        this.soundManager.loadArray(["cat.mp3", "deamon.mp3", "money.mp3", "drink.mp3"])
        this.entities = []
        this.fireNum = 0

        this.player = null
        this.laterKill = []

        this.mapManager.loadMap("./assets/map/tilemap2.json");
        this.spriteManager.loadAtlas("./assets/map/atlas.json", "./assets/sprites/sprites.png");
        this.createEntities()
        this.mapManager.draw(this.ctx);
        this.eventsManager.setup(this.canvas);
    }

    update() {
        if (this.level === 1){
            this.new_level()
            this.level = 2
        }
        if (!this.mapManager.imgLoaded || !this.mapManager.jsonLoaded) {
            setTimeout(() => {
                this.update();
            }, 100);
        }
        else {
            if(this.player === null || this.level === 3) {
                ctx.font = 'bold 15px sans-serif';
                ctx.fillStyle = "black";
                ctx.fillText("GAME OVER", 200, 400);
                this.showGameOver()
                return;
            }
            this.player.move_x = 0;
            this.player.move_y = 0;
            if (this.eventsManager.action["up"]){
                this.player.move_y = -1
            }
            if (this.eventsManager.action["down"]) this.player.move_y = 1;
            if (this.eventsManager.action["left"]) this.player.move_x = -1;
            if (this.eventsManager.action["right"]) this.player.move_x = 1;
            if (this.eventsManager.action["fire"]) this.player.fire();
            this.entities.forEach(function(e) {
                try {
                    e.update()
                } catch(ex) {}
            });
            for(let i = 0; i < this.laterKill.length; i++) {
                const idx = this.entities.indexOf(this.laterKill[i]);
                if(idx > -1)
                    this.entities.splice(idx, 1);
            }
            if(this.laterKill.length > 0)
                this.laterKill.length = 0;

            if(this.player.mana < 100){
                this.player.mana += 0.1;
            }
            this.score = this.player.score
            this.mapManager.draw(ctx)
            this.mapManager.centerAt(this.player.pos_x, this.player.pos_y)
            this.draw(ctx)

            ctx.font = 'bold 15px sans-serif';
            ctx.fillStyle = "white";
            ctx.fillText("HP:",30,30);

            ctx.fillStyle = "black";
            ctx.fillRect(89, 14, 102,  22)


            ctx.fillStyle = "green";
            ctx.fillRect(90, 15, this.player.lifetime,  20)

            ctx.fillText(this.player.lifetime.toString(),120,30);


            ctx.fillStyle = "white";
            ctx.fillText("MANA:",30,60);

            ctx.fillStyle = "black";
            ctx.fillRect(89, 44, 102,  22)

            ctx.fillStyle = "blue";
            ctx.fillRect(90, 45, this.player.mana,  20)

            ctx.fillText(Math.floor(this.player.mana).toString(),250,60);


            ctx.fillStyle = "white"
            ctx.fillText("SCORE:",30,90);

            ctx.fillStyle = "yellow";
            ctx.fillText(this.player.score.toString(),200,90);
        }

    }

    draw(ctx) {
        for(var e = 0; e < this.entities.length; e++){
            this.entities[e].draw(ctx);
        }

    }

    loadAIl() {
        this.mapManager.loadMap("/assets/map/tilemap1.json");
        this.spriteManager.loadAtlas("/assets/map/atlas.json", "/assets/sprites/sprites.png");
        gameManager.createEntities()
        this.mapManager.draw(ctx);
        this.eventsManager.setup(canvas);

    }
    play(){
        setInterval(updateWorld, 100);
    }

    createEntities() {
        if (!this.mapManager.imgLoaded || !this.mapManager.jsonLoaded) {
            setTimeout(() => {
                this.createEntities();
            }, 100);
        } else {
            let entities = this.mapManager.parseEntities();
            for (let i = 0; i < entities.objects.length; i++) {
                const e = entities.objects[i];
                try {
                    let obj;
                    if (e.name === 'player') {
                        obj = new Player(this.spriteManager, this.physicManager, this, this.soundManager);
                        this.initPlayer(obj);
                        this.player.score = this.score
                    }
                    if (e.name === 'tank') {
                        obj = new Enemy(this.spriteManager, this.physicManager, this, this.player, this.soundManager);
                    }
                    if (e.name === 'hp') {
                        obj = new HP(this.spriteManager, this.physicManager, this, this.soundManager);
                    }
                    if (e.name === 'mana') {
                        obj = new Mana(this.spriteManager, this.physicManager, this, this.soundManager);
                    }
                    if (e.name === 'money') {
                        obj = new Money(this.spriteManager, this.physicManager, this, this.soundManager);
                    }
                    if (e.name === 'trap') {
                        obj = new Portal(this.spriteManager, this.physicManager, this, this.soundManager);
                    }
                    obj.name = e.name;
                    obj.pos_x = e.x;
                    obj.pos_y = e.y;
                    obj.size_x = e.width;
                    obj.size_y = e.height;
                    this.entities.push(obj);
                } catch (ex) {
                    console.log("Error while creating: [" + e.gid + "]" + e.type +
                        ", " + ex);
                }
            }
        }
    }

}