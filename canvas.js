/**
 * Created by Samuel Davidson on 6/13/2017.
 */

window.ArtCanvas = {
    drawDot: function(x,y,hexColor){},
    drawVector: function(x,y,dir,len,hexColor){},
    _drawQueue: []
};

(function() {
    var c = document.createElement('canvas');
    c.style.position = 'absolute';
    c.style.width = '100%';
    c.style.height = '100%';
    c.style.zIndex = '-1';
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.body.appendChild(c);

    document.addEventListener('gameFrame', processFrame);

    var ctx = c.getContext('2d');

    function dDot(x,y,hexColor) {
        var cmd = {
            command: 'dot',
            x:x,
            y:y,
            color: hexColor
        };

        window.ArtCanvas._drawQueue.push(cmd)
    }

    function dVector(x,y,dir,len,hexColor){
        var cmd = {
            command: 'vector',
            x:x,
            y:y,
            len:len,
            dir: dir,
            color: hexColor
        };

        window.ArtCanvas._drawQueue.push(cmd)
    }
    
    function processFrame() {
        ctx.fillStyle = '#222222';
        ctx.fillRect(0,0,c.width,c.height);
        ctx.clearRect(25,50, c.width-50,c.height-75);
        for(var i = 0; i < window.ArtCanvas._drawQueue.length; i++) {
            var drawCmd = window.ArtCanvas._drawQueue[i];

            if(drawCmd.command === 'dot') {

                ctx.strokeStyle = drawCmd.color;
                ctx.lineWidth = 0;
                ctx.lineCap = 'square';
                ctx.fillStyle = drawCmd.color;

                var radius = 6;

                ctx.beginPath();
                ctx.arc(drawCmd.x,drawCmd.y, radius, 0, 2 * Math.PI,false);
                ctx.fill();
                ctx.closePath();

            } else if(drawCmd.command === 'vector') {
                var toX = drawCmd.x + (drawCmd.len * Math.cos(drawCmd.dir));
                var toY = drawCmd.y + (drawCmd.len * Math.sin(drawCmd.dir));

                ctx.strokeStyle = drawCmd.color;
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';

                ctx.beginPath();
                ctx.moveTo(drawCmd.x,drawCmd.y);
                ctx.lineTo(toX,toY);
                ctx.stroke();

            } else {
                console.error('Invalid draw command.', drawCmd);
            }
        }
        window.ArtCanvas._drawQueue = [];
    }

    function resizeCanvas() {
        c.width = document.body.clientWidth;
        c.height = document.body.clientHeight;
    }

    window.ArtCanvas.drawDot = dDot;
    window.ArtCanvas.drawVector = dVector;
})();