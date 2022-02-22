import { Component } from "react";
import { Playlist } from "./playlist.model";
import { Prompt } from "react-router";
import * as H from 'history';
import { Video } from "./video.model";
import { Button, Card, CardContent, MenuItem, Paper, Select, TextField } from "@mui/material";
import { DragDropContext, Draggable, DragStart, DragUpdate, Droppable, DropResult, ResponderProvided } from "react-beautiful-dnd";
import DragHandleIcon from '@mui/icons-material/DragHandle';

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

        if (playlists.length === 0) {
            playlists = JSON.parse("[{\"Id\":1,\"Name\":\"AC⚡DC Fingerbreaker I\",\"Videos\":[{\"Id\":1,\"Name\":\"Jailbreak\",\"VideoId\":\"HRo2m6RYJpI\",\"StartTime\":\"20\",\"EndTime\":\"53\",\"Delay\":0},{\"Id\":2,\"Name\":\"Soul Stripper\",\"VideoId\":\"Sn6bfNFUSU0\",\"StartTime\":0,\"EndTime\":\"155\",\"Delay\":0},{\"Id\":3,\"Name\":\"Live Wire\",\"VideoId\":\"1gtLgAYCf5Y\",\"StartTime\":0,\"EndTime\":\"95\",\"Delay\":0},{\"Id\":4,\"Name\":\"Let There Be Rock\",\"VideoId\":\"OvJrJcVAQQs\",\"StartTime\":0,\"EndTime\":\"63\",\"Delay\":0},{\"Id\":5,\"Name\":\"Who Made Who\",\"VideoId\":\"PiZHNw1MtzI\",\"StartTime\":0,\"EndTime\":\"205\",\"Delay\":0},{\"Id\":6,\"Name\":\"Thunderstruck\",\"VideoId\":\"v2AC41dglnM\",\"StartTime\":\"36\",\"EndTime\":\"192\",\"Delay\":0},{\"Id\":7,\"Name\":\"Dirty Deeds Done Dirt Cheap\",\"VideoId\":\"UIE4UjBtx-o\",\"StartTime\":0,\"EndTime\":\"60\",\"Delay\":0},{\"Id\":8,\"Name\":\"Heatseeker\",\"VideoId\":\"VWG4-4Y6Z60\",\"StartTime\":0,\"EndTime\":\"75\",\"Delay\":0},{\"Id\":9,\"Name\":\"War Machine\",\"VideoId\":\"0W2kXsQ5ZYc\",\"StartTime\":0,\"EndTime\":\"53\",\"Delay\":0},{\"Id\":10,\"Name\":\"Riff Raff\",\"VideoId\":\"7S69xWkV4uM\",\"StartTime\":\"44\",\"EndTime\":\"121\",\"Delay\":0},{\"Id\":11,\"Name\":\"Shot Down In Flames\",\"VideoId\":\"UKwVvSleM6w\",\"StartTime\":\"15\",\"EndTime\":\"52\",\"Delay\":0},{\"Id\":12,\"Name\":\"If You Want Blood(You've Got It)\",\"VideoId\":\"6EWqTym2cQU\",\"StartTime\":\"35\",\"EndTime\":\"70\",\"Delay\":0},{\"Id\":13,\"Name\":\"Shoot To Thrill\",\"VideoId\":\"LIzPbnIp2QM\",\"StartTime\":\"12\",\"EndTime\":\"83\",\"Delay\":0},{\"Id\":14,\"Name\":\"Chase The Ace\",\"VideoId\":\"oYw-ZTLqIpg\",\"StartTime\":0,\"EndTime\":\"181\",\"Delay\":0}]}]");
        }

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

        // if you're on the playlist, remove the state and show empty
        let removeState = playlist.Id === playlistId;

        this.setState({
            playlists: newPlaylists,
            selectedPlaylist: removeState ? undefined : (this.state.selectedPlaylist! > newPlaylists.length - 1 ? newPlaylists.length - 1 : this.state.selectedPlaylist)
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
            EndTime: 0,
            Delay: 0
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

    onDragStart(initial: DragStart, provided: ResponderProvided): void {

    }

    onDragUpdate(initial: DragUpdate, provided: ResponderProvided): void {

    }

    onDragEnd(result: DropResult, provided: ResponderProvided): void {
        let playlists = [...this.state.playlists];

        // dropped outside the list
        if (result.destination) {
            const videos = this.reorder(
                this.state.playlists[this.state.selectedPlaylist!].Videos,
                result.source.index,
                result.destination.index
            );


            playlists[this.state.selectedPlaylist!].Videos = videos;
        }


        this.setState({
            playlists: playlists
        });
    }

    reorder(list: any[], startIndex: number, endIndex: number) {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    render() {

        let element: JSX.Element | undefined = undefined;

        if (this.state.selectedPlaylist !== undefined) {
            let playlist = this.state.playlists[this.state.selectedPlaylist];
            let playlistIndex = this.state.selectedPlaylist;
            element = (
                <Card variant="outlined" style={{ margin: '12px', padding: '0 !important' }} key={playlist.Id}>
                    <CardContent style={{ padding: '0 !important' }}>
                        <div>
                            <div style={{ marginBottom: '12px' }}>
                                <TextField id="standard-basic" label="Playlist Name" defaultValue={playlist?.Name} onChange={e => this.handlePlaylistChange(e, playlistIndex, this.nameof(playlist, (p: Playlist) => p.Name))} style={{ width: "400px", "marginRight": "12px" }} />
                                <Button variant="contained" color="primary" onClick={() => { this.addVideo(playlist.Id) }} style={{ 'marginTop': "12px", "marginRight": '12px' }}>
                                    Add Video
                                </Button>
                                <Button variant="contained" color="secondary" onClick={() => { this.removePlaylist(playlist.Id) }} style={{ 'marginTop': "12px" }}>
                                    Remove Playlist
                                </Button>
                            </div>
                            <DragDropContext
                                onDragStart={(initial: DragStart, provided: ResponderProvided) => this.onDragStart(initial, provided)}
                                onDragUpdate={(initial: DragUpdate, provided: ResponderProvided) => this.onDragUpdate(initial, provided)}
                                onDragEnd={(result: DropResult, provided: ResponderProvided) => this.onDragEnd(result, provided)}>
                                <Droppable droppableId="droppable">
                                    {(provided, snapshot) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                            {
                                                playlist.Videos.map((video, videoIndex) => {
                                                    return (
                                                        <Draggable key={video.Id} draggableId={video.Id.toString()} index={videoIndex}>
                                                            {
                                                                (provided, snapshot) => {
                                                                    return (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.draggableProps.style}
                                                                        >
                                                                            <Card variant="outlined" style={{ "padding": "12px", background: snapshot.isDragging ? 'lightgreen' : '#fff' }} key={video.Id}>
                                                                                <CardContent>
                                                                                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                                                        <Paper style={{ width: '24px', display: 'inline-block', height: '45px', marginRight: '12px' }} {...provided.dragHandleProps}>
                                                                                            <DragHandleIcon color="primary" style={{ height: '45px', maxHeight: '45px' }} />
                                                                                        </Paper>
                                                                                        <img alt={video.Name} src={"https://img.youtube.com/vi/" + video.VideoId + "/hqdefault.jpg"} style={{ width: '80x', height: '45px', "marginRight": "12px", marginBottom: '12px' }} />
                                                                                        <TextField id="standard-basic" label="Video Name" defaultValue={video.Name} onChange={e => this.handleVideoChange(e, playlistIndex, videoIndex, this.nameof(video, (v: Video) => v.Name))} style={{ "width": "200px", "marginRight": "12px", marginBottom: '12px' }} />
                                                                                        <TextField id="standard-basic" label="Video VideoId" defaultValue={video.VideoId} onChange={e => this.handleVideoChange(e, playlistIndex, videoIndex, this.nameof(video, (v: Video) => v.VideoId))} style={{ "width": "200px", "marginRight": "12px", marginBottom: '12px' }} />
                                                                                        <TextField type="number" inputProps={{ min: 0, inputMode: 'numeric', pattern: '[0-9]*' }} id="standard-basic" label="Video StartTime" defaultValue={video.StartTime} onChange={e => this.handleVideoChange(e, playlistIndex, videoIndex, this.nameof(video, (v: Video) => v.StartTime))} style={{ "width": "200px", "marginRight": "12px", marginBottom: '12px' }} />
                                                                                        <TextField type="number" inputProps={{ min: 0, inputMode: 'numeric', pattern: '[0-9]*' }} id="standard-basic" label="Video EndTime" defaultValue={video.EndTime} onChange={e => this.handleVideoChange(e, playlistIndex, videoIndex, this.nameof(video, (v: Video) => v.EndTime))} style={{ "width": "200px", "marginRight": "12px", marginBottom: '12px' }} />
                                                                                        <TextField type="number" inputProps={{ min: 0, inputMode: 'numeric', pattern: '[0-9]*' }} id="standard-basic" label="Video Delay" defaultValue={video.Delay} onChange={e => this.handleVideoChange(e, playlistIndex, videoIndex, this.nameof(video, (v: Video) => v.Delay))} style={{ "width": "200px", "marginRight": "12px", marginBottom: '12px' }} />
                                                                                        <div style={{ alignSelf: 'center' }}>
                                                                                            <Button variant="contained" color="secondary" onClick={() => { this.removeVideo(playlist.Id, video.Id) }}>
                                                                                                Remove Video
                                                                                            </Button>
                                                                                        </div>
                                                                                    </div>
                                                                                </CardContent>
                                                                            </Card>
                                                                        </div>
                                                                    );
                                                                }
                                                            }
                                                        </Draggable>
                                                    );
                                                })
                                            }
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
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
                            style={{ marginRight: '24px', 'minWidth': '200px', marginBottom: '12px' }}>
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