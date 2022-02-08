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

    state: PlaylistState;

    constructor(props: PlaylistProps) {
        super(props);

        const storedPlaylists = localStorage.getItem("Playlists");

        let playlists = storedPlaylists !== null ? JSON.parse(storedPlaylists) : [];

        this.state = {
            playlists: playlists,
            selectedPlaylist: undefined
        };
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

        let newPlaylists = [...this.state.playlists];

        newPlaylists.push(playlist);

        this.setState({
            playlists: newPlaylists
        });
    }

    removePlaylist(playlistId: string): void {
        let newPlaylists = [...this.state.playlists];
        newPlaylists = newPlaylists.filter(p => p.Id !== playlistId);

        this.setState({
            playlists: newPlaylists
        });
    }

    addVideo(playlistId: string): void {
        const newPlaylists = [...this.state.playlists];
        let selectedPlaylist = newPlaylists.filter((p) => p.Id === playlistId)[0];

        selectedPlaylist.Videos.push({
            Id: this.createUUID(),
            Name: '',
            VideoId: '',
            StartTime: 0,
            EndTime: 0
        });

        this.setState({
            playlists: newPlaylists
        });
    }

    removeVideo(playlistId: string, videoVideoId: string): void {
        const newPlaylists = [...this.state.playlists];

        let selectedPlaylist = newPlaylists.filter((p) => p.Id === playlistId)[0];

        selectedPlaylist.Videos = selectedPlaylist.Videos.filter(v => v.Id !== videoVideoId);

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

    render() {
        return (
            <div>
                <h2>Playlists</h2>
                <Button variant="contained" color="primary" onClick={() => { this.saveChanges() }} style={{ 'marginTop': "12px", display: "block" }}>
                    Save Changes
                </Button>
                <Button variant="contained" color="primary" onClick={() => { this.addPlaylist() }} style={{ 'marginTop': "12px", display: "block" }}>
                    Add Playlist
                </Button>
                {/* Template for each playlist */}
                {
                    (this.state.playlists).map((playlist, playlistIndex) => {
                        return (
                            <div style={{ border: "1px solid black", padding: "12px", margin: "12px" }} key={playlist.Id}>
                                <TextField id="standard-basic" label="Playlist Id" value={playlist.Id} style={{ "width": "600px", "marginRight": "12px" }} />
                                <TextField id="standard-basic" label="Playlist Name" defaultValue={playlist.Name} onChange={e => this.handlePlaylistChange(e, playlistIndex, "Name")} style={{ width: "600px", "marginRight": "12px" }} />
                                <br />
                                <br />
                                <Button variant="contained" color="primary" onClick={() => { this.addVideo(playlist.Id) }} style={{ 'marginTop': "12px", display: "block" }}>
                                    Add Video
                                </Button>
                                {
                                    playlist.Videos.map((video, videoIndex) => {
                                        return (
                                            <div style={{ border: "1px solid black", margin: "12px", padding: "12px" }} key={video.Id}>
                                                <TextField id="standard-basic" label="Video Id" value={video.Id} style={{ "width": "600px", "marginRight": "12px" }} />
                                                <TextField id="standard-basic" label="Video Name" defaultValue={video.Name} onChange={e => this.handleVideoChange(e, playlistIndex, videoIndex, "Name")} style={{ "width": "600px", "marginRight": "12px" }} />
                                                <TextField id="standard-basic" label="Video VideoId" defaultValue={video.VideoId} onChange={e => this.handleVideoChange(e, playlistIndex, videoIndex, "VideoId")} style={{ "width": "600px", "marginRight": "12px" }} />
                                                <TextField id="standard-basic" label="Video StartTime" defaultValue={video.StartTime} onChange={e => this.handleVideoChange(e, playlistIndex, videoIndex, "StartTime")} style={{ "width": "600px", "marginRight": "12px" }} />
                                                <TextField id="standard-basic" label="Video EndTime" defaultValue={video.EndTime} onChange={e => this.handleVideoChange(e, playlistIndex, videoIndex, "EndTime")} style={{ "width": "600px", "marginRight": "12px" }} />
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