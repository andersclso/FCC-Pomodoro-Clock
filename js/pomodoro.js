$(document).ready(function() {
    var form = document.getElementById("timeForm"),
        timerState = "notSet",
        timer,
        remainingTimeInSecs,
        totalTimeInSecs,
        startTone = new Audio("audio/start.mp3"),
        pauseTone = new Audio("audio/pause.mp3"),
        endTone = new Audio("audio/end.mp3");

    //all the neccesary modifications to reset timer
    function resetTimer() {
        form.reset();
        endTone.play();
        clearInterval(timer);
        timerState = "notSet";
        $('.startStop').text("START TIMER");
        $('.triClock').circleProgress('value', 1);
        $('.display').css('visibility', 'hidden');
        $('#reset').css('visibility', 'hidden');
        $('.startStop').css('background-image', 'url(img/play.svg)');
        return; 
    }

    function tick() {
        timer = setInterval(function() {
            if (remainingTimeInSecs > 0) {

                remainingTimeInSecs--;

                //visuals
                $('#hrsTrack').text(~~(remainingTimeInSecs / 3600));
                $('#minsTrack').text(~~(remainingTimeInSecs % 3600 / 60));
                $('#secsTrack').text(remainingTimeInSecs % 60);                
                $('.triClock').circleProgress('value', remainingTimeInSecs / totalTimeInSecs); 

            }
            else if (remainingTimeInSecs === 0) {
                resetTimer();
            }
        }, 1000);
    }

    $('.startStop').click(function() {
        if (timerState === "notSet") {
            var hours = Number($('#hours').val()),
                mins = Number($('#mins').val()),
                secs = Number($('#secs').val());

            startTone.play();
            totalTimeInSecs = (hours * 3600) + (mins * 60) + (secs * 1); //convert time to seconds
            remainingTimeInSecs = totalTimeInSecs; //make a copy to keep track of remaining time
            timerState = "ticking";
            
            if (hours) {$('#hrsTrack').text(hours)};
            if (mins) {$('#minsTrack').text(mins)};
            if (secs) {$('#secsTrack').text(secs)};

            $('.display').css('visibility', 'visible');
            $('#reset').css('visibility', 'visible');
            $('.startStop').css('background-image', 'url(img/pause.svg)');
            $('.startStop').text("PAUSE TIMER");
            tick();
        }
        else if (timerState === "ticking") {
            $('.startStop').text("RESUME TIMER");
            $('.startStop').css('background-image', 'url(img/play.svg)');
            pauseTone.play();
            timerState = "paused";
            clearInterval(timer);
        }
        else if (timerState === "paused") {
            $('.startStop').text("PAUSE TIMER");
            $('.startStop').css('background-image', 'url(img/pause.svg)');
            pauseTone.play();
            timerState = "ticking";
            tick();
        }
    });

    //Reset Button
    $('#reset').click(function() {
        resetTimer();
    })

    //'Triangle Clock' made by Kottenator @ https://github.com/kottenator/jquery-circle-progress
    $('.triClock').circleProgress({
        value: 1,
        size: 200,
        thickness: 8,

        drawFrame: function(v) {
            var ctx = this.ctx,
                s = this.size,
                r = this.radius * 0.9,
                t = this.getThickness(),
                da = Math.PI / 3,
                dx = r / 10,
                dy = r / 10 + 25,
                lc = 'butt',
                lj = 'miter';

            this.lastFrameValue = v;
            ctx.clearRect(0, 0, this.size, this.size);
            ctx.lineWidth = t;
            ctx.lineJoin = lj;
            ctx.lineCap = lc;

            function getX(angle) {
                return r * (1 + Math.cos(angle));
            }

            function getY(angle) {
                return r * (1 + Math.sin(angle));
            }

            var a1 = -Math.PI * 5 / 6 + da,
                x1 = getX(a1) + dx,
                y1 = getY(a1) + dy;

            var a2 = -Math.PI / 6 + da,
                x2 = getX(a2) + dx,
                y2 = getY(a2) + dy;

            var a3 = Math.PI / 2 + da,
                x3 = getX(a3) + dx,
                y3 = getY(a3) + dy;

            // Draw "empty" path
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.closePath();
            ctx.strokeStyle = this.emptyFill;
            ctx.stroke();
            ctx.restore();

            // Draw "filled" path
            ctx.save();
            ctx.beginPath();

            var p0 = 0.96;
            ctx.moveTo(
                x1 * p0 + x3 * (1 - p0),
                y1 * p0 + y3 * (1 - p0)
            );

            ctx.lineTo(x1, y1);

            var p1 = v > 1 / 3 ? 1 : v * 3;
            ctx.lineTo(
                x2 * p1 + x1 * (1 - p1),
                y2 * p1 + y1 * (1 - p1)
            );

            if (v > 1 / 3) {
                var p2 = v > 2 / 3 ? 1 : v * 3 - 1;
                ctx.lineTo(
                    x3 * p2 + x2 * (1 - p2),
                    y3 * p2 + y2 * (1 - p2)
                );
            }

            if (v > 2 / 3) {
                var p3 = v * 3 - 2;
                ctx.lineTo(
                    x1 * p3 + x3 * (1 - p3),
                    y1 * p3 + y3 * (1 - p3)
                );
            }

            if (v >= 1)
                ctx.closePath();

            ctx.strokeStyle = this.arcFill;
            ctx.stroke();
            ctx.restore();
        }
    });
});