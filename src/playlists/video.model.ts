export interface Video {
    Id: number;
    Name: string;
    VideoId: string;
    StartTime: number;
    EndTime: number;
    Delay: number;
    [key: string]: any;
}