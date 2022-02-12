import { Component } from "react";
import { Playlist } from "./playlist.model";
import { Prompt } from "react-router";
import * as H from 'history';
import { Video } from "./video.model";
import { Button, Card, CardContent, MenuItem, Select, TextField } from "@mui/material";

require('jquery-ui/ui/widgets/slider');

export interface PlaylistProps {
}

export interface PlaylistState {
    playlists: Playlist[];
    selectedPlaylist: number | undefined;
}

class Playlists extends Component<PlaylistProps, PlaylistState> {

    state: PlaylistState;

    constructor(props: PlaylistProps) {
        super(props);

        const storedPlaylists = localStorage.getItem("Playlists");

        let playlists = storedPlaylists !== null ? JSON.parse(storedPlaylists) : [];

        let selectedPlaylist = undefined;

        // show the first playlist if there are any
        if (playlists.length > 0) {
            selectedPlaylist = 0;
        }

        this.state = {
            playlists: playlists,
            selectedPlaylist: selectedPlaylist
        };
    }

    componentDidMount() {
        window.onbeforeunload = () => {

            // save on page refresh
            this.saveChanges();

            return '';
        };
    }

    componentWillUnmount() {
        window.onbeforeunload = null;
    }

    addPlaylist(): void {

        let playlist = {
            Id: this.state.playlists.length > 0 ? Math.max.apply(Math, this.state.playlists.map((p) => { return p.Id })) + 1 : 1,
            Name: '',
            Videos: []
        };

        let newPlaylists = [...this.state.playlists];

        newPlaylists.push(playlist);

        this.setState({
            playlists: newPlaylists,
            selectedPlaylist: newPlaylists.length - 1 // move to the new playlist
        });
    }

    removePlaylist(playlistId: number): void {
        let newPlaylists = [...this.state.playlists];
        newPlaylists = newPlaylists.filter(p => p.Id !== playlistId);

        let playlist = this.state.playlists[this.state.selectedPlaylist!];

        // if  you're on the playlist, remove the state and show empty
        let removeState = playlist.Id === playlistId;

        this.setState({
            playlists: newPlaylists,
            selectedPlaylist: removeState ? undefined : this.state.selectedPlaylist
        });
    }

    addVideo(playlistId: number): void {
        const newPlaylists = [...this.state.playlists];
        let selectedPlaylist = newPlaylists.filter((p) => p.Id === playlistId)[0];

        selectedPlaylist.Videos.push({
            Id: selectedPlaylist.Videos.length > 0 ? Math.max.apply(Math, selectedPlaylist.Videos.map((v) => { return v.Id })) + 1 : 1,
            Name: '',
            VideoId: '',
            StartTime: 0,
            EndTime: 0
        });

        this.setState({
            playlists: newPlaylists
        });
    }

    removeVideo(playlistId: number, videoId: number): void {
        const newPlaylists = [...this.state.playlists];

        let selectedPlaylist = newPlaylists.filter((p) => p.Id === playlistId)[0];

        selectedPlaylist.Videos = selectedPlaylist.Videos.filter(v => v.Id !== videoId);

        this.setState({
            playlists: newPlaylists
        });
    }

    handlePlaylistChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, propertyName: string): void {
        const newPlaylists = [...this.state.playlists];

        newPlaylists[index][propertyName] = e.target.value;

        this.setState({
            playlists: newPlaylists
        });
    }

    handleVideoChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, playlistIndex: number, videoIndex: number, propertyName: string): void {
        const newPlaylists = [...this.state.playlists];

        newPlaylists[playlistIndex].Videos[videoIndex][propertyName] = e.target.value;

        this.setState({
            playlists: newPlaylists
        });
    }

    saveChanges(): void {
        localStorage.setItem("Playlists", JSON.stringify(this.state.playlists));
    }

    handlePlaylistDropdownChange(e: any): void {

        // save automatically when changing drop down
        this.saveChanges();

        this.setState({
            selectedPlaylist: parseInt(e.target.value)
        });
    }

    promptMessageCallback(location: H.Location, action: H.Action): string | boolean {
        // save when navigating away
        this.saveChanges();

        // good to transition after
        return true;
    }

    nameof<T>(obj: T, expression: Function): string {
        const res: any = {};

        Object.keys(obj).map(k => res[k] = () => k);

        let result = expression(res)();

        return result;
    }

    render() {

        let element: JSX.Element | undefined = undefined;

        if (this.state.selectedPlaylist !== undefined) {
            let playlist = this.state.playlists[this.state.selectedPlaylist];
            let playlistIndex = this.state.selectedPlaylist;
            element = (
                <Card variant="outlined" style={{ margin: '12px', padding: '0 !important' }} key={playlist.Id}>
                    <CardContent style={{ padding: '0 !important' }}>
                        <div>
                            {/*<p><strong>Playlist #{playlistIndex + 1}</strong></p>*/}
                            <TextField id="standard-basic" label="Playlist Name" defaultValue={playlist?.Name} onChange={e => this.handlePlaylistChange(e, playlistIndex, this.nameof(playlist, (p: Playlist) => p.Name))} style={{ width: "400px", "marginRight": "12px" }} />
                            <Button variant="contained" color="primary" onClick={() => { this.addVideo(playlist.Id) }} style={{ 'marginTop': "12px", "marginRight": '12px' }}>
                                Add Video
                            </Button>
                            <Button variant="contained" color="secondary" onClick={() => { this.removePlaylist(playlist.Id) }} style={{ 'marginTop': "12px" }}>
                                Remove Playlist
                            </Button>
                            {
                                playlist.Videos.map((video, videoIndex) => {
                                    return (
                                        <Card className="changeColor" variant="outlined" style={{ "margin": "12px" }} key={video.Id}>
                                            <CardContent>
                                                <div style={{display: 'flex', flexWrap: 'wrap' }}>
                                                    {/*<p><strong>Playlist #{playlistIndex + 1} Video #{videoIndex + 1}</strong></p>*/}
                                                    <img src={"https://img.youtube.com/vi/" + video.VideoId + "/hqdefault.jpg"} style={{ width: '80x', height: '45px', "marginRight": "12px", marginBottom: '12px' }} />
                                                    <TextField id="standard-basic" label="Video Name" defaultValue={video.Name} onChange={e => this.handleVideoChange(e, playlistIndex, videoIndex, this.nameof(video, (v: Video) => v.Name))} style={{ "width": "200px", "marginRight": "12px", marginBottom: '12px' }} />
                                                    <TextField id="standard-basic" label="Video VideoId" defaultValue={video.VideoId} onChange={e => this.handleVideoChange(e, playlistIndex, videoIndex, this.nameof(video, (v: Video) => v.VideoId))} style={{ "width": "200px", "marginRight": "12px", marginBottom: '12px' }} />
                                                    <TextField id="standard-basic" label="Video StartTime" defaultValue={video.StartTime} onChange={e => this.handleVideoChange(e, playlistIndex, videoIndex, this.nameof(video, (v: Video) => v.StartTime))} style={{ "width": "200px", "marginRight": "12px", marginBottom: '12px' }} />
                                                    <TextField id="standard-basic" label="Video EndTime" defaultValue={video.EndTime} onChange={e => this.handleVideoChange(e, playlistIndex, videoIndex, this.nameof(video, (v: Video) =>  v.EndTime))} style={{ "width": "200px", "marginRight": "12px", marginBottom: '12px' }} />
                                                    <div style={{ alignSelf: 'center' }}>
                                                        <Button variant="contained" color="secondary" onClick={() => { this.removeVideo(playlist.Id, video.Id) }}>
                                                            Remove Video
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            }
                        </div>
                    </CardContent>
                </Card>
            );
        }

        return (
            <div>
                <Prompt
                    when={true}
                    message={(location, action) => this.promptMessageCallback(location, action)}
                />
                <Card variant="outlined" style={{ margin: '12px' }}>
                    <CardContent>

                        <h2>Playlists</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>

                        </div>
                        <Select
                            label="Playlists"
                            displayEmpty
                            renderValue={this.state.selectedPlaylist !== undefined ? () => this.state.playlists[this.state.selectedPlaylist!].Name : () => 'Playlists'}
                            defaultValue="Playlists"
                            onChange={e => this.handlePlaylistDropdownChange(e)}
                            style={{ marginRight: '24px', 'minWidth': '200px' }}
                        >
                            {
                                this.state.playlists.map((playlist, playlistIndex) => {
                                    return (
                                        <MenuItem key={playlist.Id} value={playlistIndex}>#{playlist.Id}: {playlist.Name}</MenuItem>
                                    );
                                })
                            }
                        </Select>
                        <Button variant="contained" color="primary" onClick={() => { this.addPlaylist() }} style={{ marginRight: '12px' }}>
                            Add New Playlist
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => { this.saveChanges() }} style={{ marginRight: '12px' }}>
                            Save Changes
                        </Button>
                    </CardContent>
                </Card>
                {/* Template for each playlist */}
                {element}
            </div>
        );
    };
};

export default Playlists;