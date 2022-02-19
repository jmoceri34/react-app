import $, { isNumeric } from 'jquery';
import { Component } from 'react';
import { Playlist } from '../playlists/playlist.model';
import { Video } from '../playlists/video.model';
import Slider from '@mui/material/Slider';
import { Button, Card, CardContent, Checkbox, FormControlLabel, FormGroup, MenuItem, Paper, Select, styled, TextField } from '@mui/material';
import DOMPurify from 'dompurify';
import './video-loop-tool.css';

export interface VideoLoopToolProps {

}

export interface VideoLoopToolState {
    videoId: string;
    selectedPlaylist: number | undefined;
    sliderValues: number[];
    playThroughPlaylist: boolean;
}


const VideoSlider = styled(Slider)(({ theme }) => ({
    '& .MuiSlider-thumb': {
        height: 36,
        width: 36,
    },
    '& .MuiSlider-rail': {
        height: 12, 
    },
    '& .MuiSlider-track': {
        height: 14,
    },
}));

export default class VideoLoopTool extends Component<VideoLoopToolProps, VideoLoopToolState> {

    state: VideoLoopToolState;

    changingVideo: boolean;
    player: YT.Player | undefined;
    startTimeHandle: JQuery<any> | undefined;
    endTimeHandle: JQuery<any> | undefined;

    startTimeValue: number;
    endTimeValue: number;
    sliderMaxValue: number;

    loopTimeout: NodeJS.Timer | undefined;

    urlParameters: URLSearchParams;
    queryStartTime: string | null;
    queryEndTime: string | null;

    playlists: Playlist[];

    constructor(props: VideoLoopToolProps) {
        super(props);

        this.startTimeValue = 0;
        this.endTimeValue = 0;
        this.sliderMaxValue = 0;

        // get the query string parameters if any
        this.urlParameters = new URLSearchParams(window.location.search);

        const storedPlaylists = localStorage.getItem("Playlists");

        this.playlists = storedPlaylists !== null ? JSON.parse(storedPlaylists) : [];

        let selectedPlaylist : number | undefined = undefined;

        // show the first playlist if there are any
        if (this.playlists.length > 0) {
            selectedPlaylist = 0;
        }

        this.state = {
            videoId: this.urlParameters.get("v")!,
            selectedPlaylist: selectedPlaylist,
            sliderValues: [0, 0],
            playThroughPlaylist: false,
        }

        this.changingVideo = false;
        this.queryStartTime = this.urlParameters.get("s");
        this.queryEndTime = this.urlParameters.get("e");

        if (!isNumeric(this.queryStartTime)) {
            this.queryStartTime = '0';
        }

        if (!isNumeric(this.queryEndTime)) {
            this.queryEndTime = '0';
        }

        if (this.state && this.state.videoId) {
            setTimeout(() => {
                if (selectedPlaylist !== undefined) {
                    let video = this.playlists[selectedPlaylist!].Videos.filter(v => v.VideoId == this.state.videoId)[0];

                    if (video !== undefined) {
                        this.selectVideo(video);
                    }
                    else {
                        this.startLoop();
                    }
                }
                else {
                    this.startLoop();
                }
            }, 1000);
        }
    }

