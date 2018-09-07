class animation{
    constructor(ruta, numImages){
        this.img = [];
        this.numImages = numImages;
        this.stop = true;
        this.count = 1.0;
        this.frames = 0;
        var n = 0;
        var imgTmp;
        while(n <= numImages){
            imgTmp = new Image();
            imgTmp.src = ruta +"_"+ n + ".png";
            this.img[n] = imgTmp;
            n++;
        }
    }
    draw(comienzo, final, ctx, x, y){
        if(this.img[this.frames] != null){
            if(!this.stop){
                if(this.count >= 60)
                {
                    this.count = 0.0;
                }
                if(this.frames > final || this.frames < comienzo)
                {
                    this.frames = comienzo;
                }
            }
            ctx.drawImage(this.img[this.frames], x, y);
            if(!this.stop){
                if(this.count%15 == 0 && this.frames >= comienzo && this.frames <= final){
                    this.frames++;
                }
                this.count += 1;
            }
        }else{
            this.frames = comienzo;
        }
    }
}