import $ from 'jquery';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Component } from 'react';
import { Playlist } from '../playlists/playlist.model';
require('jquery-ui/ui/widgets/slider');

export interface VideoLoopToolProps {

}

export interface VideoLoopToolState {
    videoId: string;
}

export default class VideoLoopTool extends Component<VideoLoopToolProps, VideoLoopToolState> {

    state: VideoLoopToolState;

    player: any;
    leftHandle: any;
    rightHandle: any;
    leftValue: any;
    rightValue: any;
    loopTimeout: any;
    urlParameters: URLSearchParams;
    queryStartTime: any;
    queryEndTime: any;
    playlists: Playlist[];

    constructor(props: VideoLoopToolProps) {
        super(props);

        // get the query string parameters if any
        this.urlParameters = new URLSearchParams(window.location.search);

        this.state = {
            videoId: this.urlParameters.get("v")!
        }

        this.queryStartTime = this.urlParameters.get("s");
        this.queryEndTime = this.urlParameters.get("e");

        if (this.state && this.state.videoId) {
            this.startLoop();
        }

        const storedPlaylists = localStorage.getItem("Playlists");

        this.playlists = storedPlaylists !== null ? JSON.parse(storedPlaylists) : [];
    }

    // keep track when the user enters a new video id
    handleChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        this.setState({
            videoId: e.target.value
        });
    }

    startLoop(): void {

        // set the query video id
        this.urlParameters.set("v", this.state.videoId);

        // if the player already exists, load the video
        if (this.player) {
            this.player.loadVideoById(this.state.videoId);

            if (this.loopTimeout) {
                clearTimeout(this.loopTimeout);
            }

            setTimeout(() => {
                var duration = this.player.getDuration();

                var left = 0;
                var right = duration;

                this.createSlider(left, right);

                this.player.seekTo(this.leftValue, true);

            }, 500);

            return;
        }

        let w = (window as any);

        // if YT hasn't been downloaded yet
        if (!w.YT) {
            // set the call back to load the player once this global callback from youtube is executed
            w.onYouTubePlayerAPIReady = () => {
                this.loadPlayer(this.state.videoId);
            };

            // go and get the script in the meantime
            $.getScript('https://www.youtube.com/player_api');
        }
        // otherwise load the player
        else {
            this.loadPlayer(this.state.videoId);
        }
    }

    createSlider(min: number, max: number): void {

        var slider = ($("#slider-range") as any).slider({
            range: true,
            // this should always be 0 -> duration
            min: 0,
            max: this.player.getDuration(),
            values: [min, max],
            slide: (event: any, ui: any) => {

                this.leftValue = ui.values[0];
                this.rightValue = ui.values[1];

                if (this.leftHandle) {
                    this.leftHandle[0].innerHTML = wrap(this.leftValue, true, true);
                    // update the query string parameter
                    this.urlParameters.set("s", this.leftValue);
                }

                if (this.rightHandle) {
                    this.rightHandle[0].innerHTML = wrap(this.rightValue, true, false);
                    // update the query string parameter
                    this.urlParameters.set("e", this.rightValue);
                }

                var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + this.urlParameters.toString();

                window.history.pushState({ path: newurl }, '', newurl);

                if (this.player.getCurrentTime() < this.leftValue || this.player.getCurrentTime() > this.rightValue) {
                    this.player.seekTo(this.leftValue, true);
                }
            }
        });

        $(slider[0].children[1]).empty();
        $(slider[0].children[2]).empty();

        this.leftHandle = $(slider[0].children[1]).prepend(wrap(min, true, true));
        this.rightHandle = $(slider[0].children[2]).prepend(wrap(max, true, false));

        this.leftValue = min;
        this.rightValue = max;

        // update the query string when creating the slider
        this.urlParameters.set("s", this.leftValue);
        this.urlParameters.set("e", this.rightValue);

        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + this.urlParameters.toString();
        window.history.pushState({ path: newurl }, '', newurl);

        function wrap(value: any, format: boolean, left: boolean): string {
            if (format) {
                value = new Date(value * 1000).toISOString().substr(11, 8);
            }
            var px = left ? "-35px" : "35px";
            return '<span style="position: absolute !important; bottom: -50px; left: ' + px + '; color: #000 !important;">' + value + '</span>';
        }
    }

    loadPlayer(videoId: any): void {
        this.player = new (window as any).YT.Player('player', {
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
                'onReady': (e: any) => {
                    console.log(this);
                    var duration = this.player.getDuration();

                    var left = this.queryStartTime || 0;
                    var right = this.queryEndTime || duration;

                    this.createSlider(left, right);

                    this.player.seekTo(this.leftValue, true);
                },
                'onStateChange': (event: any) => {
                    if (event.data == (window as any).YT.PlayerState.PLAYING) {

                        if (this.player && this.player.getCurrentTime() < this.leftValue) {
                            this.player.seekTo(this.leftValue, true);
                        }

                        this.loopTimeout = setInterval(() => {
                            var currentTime = this.player.getCurrentTime();

                            if (currentTime >= this.rightValue) {
                                this.player.seekTo(this.leftValue, true);
                            }
                        }, 1000);
                    }
                    else if (event.data == (window as any).YT.PlayerState.PAUSED) {
                        if (this.loopTimeout) {
                            clearTimeout(this.loopTimeout);
                        }
                    }
                    else if (event.data == (window as any).YT.PlayerState.ENDED) {
                        if (this.loopTimeout) {
                            clearTimeout(this.loopTimeout);
                        }

                        this.player.seekTo(this.leftValue, true);
                    }
                }
            }
        });
    }

    render() {
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
                        <TextField id="standard-basic" label="YouTube VideoID" defaultValue={this.state ? this.state.videoId : null} style={{ width: "600px" }} onChange={e => this.handleChange(e)} />
                        <Button variant="contained" color="primary" onClick={() => { this.startLoop() }} style={{ 'marginTop': "12px" }}>
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
    }
};