import { shallow } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';
import Playlists from './playlists.component';

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

test('adding and removing playlists should increase and decrease the Id correctly', () => {
    const result = shallow((
        <BrowserRouter basename="/video-loop-tool">
            <Playlists />
        </BrowserRouter>
    ));

    let instance = result.find(Playlists).shallow().instance() as Playlists;

    // start with zero playlists
    instance.removePlaylist(1);

    // add a new empty playlist
    instance.addPlaylist();

    let playlist = instance.state.playlists[0];

    // start at 1
    expect(playlist.Id).toEqual(1);
    expect(playlist.Name).toEqual('');
    expect(playlist.Videos).toHaveLength(0);
    expect(instance.state.selectedPlaylist).toEqual(instance.state.playlists.length - 1);

    // add another
    instance.addPlaylist();

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

    // remove the one just created
    instance.removePlaylist(1);

    // this is playlist with Id 2
    playlist = instance.state.playlists[0];

    expect(playlist.Id).toEqual(2);
    expect(playlist.Name).toEqual('');
    expect(playlist.Videos).toHaveLength(0);

    expect(instance.state.selectedPlaylist).toEqual(instance.state.playlists.length - 1);
});