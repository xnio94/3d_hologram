

var c = document.getElementById("myCanvas");
var ctx2 = c.getContext("2d");


grid=70;
canvasWidth=1600;//screen.width;//window.innerWidth;
canvasHeight=900;//screen.height;//window.innerHeight;
theFCanva=document.getElementById("myCanvas");
theFCanva.width=canvasWidth;
theFCanva.height=canvasHeight;
var draw = function (aa,bb,cc)
{

    a=(580*aa+10000)/cc;b=(1300-4*bb);
    c=20/cc;
    ctx2.clearRect(0,0,canvasWidth,canvasHeight);
    ctx2.beginPath();
    ctx2.lineWidth = 2;
    ctx2.strokeStyle = "#16a659";

    xl =a-c*canvasWidth/2;
    xr =a+c*canvasWidth/2;
    yt =b-c*canvasHeight/2;
    yb =b+c*canvasHeight/2;

    ctx2.moveTo(0, 0);
    ctx2.lineTo(xl, yt);
    ctx2.moveTo(0, canvasHeight);
    ctx2.lineTo(xl, yb);
    ctx2.moveTo(canvasWidth, 0);
    ctx2.lineTo(xr, yt);
    ctx2.moveTo(canvasWidth, canvasHeight);
    ctx2.lineTo(xr, yb);

    for(i=0;i<grid;i++){
        ctx2.moveTo(i*canvasWidth/grid, 0);
        ctx2.lineTo((xl*(grid-i)+xr*i)/grid, yt);
    }

    for(i=0;i<grid;i++){
        ctx2.moveTo(0, canvasHeight-i*canvasHeight/grid);
        ctx2.lineTo(xl, (yb*(grid-i)+yt*i)/grid);
    }

    for(i=0;i<grid;i++){
        ctx2.moveTo(canvasWidth, i*canvasHeight/grid);
        ctx2.lineTo(xr,(yt*(grid-i)+yb*i)/grid);
    }

    for(i=0;i<grid;i++){
        ctx2.moveTo(canvasWidth-i*canvasWidth/grid, canvasHeight);
        ctx2.lineTo((xr*(grid-i)+xl*i)/grid, yb);
    }


    for(i=0;i<=grid;i++){
        ctx2.moveTo(xl*i/grid, yt*i/grid);
        ctx2.lineTo(xl*i/grid,(yb*i+canvasHeight*(grid-i))/grid);
        ctx2.lineTo((xr*i+canvasWidth*(grid-i))/grid,(yb*i+canvasHeight*(grid-i))/grid);
        ctx2.lineTo((xr*i+canvasWidth*(grid-i))/grid, yt*i/grid);
        ctx2.lineTo(xl*i/grid, yt*i/grid);
    }

    ctx2.stroke();
};


var myfunc = function (x, y, z) {
    u[ind] = x;
    v[ind] = y;
    w[indz] = z;
    a = u.reduce(function (a, b) {
        return a + b;
    }, 0) / n;
    b = v.reduce(function (a, b) {
        return a + b;
    }, 0) / n;
    c = w.reduce(function (a, b) {
        return a + b;
    }, 0) / nz;

    draw(500 - a, 500 - b, c);

    ind = (ind + 1) % n;
    indz = (indz + 1) % nz;

};



button_callback();