    // keep track when the user enters a new video id
    handleChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        this.setState({
            videoId: e.target.value
        });
    }

    startLoopInternal(): void {
        // set the query video id
        this.urlParameters.set("v", this.state.videoId);

        // if the player already exists, load the video
        if (this.player) {

            // clear the timeout
            if (this.loopTimeout) {
                clearTimeout(this.loopTimeout);
            }

            // load the new video
            this.player.loadVideoById(this.state.videoId);

            // setup the player with the new values
            this.setupVideoPlayer();

            // return early
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

    startLoop(): void {
        if (this.state.selectedPlaylist !== undefined) {
            let video = this.playlists[this.state.selectedPlaylist].Videos.filter(v => v.VideoId == this.state.videoId)[0];

            if (video !== undefined && video.Delay > 0) {
                if (this.player) {
                    this.player.stopVideo();
                }
                setTimeout(() => {
                    this.startLoopInternal();
                }, video.Delay * 1000);
            }
            else {
                this.startLoopInternal();
            }
        }
        else {
            this.startLoopInternal();
        }
    }

    createSlider(min: number, max: number): void {

        let newSlider = $(".videoSlider")[0] as any;
        let newLeftHandle = $(newSlider.children[newSlider.children.length - 2]);
        let newRightHandle = $(newSlider.children[newSlider.children.length - 1]);

        if (newLeftHandle.children("#videoSliderTime").length > 0) {
            newLeftHandle.children("#videoSliderTime").remove();
        }

        if (newRightHandle.children("#videoSliderTime").length > 0) {
            newRightHandle.children("#videoSliderTime").remove();
        }

        min = min < 0 ? 0 : min;

        this.startTimeHandle = newLeftHandle.prepend(this.wrap(min, true, true));
        this.endTimeHandle = newRightHandle.prepend(this.wrap(max, true, false));

        this.startTimeValue = min;
        this.endTimeValue = max;

        // update the query string when creating the slider
        this.urlParameters.set("s", this.startTimeValue.toString());
        this.urlParameters.set("e", this.endTimeValue.toString());

        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + this.urlParameters.toString();
        window.history.pushState({ path: newurl }, '', newurl);

        this.setState({
            sliderValues: [this.startTimeValue, this.endTimeValue]
        });
    }

    sliderMoved(startTime: any, endTime: any): void {

        this.startTimeValue = startTime;
        this.endTimeValue = endTime;

        if (this.startTimeHandle) {
            this.startTimeHandle[0].children[0].textContent = new Date(this.startTimeValue * 1000).toISOString().substr(11, 8);
            // update the query string parameter
            this.urlParameters.set("s", this.startTimeValue.toString());
        }

        if (this.endTimeHandle) {
            this.endTimeHandle[0].children[0].textContent = new Date(this.endTimeValue * 1000).toISOString().substr(11, 8);
            // update the query string parameter
            this.urlParameters.set("e", this.endTimeValue.toString());
        }

        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + this.urlParameters.toString();

        window.history.pushState({ path: newurl }, '', newurl);

        if (this.player!.getCurrentTime() < this.startTimeValue || this.player!.getCurrentTime() > this.endTimeValue) {
            this.player!.seekTo(this.startTimeValue, true);
        }
    }

    wrap(value: number, format: boolean, left: boolean): string {
        let result: string = value.toString();
        if (format) {
            result = new Date(value * 1000).toISOString().substr(11, 8);
        }
        var px = left ? "-13px" : "57px";
        return DOMPurify.sanitize('<span id="videoSliderTime" style="color: #000 !important; font-family: Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; position: absolute !important; bottom: -50px; left: ' + px + ';">' + result + '</span>');
    }

    delay(milliseconds: number): Promise<unknown> {
        const result = new Promise<unknown>(result => setTimeout(result, milliseconds));

        return result;
    }

    async getDuration(): Promise<number> {
        if (!this.player) {
            return await 0;
        }

        let duration = this.player.getDuration();

        while (!duration || duration === 0) {
            duration = this.player.getDuration();
            await this.delay(500);
        }

        return duration;
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
            width: '100%',
            videoId: videoId,
            events: {
                'onReady': (e: any) => this.playerOnReady(e),
                'onStateChange': (e: any) => this.playerOnStateChange(e)
            }
        });
    }

    playerOnReady(e: any): void {
        this.setupVideoPlayer();
    }

    setupVideoPlayer(): void {

        // duration can be accessed when it's playing, mute it first
        this.player!.mute();
        // timeout to wait for duration
        setTimeout(async () => {

            // get the duration
            var duration = await this.getDuration();

            var left = parseInt(this.queryStartTime!) || 0;
            var right = parseInt(this.queryEndTime!) || duration;

            this.sliderMaxValue = duration;

            this.createSlider(left, right);

            // unmute it and play at the start time
            this.player!.unMute();

            this.player!.seekTo(this.startTimeValue, true);
        });
    }

    playerOnStateChange(event: any): void {
        if (event.data == (window as any).YT.PlayerState.PLAYING) {

            if (this.player && this.player.getCurrentTime() < this.startTimeValue) {
                this.player.seekTo(this.startTimeValue, true);
            }

            this.loopTimeout = setInterval(() => {

                if (!this.player!.getCurrentTime) {
                    return;
                }

                var currentTime = this.player!.getCurrentTime();

                // nothing to check
                if (currentTime < this.endTimeValue) {
                    return;
                }

                if (this.changingVideo) {
                    return;
                }

                if (this.state.playThroughPlaylist) {

                    this.changingVideo = true;

                    let videos = this.playlists[this.state.selectedPlaylist!].Videos;
                    let nextVideo: Video | undefined = undefined;

                    for (let i = 0; i < videos.length; i++) {
                        if (videos[i].VideoId == this.state.videoId) {
                            if (i == videos.length - 1) {
                                nextVideo = videos[0];
                            }
                            else {
                                nextVideo = videos[i + 1];
                            }

                            break;
                        }
                    }

                    // found the next video, skip ahead to it
                    if (nextVideo !== undefined) {
                        this.selectVideo(nextVideo!);
                    }
                    // video doesn't exist on playlist
                    else {
                        this.player!.seekTo(this.startTimeValue, true);
                    }

                    setTimeout(() => {
                        this.changingVideo = false;
                    }, 1000);
                }
                // repeat if it's not checked
                else {
                    this.player!.seekTo(this.startTimeValue, true);
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

            this.player!.seekTo(this.startTimeValue, true);
        }
    }

    selectVideo(video: Video): void {
        this.queryStartTime = video.StartTime.toString();
        this.queryEndTime = video.EndTime.toString();

        let e = document.getElementById('video-' + video.Id);

        e?.scrollIntoView({
            behavior: "smooth",
            block: 'center',
            inline: 'center'
        });

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

    handleSliderChange(e: Event, newValue: number | number[]): void {

        let v = newValue as number[];

        this.sliderMoved(v[0], v[1]);

        this.setState({
            sliderValues: v
        });
    }

    handlePlayThroughPlaylistChange(e: React.ChangeEvent<HTMLInputElement>, checked: boolean): void {
        this.setState({
            playThroughPlaylist: checked
        });
    }

    render() {
        let playlistVideoHtml: JSX.Element[] = [];
        if (this.state.selectedPlaylist !== undefined) {
            playlistVideoHtml = this.playlists[this.state.selectedPlaylist!].Videos.map((video, videoIndex) => {
                return (
                    <Card key={video.Id} variant="outlined" style={{ margin: '12px', padding: '0 !important', background: video.VideoId === this.state.videoId ? '#ccc' : '#fff' }} id={'video-' + video.Id}>
                            <CardContent key={video.Id} style={{ paddingBottom: '0 !important' }}>
                                <div key={video.Id} style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {video.VideoId === this.state.videoId && (
                                    <h6 style={{flex: '0 0 100%'}}>Currently playing</h6>
                                    )}
                                <img src={"https://img.youtube.com/vi/" + video.VideoId + "/hqdefault.jpg"} style={{ width: '80x', height: '45px', "marginRight": "12px", paddingBottom: '12px' }} />

                                    <div style={{ alignSelf: 'center' }} key={video.Id}>
                                    <Button variant="contained" color="primary" onClick={(e) => { this.selectVideo(video) }} style={{ "marginRight": "12px" }}>
                                        Select
                                    </Button>
                                </div>
                                <p>{video.Name} ({video.StartTime}s - {video.EndTime}s)</p>
                            </div>
                        </CardContent>
                    </Card>
                );
            });
        }

        return (
            <Card variant="outlined" style={{ margin: '12px', padding: '0 !important', 'minHeight': '950px' }}>
                <CardContent style={{ padding: '0 !important' }}>
                    <div style={{ 'textAlign': "left", 'margin': '0 auto', display: 'flex' }} className="outerContainer">
                        <div className="playlistsContainer">
                            <div style={{ display: 'block', 'textAlign': 'left' }}>
                                <div>
                                    <h1>Playlists</h1>
                                    <Select
                                        label="Playlists"
                                        displayEmpty
                                        renderValue={this.state.selectedPlaylist !== undefined ? () => this.playlists[this.state.selectedPlaylist!].Name : () => 'Playlists'}
                                        defaultValue="Playlists"
                                        onChange={e => this.handlePlaylistDropdownChange(e)}
                                        style={{ 'minWidth': '200px'}}>
                                        {
                                            this.playlists.map((playlist, playlistIndex) => {
                                                return (
                                                    <MenuItem key={playlist.Id} value={playlistIndex}>#{playlist.Id}: {playlist.Name}</MenuItem>
                                                );
                                            })
                                        }
                                    </Select>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox defaultChecked={false} onChange={(e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => this.handlePlayThroughPlaylistChange(e, checked)} />} label="Play through Playlist" />
                                    </FormGroup>
                                    <Paper style={{ maxHeight: '500px', overflow: 'auto', marginTop: '12px' }}>
                                        {
                                            playlistVideoHtml.map(element => {
                                                return element;
                                            })
                                        }
                                    </Paper>
                                </div>
                            </div>
                        </div>
                        <div style={{ width: '100%', marginLeft: '42px', marginRight: '96px'}}>
                            <h1>Video Loop Tool</h1>
                            <div style={{ display: 'flex', marginBottom: '12px' }}>
                                <Button variant="contained" color="primary" onClick={() => { this.startLoop() }} style={{ 'marginTop': "12px", 'marginRight': '12px' }}>
                                    Setup
                                </Button>
                                <TextField id="standard-basic" label="YouTube VideoID" value={this.state ? this.state.videoId || '' : ''} style={{ width: "200px" }} onChange={e => this.handleChange(e)} />
                            </div>
                            <div className="auto-resizable-iframe" style={{display: this.player ? 'block' : 'none'}}>
                                <div className="playerWrapper">
                                    <div id="player"></div>
                                </div>
                                <div style={{ display: 'flex', marginTop: '36px', maxWidth: '100%' }}>
                                    <VideoSlider
                                        value={this.state.sliderValues}
                                        valueLabelFormat={(v) => v + 's'}
                                        onChange={(e: Event, newValue: number | number[]) => this.handleSliderChange(e, newValue)}
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={this.sliderMaxValue}
                                        className={"videoSlider"}
                                    />
                                </div> 
                            </div>
                        </div>
                    </div>
                    </CardContent>
                </Card>
        );
    }
};