class MapManager{
    constructor() {
        this.mapData = null
        this.tLayer = null
        this.xCount = 0
        this.yCount = 0
        this.tSize =  {x: 64, y: 64}
        this.mapSize = {x: 64, y: 64}
        this.tilesets =  []
        this.imgLoadCount = 0
        this.imgLoaded = false
        this.jsonLoaded = false
        this.view = {x:0, y:0, w:800, h:600}
    }

    parseMap(tilesJSON) {
        this.mapData = JSON.parse(tilesJSON);
        this.xCount = this.mapData.width;
        this.yCount = this.mapData.height;
        this.tSize.x = this.mapData.tilewidth;
        this.tSize.y = this.mapData.tileheight;
        this.mapSize.x = this.xCount * this.tSize.x;
        this.mapSize.y = this.yCount * this.tSize.y;
        for (let i = 0; i < this.mapData.tilesets.length; i++) {
            const img = new Image();
            img.onload = () => {
                this.imgLoadCount++
                if (this.imgLoadCount === this.mapData.tilesets.length) {
                    this.imgLoaded = true;
                }
            };
            img.src = this.mapData.tilesets[i].image;
            const t = this.mapData.tilesets[i];
            const ts = {
                firstgid: t.firstgid,
                image: img,
                name: t.name,
                xCount: Math.floor(t.imagewidth / this.tSize.x),
                yCount: Math.floor(t.imageheight / this.tSize.y)
            };
            this.tilesets.push(ts);
        }
        this.jsonLoaded = true;
    }



    loadMap(path){
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if(request.readyState === 4 && request.status === 200){
                this.parseMap(request.responseText);
            }
        }
        request.open("GET", path, true);
        request.send();
    }


    parseEntities() {
        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(() => {
                this.parseEntities();
            }, 100);
        } else {
            for (let j = 0; j < this.mapData.layers.length; j++) {
                if (this.mapData.layers[j].type === 'objectgroup') {
                    return this.mapData.layers[j];
                }
            }
        }
    }

    draw(ctx) {
        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(() => { this.draw(ctx);}, 100);
        } else {
            if (this.tLayer === null)
                for (let id = 0; id < this.mapData.layers.length; id++) {
                    const layer = this.mapData.layers[id];
                    if (layer.type === "tilelayer") {
                        this.tLayer = layer;
                        break;
                    }
                }
            for (let i = 0; i < this.tLayer.data.length; i++) {
                if (this.tLayer.data[i] !== 0) {
                    const tile = this.getTile(this.tLayer.data[i]);
                    let pX = (i % this.xCount) * this.tSize.x;
                    let pY = Math.floor(i / this.xCount) * this.tSize.y;
                    if(!this.isVisible(pX, pY, this.tSize.x, this.tSize.y))
                        continue;
                    pX -= this.view.x
                    pY -= this.view.y
                    ctx.drawImage(tile.img, tile.px, tile.py, this.tSize.x, this.tSize.y, pX, pY, this.tSize.x, this.tSize.y);
                }
            }
        }
    }

    getTile(tileIndex) {
        const tile = {
            img: null,
            px: 0, py: 0
        };
        const tileset = this.getTileset(tileIndex);
        tile.img = tileset.image;
        const id = tileIndex - tileset.firstgid;
        const x = id % tileset.xCount;
        const y = Math.floor(id / tileset.xCount);
        tile.px = x * this.tSize.x;
        tile.py = y * this.tSize.y;
        return tile;
    }


    getTileset(tileIndex) {
        for (let i = this.tilesets.length - 1; i >= 0; i--)
            if (this.tilesets[i].firstgid <= tileIndex) {
                return this.tilesets[i];
            }
        return null;
    }

    isVisible(x, y, width, height) {
        return !(x + width < this.view.x || y + height < this.view.y ||
            x > this.view.x + this.view.w || y > this.view.y + this.view.h);

    }
    getTilesetIdx(x, y){
        var wX = x;
        var wY = y;
        var idx =Math.floor(wY/this.tSize.y) * this.xCount + Math.floor(wX/this.tSize.x);
        return this.tLayer.data[idx];
    }
    centerAt(x, y) {
        if (x < this.view.w / 2)
            this.view.x = 0;
        else if (x > this.mapSize.x - this.view.w / 2)
            this.view.x = this.mapSize.x - this.view.w;
        else
            this.view.x = x - (this.view.w / 2);
        if (y < this.view.h / 2)
            this.view.y = 0;
        else if (y > this.mapSize.y - this.view.h / 2)
            this.view.y = this.mapSize.y - this.view.h;
        else
            this.view.y = y - (this.view.h / 2);
    }
}

