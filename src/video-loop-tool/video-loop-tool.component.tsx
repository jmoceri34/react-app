import $ from 'jquery';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Component } from 'react';
import { Playlist } from '../playlists/playlist.model';
import { Video } from '../playlists/video.model';
import { Card, CardContent, MenuItem, Select } from '@material-ui/core';
require('jquery-ui/ui/widgets/slider');

export interface VideoLoopToolProps {

}

export interface VideoLoopToolState {
    videoId: string;
    selectedPlaylist: number | undefined;
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

        const storedPlaylists = localStorage.getItem("Playlists");

        this.playlists = storedPlaylists !== null ? JSON.parse(storedPlaylists) : [];

        let selectedPlaylist = undefined;

        // show the first playlist if there are any
        if (this.playlists.length > 0) {
            selectedPlaylist = 0;
        }

        this.state = {
            videoId: this.urlParameters.get("v")!,
            selectedPlaylist: selectedPlaylist
        }

        this.queryStartTime = this.urlParameters.get("s");
        this.queryEndTime = this.urlParameters.get("e");

        if (this.state && this.state.videoId) {
            this.startLoop();
        }
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

                var left = this.queryStartTime || 0;
                var right = this.queryEndTime || duration;

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
                this.sliderMoved(ui.values[0], ui.values[1]);
            }
        });

        $(slider[0].children[1]).empty();
        $(slider[0].children[2]).empty();

        this.leftHandle = $(slider[0].children[1]).prepend(this.wrap(min, true, true));
        this.rightHandle = $(slider[0].children[2]).prepend(this.wrap(max, true, false));

        this.leftValue = min;
        this.rightValue = max;

        // update the query string when creating the slider
        this.urlParameters.set("s", this.leftValue);
        this.urlParameters.set("e", this.rightValue);

        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + this.urlParameters.toString();
        window.history.pushState({ path: newurl }, '', newurl);
    }

    sliderMoved(startTime: any, endTime: any): void {

        this.leftValue = startTime;
        this.rightValue = endTime;

        if (this.leftHandle) {
            this.leftHandle[0].innerHTML = this.wrap(this.leftValue, true, true);
            // update the query string parameter
            this.urlParameters.set("s", this.leftValue);
        }

        if (this.rightHandle) {
            this.rightHandle[0].innerHTML = this.wrap(this.rightValue, true, false);
            // update the query string parameter
            this.urlParameters.set("e", this.rightValue);
        }

        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + this.urlParameters.toString();

        window.history.pushState({ path: newurl }, '', newurl);

        if (this.player.getCurrentTime() < this.leftValue || this.player.getCurrentTime() > this.rightValue) {
            this.player.seekTo(this.leftValue, true);
        }
    }

    wrap(value: any, format: boolean, left: boolean): string {
        if (format) {
            value = new Date(value * 1000).toISOString().substr(11, 8);
        }
        var px = left ? "-35px" : "35px";
        return '<span style="position: absolute !important; bottom: -50px; left: ' + px + '; color: #000 !important;">' + value + '</span>';
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

    selectVideo(video: Video): void {
        this.queryStartTime = video.StartTime;
        this.queryEndTime = video.EndTime;


        this.setState({
            videoId: video.VideoId
        }, () => {
            this.startLoop();
        });
    }

    handlePlaylistDropdownChange(e: any): void {
        this.setState({
            selectedPlaylist: parseInt(e.target.value)
        });
    }

    render() {
        let playlistVideoHtml: JSX.Element[] = [];
        if (this.state.selectedPlaylist !== undefined) {
            let elements = this.playlists[this.state.selectedPlaylist!].Videos.map((video, videoIndex) => {
                return (
                <Card variant="outlined" style={{ margin: '12px', padding: '0 !important' }}>
                    <CardContent style={{ paddingBottom: '0 !important' }}>
                        <div key={video.Id} style={{ display: 'flex', flexWrap: 'wrap'}}>
                            <img src={"https://img.youtube.com/vi/" + video.VideoId + "/hqdefault.jpg"} style={{ width: '80x', height: '45px', "marginRight": "12px" }} />

                            <div style={{ alignSelf: 'center' }}>
                                <Button variant="contained" color="primary" onClick={() => { this.selectVideo(video) }} style={{ "marginRight": "12px" }}>
                                    Select
                                </Button>
                            </div>
                            <p>{videoIndex + 1}: {video.Name} ({video.StartTime}s - {video.EndTime}s)</p>
                        </div>
                    </CardContent>
                </Card>
                );
            });

            for (var i = 0; i < elements.length; i++) {
                playlistVideoHtml.push(elements[i]);
            }
        }

        return (
            <Card variant="outlined" style={{ margin: '12px', padding: '0 !important', 'minHeight': '750px' }}>
                    <CardContent style={{ padding: '0 !important' }}>
                    <div style={{ 'textAlign': "left", 'margin': '0 auto', display: 'flex' }}>
                        <div>
                            <div style={{ display: 'block', 'textAlign': 'left', paddingRight: '36px' }}>
                                <div>
                                    <h1>Playlists</h1>
                                    <Select
                                        label="Playlists"
                                        displayEmpty
                                        renderValue={this.state.selectedPlaylist !== undefined ? () => this.playlists[this.state.selectedPlaylist!].Name : () => 'Playlists'}
                                        defaultValue="Playlists"
                                        onChange={e => this.handlePlaylistDropdownChange(e)}
                                        style={{ 'minWidth': '200px'}}
                                    >
                                        {
                                            this.playlists.map((playlist, playlistIndex) => {
                                                return (
                                                    <MenuItem key={playlist.Id} value={playlistIndex}>#{playlist.Id}: {playlist.Name}</MenuItem>
                                                );
                                            })
                                        }
                                    </Select>
                                    {
                                        playlistVideoHtml.map(element => {
                                            return element;
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div>
                            <h1>Video Loop Tool</h1>
                            <div style={{ display: 'flex' }}>
                                <Button variant="contained" color="primary" onClick={() => { this.startLoop() }} style={{ 'marginTop': "12px", 'marginRight': '12px' }}>
                                    Setup
                                </Button>
                                <TextField id="standard-basic" label="YouTube VideoID" value={this.state ? this.state.videoId || '' : ''} style={{ width: "200px" }} onChange={e => this.handleChange(e)} />
                            </div>
                            <div style={{ display: 'block' }}>
                                <div id="player"></div>
                            </div>
                            <div style={{ display: 'block' }}>

                            </div>
                            <div style={{ display: 'block' }}>
                                <div id="slider-range" style={{ width: "640px", margin: '12px auto' }}></div>
                            </div>
                        </div>
                    </div>
                    </CardContent>
                </Card>
        );
    }
};