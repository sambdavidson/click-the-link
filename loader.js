/**
 * Created by Samuel Davidson on 6/12/2017.
 */

(function() {
    window.addEventListener('load', load);

    function load() {
        if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {

            setupToolbar();
            setupGame();

            /* Load other scripts */
            loadScript('dodgy-goal.js');
            loadScript('canvas.js');

            window.gameDebug = false;

        } else {
            /*We are on mobile and this mouse stuff doesn't really make sense.
            * So lets just cancel and tell the user.*/
            document.body.style.textAlign = 'center';
            document.body.innerHTML = "<h1>Mobile not supported for this web app.</h1><h2>Sorry! <3</h2>";
        }
    }

    function setupToolbar() {

        console.log('hi');

        var title = document.createElement('h1');
        console.log(title);
        title.style.position = 'absolute';
        title.style.color = 'white';
        title.style.marginTop = '6px';
        title.style.marginLeft = '25px';
        title.innerHTML = 'Click The Link';

        document.body.appendChild(title);

        var debugToggleButton = document.createElement('button');
        debugToggleButton.innerHTML = 'Toggle Debug';
        debugToggleButton.style.position = 'absolute';
        debugToggleButton.style.right = '25px';
        debugToggleButton.style.top = '13px';

        debugToggleButton.onclick = function() {
            window.gameDebug = !window.gameDebug;
        };

        document.body.appendChild(debugToggleButton);

    }

    function setupGame() {
        /* Setup Document for capture of mouse */
        document.body.addEventListener('mousemove', mouseMoveEvent);
        document.body.style.position = 'absolute';
        document.body.style.margin = '0';

        document.body.style.width = '100%';
        document.body.style.height = '100%';

        var gameData = {
            mousePosition: {
                x: 0,
                y: 0
            },
            goalResetCutoff: 75,
            goalDistanceCutoff: 700
        };

        setInterval(function() {
            var frameEvent = new CustomEvent('gameFrame', {detail: gameData});
            document.dispatchEvent(frameEvent);
        }, 1000/60);

        function mouseMoveEvent(event) {
            gameData.mousePosition.x = event.clientX;
            gameData.mousePosition.y = event.clientY;
        }
    }


    function loadScript(name) {
        var s = document.createElement('script');
        s.src = name;
        s.async = false;
        document.head.appendChild(s);
    }
})();
