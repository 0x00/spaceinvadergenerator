class SpaceInvaderGenerator{

  constructor(){
    this.wallC = document.getElementById("wall");
    this.seed = document.getElementById("seed");
    this.size = document.getElementById("size");
    this.scale = document.getElementById("scale");
    this.download = document.getElementById("dwnld");

    this.i = function(){ var x = parseInt(this.seed.value); x = isNaN(x) || x==0 ? 1 : x; this.s = x; };
    this.s = 0;
    this.r = function() {
      var x = Math.sin(this.s++) * 10000;
      return x - Math.floor(x);
    };
    this.ri = function(a,b) {
      var x = Math.sin(this.s++) * 10000;
      return parseInt(a+(x - Math.floor(x))*(b-a));
    }

    var start = parseInt(window.location.hash.replace('#',''));
    if(!isNaN(start))
      this.seed.value = start;
  }

  invaderG(){
    var invader = [];
    var color1 = { r:this.ri(50,255),g:this.ri(50,255),b:this.ri(50,255)};
    var color2 = { r:this.ri(50,255),g:this.ri(50,255),b:this.ri(50,255)};
    var color3 = { r:this.ri(50,255),g:this.ri(50,255),b:this.ri(50,255)};

    for(var i = 0; i<this.size.value*this.size.value; i++){
     var color = this.r()>0.5 ? color1 : color3;
     color = this.r()>0.5 ? color : color2;

     invader[i] = this.r()>0.5 ? color: 0;
    }

    for(var x=0; x<this.size.value; x++)for(var y=0; y<this.size.value/2; y++)
      invader[x+y*this.size.value] = invader[x+(this.size.value-1-y)*this.size.value];

    return invader;
  }

  drawInvader(px, py, invader, ct){
    var si = parseInt(scale.value);
    var sz = parseInt(size.value)

    for(var x=0; x<sz; x++)for(var y=0; y<sz; y++){
        var i = invader[x*size.value+y];
        if(i!=0){
          ct.fillStyle = "rgb("+i.r+","+i.g+","+i.b+")";
          ct.fillRect(px+x*scale.value, py+y*si, scale.value, si);
        }
      }
  }

  wall(){
    this.seed.value = this.seed.value.replace(/[^\/\d]/g,'');
    if(this.seed.value.length>16)
      this.seed.value = "";

    window.location.hash = this.seed.value;
    this.wallC.height = window.innerHeight;
    this.wallC.width = window.innerWidth;

    var ct = this.wallC.getContext("2d");

    ct.fillStyle = "#000";
    ct.fillRect(0,0,this.wallC.width, this.wallC.height);

    var si = parseInt(this.scale.value);
    var sz = parseInt(this.size.value);
    var padding = 4+si;
    var tile = si*sz+padding;
    this.i();
    for(var px = 0; px<this.wallC.width; px+=tile)for(var py = 0; py<this.wallC.height; py+=tile){
      var invader = this.invaderG(px+py*si*sz);
      this.drawInvader(px,py, invader, ct);
    }
  }
}

var space = new SpaceInvaderGenerator();
window.onresize = function() { space.wall() };
space.seed.onkeyup = function() { space.wall() };
space.seed.onchange = function() { space.wall() };
space.size.onchange = function() { space.wall() };
space.scale.onchange = function() { space.wall() };
space.download.onclick = function(e){
  e.target.href = space.wallC.toDataURL("image/png").replace("image/png", "image/octet-stream");
};
space.wall();
