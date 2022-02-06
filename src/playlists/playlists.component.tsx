import { Button, TextField } from "@material-ui/core";
import { Component } from "react";
import { Playlist } from "./playlist.model";

require('jquery-ui/ui/widgets/slider');

export interface PlaylistProps {

}

export interface PlaylistState {
    playlists: Playlist[];
    selectedPlaylist: Playlist | undefined;
}

export default class Playlists extends Component<PlaylistProps, PlaylistState> {

    state: PlaylistState = {
        playlists: [],
        selectedPlaylist: undefined
    };

    constructor(props: PlaylistProps) {
        super(props);

        this.setState({
            playlists: [],
            selectedPlaylist: undefined
        });
    }

    // https://www.tutorialspoint.com/how-to-create-guid-uuid-in-javascript
    createUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    addPlaylist(): void {

        let playlist = {
            Id: this.createUUID(),
            Name: '',
            Videos: []
        };

        let playlists = this.state.playlists;

        playlists.push(playlist);

        this.setState({
            ...this.state,
            playlists: playlists
        });
    }

    removePlaylist(playlistId: string): void {
        let playlists = this.state.playlists;
        playlists = playlists.filter(p => p.Id !== playlistId);

        this.setState({
            ...this.state,
            playlists: playlists
        });
    }

    addVideo(playlistId: string): void {
        let selectedPlaylist = this.state.playlists.filter((p) => p.Id === playlistId)[0];

        selectedPlaylist.Videos.push({
            Id: this.createUUID(),
            Name: '',
            VideoId: '',
            StartTime: 0,
            EndTime: 0
        });

        this.setState({
            ...this.state
        });
    }

    removeVideo(playlistId: string, videoVideoId: string): void {
        let selectedPlaylist = this.state.playlists.filter((p) => p.Id === playlistId)[0];

        selectedPlaylist.Videos = selectedPlaylist.Videos.filter(v => v.Id !== videoVideoId);

        this.setState({
            ...this.state
        });
    }

    render() {
        return (
            <div>
                <h2>Playlists</h2>
                <Button variant="contained" color="primary" onClick={() => { this.addPlaylist() }} style={{ 'marginTop': "12px", display: "block" }}>
                    Add Playlist
                </Button>
                {/* Template for each playlist */}
                {
                    (this.state.playlists).map((playlist) => {
                        return (
                            <div style={{ border: "1px solid black", padding: "12px", margin: "12px" }} key={playlist.Id}>
                                <TextField id="standard-basic" label="Playlist Id" style={{ "width": "600px", "marginRight": "12px" }} />
                                <TextField id="standard-basic" label="Playlist Name" style={{ width: "600px", "marginRight": "12px" }} />
                                <br />
                                <br />
                                <Button variant="contained" color="primary" onClick={() => { this.addVideo(playlist.Id) }} style={{ 'marginTop': "12px", display: "block" }}>
                                    Add Video
                                </Button>
                                {
                                    playlist.Videos.map((video) => {
                                        return (
                                            <div style={{ border: "1px solid black", margin: "12px" }} key={video.Id}>
                                                <TextField id="standard-basic" label="Video Id" style={{ "width": "600px", "marginRight": "12px" }} />
                                                <TextField id="standard-basic" label="Video Name" style={{ "width": "600px", "marginRight": "12px" }} />
                                                <TextField id="standard-basic" label="Video VideoId" style={{ "width": "600px", "marginRight": "12px" }} />
                                                <TextField id="standard-basic" label="Video StartTime" style={{ "width": "600px", "marginRight": "12px" }} />
                                                <TextField id="standard-basic" label="Video EndTime" style={{ "width": "600px", "marginRight": "12px" }} />
                                                <br />
                                                <br />
                                                <Button variant="contained" color="secondary" onClick={() => { this.removeVideo(playlist.Id, video.Id) }} style={{ 'marginTop': "12px", display: "block" }}>
                                                    Remove Video
                                                </Button>
                                            </div>
                                        );
                                    })
                                }
                                <Button variant="contained" color="secondary" onClick={() => { this.removePlaylist(playlist.Id) }} style={{ 'marginTop': "12px", display: "block" }}>
                                    Remove Playlist
                                </Button>
                            </div>
                        );
                    })
                }
            </div>
        );
    };
};