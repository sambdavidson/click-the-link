/**
 * Created by Samuel Davidson on 6/12/2017.
 */

(function() {

    var goal = document.createElement('a');
    goal.innerHTML = 'Click Here To Win';
    goal.href = 'victory.html';
    goal.style.position = 'absolute';
    goal.style.textAlign = 'center';
    goal.style.left = '50%';
    goal.style.top = '50%';
    goal.style.transform = 'translate(-50%,-50%)';
    goal.style.whiteSpace = 'nowrap';

    document.body.appendChild(goal);

    document.addEventListener('gameFrame', processFrame);

    function processFrame(frameData) {

        var gameData = frameData.detail;

        var w = document.body.clientWidth;
        var h = document.body.clientHeight;

        var mouseX = gameData.mousePosition.x;
        var mouseY = gameData.mousePosition.y;

        var myX = goal.offsetLeft;
        var myY = goal.offsetTop;

        var direction = decideDirection(myX,myY,mouseX,mouseY,w,h);
        var speed = decideSpeed(myX,myY,mouseX,mouseY,w,h,gameData);

        drawMyVector(direction, 15*speed,'#555555');

        var dX = Math.cos(direction) * speed;
        var dY = Math.sin(direction) * speed;

        var newX = Math.min(Math.max(100,myX + dX),w-100);
        var newY = Math.min(Math.max(100,myY + dY),h-100);

        goal.style.left = ((newX / w) * 100) + '%';
        goal.style.top = ((newY / h) * 100) + '%';
    }

    /**
     * Decides the direction that the goal should run away in.
     * The returned number is a the direction in radians (between 0.0 and 2*pi).
     *
     * @param myX
     * @param myY
     * @param mouseX
     * @param mouseY
     * @param w
     * @param h
     * @returns {number}
     *
     */
    function decideDirection(myX,myY,mouseX,mouseY,w,h) {
        var shortestDistanceToWall = Math.min(myX-100, myY-100, (w-100)-myX, (h-100)-myY);

        var x = mouseX - myX;
        var y = -1 * (mouseY - myY);

        var wallCareDistance = Math.min(w,h) / 4;

        var fromMouse = Math.atan2(x,y) + Math.PI/2;

        if(fromMouse < 0) {
            fromMouse += (2*Math.PI);
        }

        if(shortestDistanceToWall > wallCareDistance && false) {
            /* Straight Line */
            return fromMouse

        } else {
            /* Curve Away From Wall */
            var curvePoint = {
                x: w-mouseX,
                y: h-mouseY
            };

            drawDot(curvePoint.x,curvePoint.y, '#333333');

            // switch(shortestDistanceToWall) {
            //     case myX:
            //         if(myY < h-myY) {
            //             curvePoint.x = w;
            //             curvePoint.y = h;
            //         } else {
            //             curvePoint.x = w;
            //             curvePoint.y = 0;
            //         }
            //         break;
            //     case myY:
            //         if(myX < w-myX) {
            //             curvePoint.x = w;
            //             curvePoint.y = h;
            //         } else {
            //             curvePoint.x = 0;
            //             curvePoint.y = h;
            //         }
            //         break;
            //     case (w-myX):
            //         if(myY < h-myY) {
            //             curvePoint.x = 0;
            //             curvePoint.y = h;
            //         } else {
            //             curvePoint.x = 0;
            //             curvePoint.y = 0;
            //         }
            //         break;
            //     case (h-myY):
            //         if(myX < w-myX) {
            //             curvePoint.x = w;
            //             curvePoint.y = 0;
            //         } else {
            //             curvePoint.x = 0;
            //             curvePoint.y = 0;
            //         }
            //         break;
            // }

            drawMyVector(fromMouse,50,'#ff7777');

            var awayX = curvePoint.x - myX;
            var awayY = -1 * (curvePoint.y - myY);

            var angleAway = Math.atan2(awayX,awayY) - (Math.PI/2);

            if(angleAway < 0) {
                angleAway += 2*Math.PI;
            }

            if(Math.abs((Math.abs(angleAway-fromMouse) % (Math.PI*2)) - Math.PI) < (Math.PI / 10)) {
                return fromMouse;
            }

            drawMyVector(angleAway,50,'#7777ff');

            var influencePercent = 1 / Math.max(shortestDistanceToWall/2,2);

            var outVector = averageAngles(angleAway,fromMouse,(1-influencePercent));

            return outVector;
        }
    }

    /**
     * Decides the speed that the goal should run away.
     * The returned number is between 0.0 and 10.0 (inclusively for both).
     *
     * @param myX
     * @param myY
     * @param mouseX
     * @param mouseY
     * @param gameData
     * @returns {number}
     */
    function decideSpeed(myX,myY,mouseX,mouseY,w,h,gameData) {
        var distanceBetween = Math.sqrt(Math.pow(myX-mouseX,2) + Math.pow(myY-mouseY,2));

        if(distanceBetween > gameData.goalDistanceCutoff) {
            return 0.0;
        }

        if(distanceBetween < gameData.goalResetCutoff) {
            gameData.goalDistanceCutoff = gameData.goalResetCutoff + 450 + (Math.random() * 300);
        }

        var speed = Math.min(10, 1000/(Math.pow(distanceBetween,1)));

        return speed;
    }

    function drawMyVector(dir,len,color) {
        var x = goal.offsetLeft;
        var y = goal.offsetTop;

        if(window.ArtCanvas !== undefined && window.gameDebug) {
            window.ArtCanvas.drawVector(x,y,dir,len,color);
        }
    }

    function averageAngles(a,b,percent) {
        var phi = Math.abs(a-b) % (Math.PI*2);
        var dist = phi > Math.PI ? (Math.PI*2) - phi : phi;
        if(phi > Math.PI) {
            if(a > b) {
                return a + (dist*percent);
            } else {
                return a - (dist*percent);
            }
        } else {
            if(a > b) {
                return a - (dist*percent);
            } else {
                return a + (dist*percent);
            }
        }
    }

    function drawDot(x,y,color) {
        if(window.ArtCanvas !== undefined && window.gameDebug) {
            window.ArtCanvas.drawDot(x,y,color);
        }
    }

})();




