class animation{
    constructor(imagenes, speed){
        this.img = imagenes;
        this.stop = true;
        this.count = 0;
        this.frames = 0;
        this.speed = speed;
        this.index;
        this.countReset = 0;
    }
    Update(comienzo, final){
        if(!this.stop)this.frames += this.speed;
        if(this.frames >= final+1 || this.frames < comienzo)
        {
            this.frames = comienzo;
            this.countReset += 1;
        }
        this.index = Math.floor(this.frames)%this.img.length;
    }
    Draw(ctx, x, y){
        ctx.drawImage(this.img[this.index], x, y);
    }
}