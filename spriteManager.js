class SpriteManager {
    constructor(mapManager) {
        this.image = new Image()
        this.sprites =  []
        this.imgLoaded = false
        this.jsonLoaded = false
        this.mapManager = mapManager
    }

    loadAtlas(atlasJson, atlasImg) {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                this.parseAtlas(request.responseText);
            }
        }
        request.open("GET", atlasJson, true);
        request.send();
        this.loadImg(atlasImg);
    }

    loadImg(imgName) {
        this.image.onload = () => {
            this.imgLoaded = true;
        }
        this.image.src = imgName;
    }

    parseAtlas(atlasJSON) {
        const atlas = JSON.parse(atlasJSON);
        for (const name in atlas.frames) {
            const frame = atlas.frames[name].frame;
            this.sprites.push({name: name, x: frame.x, y: frame.y, w: frame.w, h: frame.h});
        }
        this.jsonLoaded = true;
    }

    drawSprite(ctx, name, x, y, mapManager) {
        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(() => {

                this.drawSprite(ctx, name, x, y);
            }, 100);
        }
        else{
            const sprite = this.getSprite(name);
            if(!this.mapManager.isVisible(x, y, sprite.w, sprite.h))
                return;
            x-= this.mapManager.view.x;
            y-= this.mapManager.view.y;
            ctx.drawImage(this.image, sprite.x, sprite.y, sprite.w, sprite.h, x, y, sprite.w, sprite.h);
        }
    }

    getSprite(name) {
        for (let i = 0; i < this.sprites.length; i++) {
            const s = this.sprites[i];
            if (s.name === name)
                return s;
        }
        return null;
    }

}