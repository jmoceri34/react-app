import { Video } from "./video.model";

export interface Playlist {
    Id: number;
    Name: string;
    Videos: Video[];
}