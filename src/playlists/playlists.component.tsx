import { Button, Card, CardContent, MenuItem, Select, TextField } from "@material-ui/core";
import { Component } from "react";
import { Playlist } from "./playlist.model";
import { Prompt } from "react-router";
import * as H from 'history';

require('jquery-ui/ui/widgets/slider');

export interface PlaylistProps {
}

export interface PlaylistState {
    playlists: Playlist[];
    selectedPlaylist: number | undefined;
}

class Playlists extends Component<PlaylistProps, PlaylistState> {

    state: PlaylistState;
    unsavedChanges: boolean;

    constructor(props: PlaylistProps) {
        super(props);

        const storedPlaylists = localStorage.getItem("Playlists");

        let playlists = storedPlaylists !== null ? JSON.parse(storedPlaylists) : [];

        this.state = {
            playlists: playlists,
            selectedPlaylist: undefined
        };

        this.unsavedChanges = true;
    }

    addPlaylist(): void {

        let playlist = {
            Id: this.state.playlists.length + 1,
            Name: '',
            Videos: []
        };

        let newPlaylists = [...this.state.playlists];

        newPlaylists.push(playlist);

        this.setState({
            playlists: newPlaylists,
            selectedPlaylist: playlist.Id - 1 // move to the new playlist
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
            Id: selectedPlaylist.Videos.length + 1,
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
                            <TextField id="standard-basic" label="Playlist Name" defaultValue={playlist?.Name} onChange={e => this.handlePlaylistChange(e, playlistIndex, "Name")} style={{ width: "400px", "marginRight": "12px" }} />
                            <Button variant="contained" color="primary" onClick={() => { this.addVideo(playlist.Id) }} style={{ 'marginTop': "12px", "marginRight": '12px' }}>
                                Add Video
                            </Button>
                            <Button variant="contained" color="secondary" onClick={() => { this.removePlaylist(playlist.Id) }} style={{ 'marginTop': "12px" }}>
                                Remove Playlist
                            </Button>
                            {
                                playlist.Videos.map((video, videoIndex) => {
                                    return (
                                        <Card variant="outlined" style={{ "margin": "12px" }} key={video.Id}>
                                            <CardContent>
                                                <div>
                                                    {/*<p><strong>Playlist #{playlistIndex + 1} Video #{videoIndex + 1}</strong></p>*/}
                                                    <TextField id="standard-basic" label="Video Name" defaultValue={video.Name} onChange={e => this.handleVideoChange(e, playlistIndex, videoIndex, "Name")} style={{ "width": "200px", "marginRight": "12px", marginBottom: '12px' }} />
                                                    <TextField id="standard-basic" label="Video VideoId" defaultValue={video.VideoId} onChange={e => this.handleVideoChange(e, playlistIndex, videoIndex, "VideoId")} style={{ "width": "200px", "marginRight": "12px", marginBottom: '12px' }} />
                                                    <TextField id="standard-basic" label="Video StartTime" defaultValue={video.StartTime} onChange={e => this.handleVideoChange(e, playlistIndex, videoIndex, "StartTime")} style={{ "width": "200px", "marginRight": "12px", marginBottom: '12px' }} />
                                                    <TextField id="standard-basic" label="Video EndTime" defaultValue={video.EndTime} onChange={e => this.handleVideoChange(e, playlistIndex, videoIndex, "EndTime")} style={{ "width": "200px", "marginRight": "12px", marginBottom: '12px' }} />
                                                    <Button variant="contained" color="secondary" onClick={() => { this.removeVideo(playlist.Id, video.Id) }} style={{ 'marginTop': "12px" }}>
                                                        Remove Video
                                                    </Button>
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
                    when={this.unsavedChanges}
                    message={(location, action) => this.promptMessageCallback(location, action)}
                />
                <Card style={{ margin: '12px', padding: '0 !important' }}>
                    <CardContent style={{ padding: '0 !important' }}>

                        <h2>Playlists</h2>
                        <Select
                            label="Playlists"
                            displayEmpty
                            renderValue={this.state.selectedPlaylist !== undefined ? undefined : () => 'Playlists'}
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
                        <Button variant="contained" color="primary" onClick={() => { this.addPlaylist() }} style={{ 'marginTop': "12px", marginRight: '12px' }}>
                            Add New Playlist
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => { this.saveChanges() }} style={{ 'marginTop': "12px", marginRight: '12px' }}>
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