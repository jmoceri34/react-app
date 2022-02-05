import React from 'react';
import $ from 'jquery';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
require('jquery-ui/ui/widgets/slider');

export default function VideoLoopTool() {

    var player = undefined;
    var leftHandle = undefined;
    var rightHandle = undefined;
    var leftValue = undefined;
    var rightValue = undefined;
    var loopTimeout;

    var urlParameters = new URLSearchParams(window.location.search);

    // get the query string parameters if any
    var videoId = urlParameters.get("v");
    var queryStartTime = urlParameters.get("s");
    var queryEndTime = urlParameters.get("e");

    // keep track when the user enters a new video id
    function handleChange(e) {
        videoId = e.target.value;
    }

    function startLoop() {

        // set the query video id
        urlParameters.set("v", videoId);

        // if the player already exists, load the video
        if (player) {
            player.loadVideoById(videoId);

            if (loopTimeout) {
                clearTimeout(loopTimeout);
            }

            setTimeout(function () {
                var duration = player.getDuration();

                var left = 0;
                var right = duration;

                createSlider(left, right);

                player.seekTo(leftValue, true);

            }, 500);

            return;
        }

        // if YT hasn't been downloaded yet
        if (!window.YT) {
            // set the call back to load the player once this global callback from youtube is executed
            window.onYouTubePlayerAPIReady = function () {
                loadPlayer(videoId);
            };

            // go and get the script in the meantime
            $.getScript('https://www.youtube.com/player_api');
        }
        // otherwise load the player
        else {
            loadPlayer(videoId);
        }

        function createSlider(min, max) {
            var slider = $("#slider-range").slider({
                range: true,
                // this should always be 0 -> duration
                min: 0,
                max: player.getDuration(),
                values: [min, max],
                slide: function (event, ui) {

                    leftValue = ui.values[0];
                    rightValue = ui.values[1];

                    if (leftHandle) {
                        leftHandle[0].innerHTML = wrap(leftValue, true, true);
                        // update the query string parameter
                        urlParameters.set("s", leftValue);
                    }

                    if (rightHandle) {
                        rightHandle[0].innerHTML = wrap(rightValue, true);
                        // update the query string parameter
                        urlParameters.set("e", rightValue);
                    }

                    if (history.pushState) {
                        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + urlParameters.toString();
                        window.history.pushState({ path: newurl }, '', newurl);
                    }

                    if (player.getCurrentTime() < leftValue || player.getCurrentTime() > rightValue) {
                        player.seekTo(leftValue, true);
                    }
                }
            });

            $(slider[0].children[1]).empty();
            $(slider[0].children[2]).empty();

            leftHandle = $(slider[0].children[1]).prepend(wrap(min, true, true));
            rightHandle = $(slider[0].children[2]).prepend(wrap(max, true));

            leftValue = min;
            rightValue = max;

            // update the query string when creating the slider
            urlParameters.set("s", leftValue);
            urlParameters.set("e", rightValue);

            if (history.pushState) {
                var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + urlParameters.toString();
                window.history.pushState({ path: newurl }, '', newurl);
            }

            function wrap(value, format, left) {
                format = format == undefined ? false : true;
                if (format) {
                    value = new Date(value * 1000).toISOString().substr(11, 8);
                }
                var px = left ? "-35px" : "35px";
                return '<span style="position: absolute !important; bottom: -50px; left: ' + px + '; color: #000 !important;">' + value + '</span>';
            }
        }

        function loadPlayer(videoId) {
            player = new window.YT.Player('player', {
                playerVars: {
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                    autoplay: 0,
                    mute: 0
                },
                height: 360,
                width: 640,
                videoId: videoId,
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });

            function onPlayerReady(event) {
                var duration = player.getDuration();

                var left = queryStartTime || 0;
                var right = queryEndTime || duration;

                createSlider(left, right);

                player.seekTo(leftValue, true);
            }

            function onPlayerStateChange(event) {
                if (event.data == window.YT.PlayerState.PLAYING) {

                    if (player && player.getCurrentTime() < leftValue) {
                        player.seekTo(leftValue, true);
                    }

                    var loopTimeout = setInterval(function () {
                        var currentTime = player.getCurrentTime();

                        if (currentTime >= rightValue) {
                            player.seekTo(leftValue, true);
                        }
                    }, 1000);
                }
                else if (event.data == window.YT.PlayerState.PAUSED) {
                    if (loopTimeout) {
                        clearTimeout(loopTimeout);
                    }
                }
                else if (event.data == window.YT.PlayerState.ENDED) {
                    if (loopTimeout) {
                        clearTimeout(loopTimeout);
                    }

                    player.seekTo(leftValue, true);
                }
            }
        }
    }

    if (videoId) {
        startLoop();
    }

    return (
        <div style={{ 'textAlign': "left", 'width': '640px', 'margin': '0 auto' }}>
            <h1>Video Loop Tool</h1>
            <div style={{ display: 'block' }}>
                <div id="player"></div>
            </div>
            <div style={{ display: 'block' }}>

            </div>
            <div style={{ display: 'block' }}>
                <div id="slider-range" style={{ width: "640px", margin: '12px auto' }}></div>
            </div>
            <div style={{ display: 'block', 'textAlign': 'left', 'paddingTop': '25px' }}>
                <div>
                    <h2>Instructions</h2>
                    <TextField id="standard-basic" label="YouTube VideoID" defaultValue={videoId} style={{ width: "600px" }} onChange={handleChange.bind(this)} />
                    <Button variant="contained" color="primary" onClick={() => { startLoop() }} style={{ 'marginTop': "12px"}}>
                        Setup
                    </Button>
                    <h3>Overview</h3>
                    <p>
                        You can use this tool to loop parts of a youtube video. In the URL above you can specify the video (v), start time (s), and end time (e) in the query string:
                    </p>
                    <p>
                        https://joemoceri.github.io/video-loop-tool?<strong>v</strong>=<strong>&#123;youtubeVideoId&#125;</strong>&<strong>s</strong>=<strong>&#123;startTimeInSeconds&#125;</strong>&<strong>e</strong>=<strong>&#123;endTimeInSeconds&#125;</strong>
                    </p>
                    <p>
                        The URL will update as you update the video id and slider.
                    </p>
                    <h3>Method 1</h3>
                    <p>
                        Say you have a youtube url like this (where videoId is the youtube video id)
                    </p>
                    <p>
                        <strong>https://www.youtube.com/watch?v=videoId</strong>
                    </p>
                    <p>
                        If you change it to this
                    </p>
                    <p>
                        <strong>https://joemoceri.github.io/video-loop-tool?v=videoId</strong>
                    </p>
                    <p>
                        By replacing
                    </p>
                    <p>
                        <strong>https://www.youtube.com/watch</strong> with <strong>https://joemoceri.github.io/video-loop-tool</strong>
                    </p>
                    <p>you can add additional looping capabilities to any youtube video.</p>
                    <h3>Method 2</h3>
                    <p>
                        You can also grab the video id and put it into the field above. Run setup first when changing the video id, then hit play on the youtube video. You can change the range on the slider below to loop a specific part of the video. Then hit play.
                    </p>
                </div>
            </div>
        </div>
    );
};