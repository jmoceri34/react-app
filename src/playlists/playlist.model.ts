import { Video } from "./video.model";

export interface Playlist {
    Id: string;
    Name: string;
    Videos: Video[];
    [key: string]: any;
}