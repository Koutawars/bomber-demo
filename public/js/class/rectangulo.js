class rectangulo{
    constructor(x, y, ancho, alto){
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
    }
    Draw(ctx){
        ctx.strokeStyle="rgb(250, 0, 0)"; // color de los trazos
        ctx.strokeRect(this.x,this.y, this.ancho, this.alto);
        ctx.fillStyle = 'rgba(250, 0, 0, 0.3)';
        ctx.fillRect(this.x,this.y,this.ancho, this.alto);
    }
    copiar(){
        return new rectangulo(this.x, this.y, this.ancho, this.alto);
    }
    valueInRange(value, min, max)
    { return (value >= min) && (value <= max); }
    chocarCon(otherobj) {
        var xOverlap = this.valueInRange(this.x, otherobj.x, otherobj.x + otherobj.ancho) ||
                        this.valueInRange(otherobj.x, this.x, this.x + this.ancho);
        var yOverlap = this.valueInRange(this.y, otherobj.y, otherobj.y + otherobj.alto) ||
                        this.valueInRange(otherobj.y, this.y, this.y + this.alto);
        return xOverlap && yOverlap;
    }
}