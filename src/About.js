import React from 'react';
import $ from 'jquery';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
require('jquery-ui/ui/widgets/slider');

export default function About(obj) {

    var videoId = obj.videoId;
    var player = undefined;
    var leftHandle = undefined;
    var rightHandle = undefined;
    var leftValue = undefined;
    var rightValue = undefined;
    var playerLoaded = false;
    var loopTimeout;

    // keep track when the user enters a new video id
    function handleChange(e) {
        videoId = e.target.value;
    }

    function startLoop() {

        // if the player already exists, load the video
        if (player) {
            var r = player.loadVideoById(videoId);

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
                min: min,
                max: max,
                values: [!playerLoaded ? 22 : min, max],
                slide: function (event, ui) {

                    leftValue = ui.values[0];
                    rightValue = ui.values[1];

                    if (leftHandle) {
                        leftHandle[0].innerHTML = wrap(leftValue, true);
                    }

                    if (rightHandle) {
                        rightHandle[0].innerHTML = wrap(rightValue, true);
                    }

                    player.pauseVideo();

                    player.seekTo(leftValue, true);
                }
            });

            $(slider[0].children[1]).empty();
            $(slider[0].children[2]).empty();

            leftHandle = $(slider[0].children[1]).prepend(wrap(!playerLoaded ? 22 : min, true));
            rightHandle = $(slider[0].children[2]).prepend(wrap(max, true));

            leftValue = !playerLoaded ? 22 : min;
            rightValue = max;

            function wrap(value, format) {
                format = format == undefined ? false : true;
                if (format) {
                    value = new Date(value * 1000).toISOString().substr(11, 8);
                }
                return '<span style="position: absolute !important; bottom: -50px; color: #000 !important;">' + value + '</span>';
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

                var left = 0;
                var right = duration;

                createSlider(left, right);

                player.seekTo(leftValue, true);

                playerLoaded = true;
            }

            var running = false;

            function onPlayerStateChange(event) {
                if (event.data == window.YT.PlayerState.PLAYING && !running) {

                    running = true;

                    player.seekTo(leftValue, true);

                    player.playVideo();

                    if (loopTimeout) {
                        clearTimeout(loopTimeout);
                    }

                    var time = (rightValue - leftValue) * 1000;

                    loopTimeout = setTimeout(function () {
                        running = false;
                        player.stopVideo();
                        player.seekTo(leftValue, true);
                        player.playVideo();

                    }, time);

                }
            }
        }
    }

    startLoop();

    return (
        <div style={{ 'text-align': "center" }}>
            <h1>Video Loop Tool</h1>
            <div style={{ display: 'block' }}>
                <div id="player"></div>
            </div>
            <div style={{ display: 'block' }}>
                <p>
                    Run setup first when changing the video id, then hit play. You can change the range on the slider below to loop a specific part of the video. Then hit play on the youtube video.
                </p>
                <Button variant="contained" color="primary" onClick={() => { startLoop() }}>
                    Setup
                </Button>
            </div>
            <div style={{ display: 'block' }}>
                <TextField id="standard-basic" label="YouTube VideoID" defaultValue={videoId} style={{ width: "600px" }} onChange={handleChange.bind(this)} />
            </div>
            <div style={{ display: 'block' }}>
                <div id="slider-range" style={{ width: "640px", margin: '12px auto' }}></div>
            </div>
        </div>
    );
};