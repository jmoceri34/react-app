import { mount, shallow } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';
import Playlists from './playlists.component';

beforeEach(() => {
    localStorage.setItem("Playlists", "[]");
});

test('renders playlists', () => {
    const result = shallow((
        <BrowserRouter basename="/video-loop-tool">
            <Playlists />
        </BrowserRouter>
    ));

    let instance = result.find(Playlists).shallow().instance() as Playlists;

    expect(instance).toBeInstanceOf(Playlists);
});

test('should have default playlist', () => {
    const result = shallow((
        <BrowserRouter basename="/video-loop-tool">
            <Playlists />
        </BrowserRouter>
    ));

    let instance = result.find(Playlists).shallow().instance() as Playlists;

    expect(instance.state.playlists).toHaveLength(1);
    expect(instance.state.playlists[0].Name).toEqual('AC⚡DC Fingerbreaker I');
});

test('adding and removing playlists should increase and decrease the Id property correctly', () => {
    const result = mount((
        <BrowserRouter basename="/video-loop-tool">
            <Playlists />
        </BrowserRouter>
    ));

    let instance = result.find(Playlists).instance() as Playlists;

    // start with zero playlists
    result.find('#remove-playlist-1-button').hostNodes().simulate('click');

    expect(instance.state.playlists).toHaveLength(0);

    // add a new empty playlist
    result.find('#add-new-playlist-button').hostNodes().simulate('click');

    let playlist = instance.state.playlists[0];

    // start at 1
    expect(playlist.Id).toEqual(1);
    expect(playlist.Name).toEqual('');
    expect(playlist.Videos).toHaveLength(0);
    expect(instance.state.selectedPlaylist).toEqual(instance.state.playlists.length - 1);

    // add another
    result.find('#add-new-playlist-button').hostNodes().simulate('click');

    playlist = instance.state.playlists[0];
    let nextPlaylist = instance.state.playlists[1];

    // check the original
    expect(playlist.Id).toEqual(1);
    expect(playlist.Name).toEqual('');
    expect(playlist.Videos).toHaveLength(0);

    // the new one should increase by 1
    expect(nextPlaylist.Id).toEqual(2);
    expect(nextPlaylist.Name).toEqual('');
    expect(nextPlaylist.Videos).toHaveLength(0);

    expect(instance.state.selectedPlaylist).toEqual(instance.state.playlists.length - 1);

    // select the first playlist
    result.find('#playlist-dropdown').at(0).props().onChange!({ target: { name: 'test', value: 0 } });

    // update the dom
    result.update();

    // remove the first playlist
    result.find('#remove-playlist-1-button').hostNodes().simulate('click');
    
    // this is playlist with Id 2
    playlist = instance.state.playlists[0];

    expect(playlist.Id).toEqual(2);
    expect(playlist.Name).toEqual('');
    expect(playlist.Videos).toHaveLength(0);

    expect(instance.state.selectedPlaylist).toBeUndefined();
});

test('Adding and removing videos from a playlist should increase and decrease the Id property correctly', () => {
    const result = mount((
        <BrowserRouter basename="/video-loop-tool">
            <Playlists />
        </BrowserRouter>
    ));

    let instance = result.find(Playlists).instance() as Playlists;

    // start with zero playlists
    result.find('#remove-playlist-1-button').hostNodes().simulate('click');

    expect(instance.state.playlists).toHaveLength(0);

    result.find('#add-new-playlist-button').hostNodes().simulate('click');

    result.find('#add-video-button').hostNodes().simulate('click');

    let playlist = instance.state.playlists[0];

    expect(playlist.Videos).toHaveLength(1);

    let video = playlist.Videos[0];

    expect(video.Id).toEqual(1);
    expect(video.Name).toEqual('');
    expect(video.Delay).toEqual(0);
    expect(video.VideoId).toEqual('');
    expect(video.StartTime).toEqual(0);
    expect(video.EndTime).toEqual(0);

    result.find('#add-video-button').hostNodes().simulate('click');
    
    video = playlist.Videos[0];
    let nextVideo = playlist.Videos[1];

    expect(video.Id).toEqual(1);
    expect(video.Name).toEqual('');
    expect(video.Delay).toEqual(0);
    expect(video.VideoId).toEqual('');
    expect(video.StartTime).toEqual(0);
    expect(video.EndTime).toEqual(0);

    expect(nextVideo.Id).toEqual(2);
    expect(nextVideo.Name).toEqual('');
    expect(nextVideo.Delay).toEqual(0);
    expect(nextVideo.VideoId).toEqual('');
    expect(nextVideo.StartTime).toEqual(0);
    expect(video.EndTime).toEqual(0);

    instance.removeVideo(1, 1);

    video = playlist.Videos[0];

    expect(video.Id).toEqual(2);
    expect(video.Name).toEqual('');
    expect(video.Delay).toEqual(0);
    expect(video.VideoId).toEqual('');
    expect(video.StartTime).toEqual(0);
    expect(video.EndTime).toEqual(0);
});