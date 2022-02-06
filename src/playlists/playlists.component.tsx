import { Component } from "react";
import { Playlist } from "./playlist.model";

require('jquery-ui/ui/widgets/slider');

export interface PlaylistProps {

}

export interface PlaylistState {
    Playlists: Playlist[];
}

export default class Playlists extends Component<PlaylistProps, PlaylistState> {

    render() {
        return (
            <h2>Playlist Page Test</h2>
        );
    };
};