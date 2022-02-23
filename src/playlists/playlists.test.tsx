import { Button } from '@mui/material';
import { mount, shallow } from 'enzyme';
import { render } from '@testing-library/react'
import { BrowserRouter, Link, Prompt, Route, Switch } from 'react-router-dom';
import VideoLoopTool from '../video-loop-tool/video-loop-tool.component';
import { Playlist } from './playlist.model';
import Playlists from './playlists.component';
import { verticalDrag } from 'react-beautiful-dnd-tester';

jest.useFakeTimers();

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

    result.find('#remove-video-1-button').hostNodes().simulate('click');

    video = playlist.Videos[0];

    expect(video.Id).toEqual(2);
    expect(video.Name).toEqual('');
    expect(video.Delay).toEqual(0);
    expect(video.VideoId).toEqual('');
    expect(video.StartTime).toEqual(0);
    expect(video.EndTime).toEqual(0);
});

test('nameof should return the name of the property', () => {
    const result = mount((
        <BrowserRouter basename="/video-loop-tool">
            <Playlists />
        </BrowserRouter>
    ));

    let instance = result.find(Playlists).instance() as Playlists;

    expect(instance.nameof(instance.state.playlists[0], (p: Playlist) => p.Name)).toEqual("Name");
});

test('updating a playlist input fields should update the playlist object', () => {
    const result = mount((
        <BrowserRouter basename="/video-loop-tool">
            <Playlists />
        </BrowserRouter>
    ));

    let instance = result.find(Playlists).instance() as Playlists;

    result.find('#playlist-name-text-field').hostNodes().props().onChange!({ target: { value: 'Hello Playlist' } });
    result.find('#video-1-name-text-field').hostNodes().props().onChange!({ target: { value: 'Hello Video' } });
    result.find('#video-1-video-id-text-field').hostNodes().props().onChange!({ target: { value: 'Hello Video Id' } });
    result.find('#video-1-start-time-text-field').hostNodes().props().onChange!({ target: { value: '0' } });
    result.find('#video-1-end-time-text-field').hostNodes().props().onChange!({ target: { value: '0' } });
    result.find('#video-1-delay-text-field').hostNodes().props().onChange!({ target: { value: '0' } });

    expect(instance.state.playlists[0].Name).toEqual('Hello Playlist');
    expect(instance.state.playlists[0].Videos[0].Name).toEqual('Hello Video');
    expect(instance.state.playlists[0].Videos[0].VideoId).toEqual('Hello Video Id');
    expect(instance.state.playlists[0].Videos[0].StartTime).toEqual('0');
    expect(instance.state.playlists[0].Videos[0].EndTime).toEqual('0');
    expect(instance.state.playlists[0].Videos[0].Delay).toEqual('0');
});

test('onbeforeunload is called and cleared when the component is mounted / unmounted', () => {
    const result = mount((
        <BrowserRouter basename="/video-loop-tool">
            <Playlists />
        </BrowserRouter>
    ));

    let instance = result.find(Playlists).instance() as Playlists;

    let spy = jest.spyOn(instance, "onBeforeUnloadCallback");

    instance.removePlaylist(1);

    window.dispatchEvent(new Event("beforeunload"));

    expect(spy).toHaveBeenCalledTimes(1);

    result.unmount();

    expect(window.onbeforeunload).toBeNull();
});

test('prompt message callback is called', () => {
    const result = mount((
        <BrowserRouter basename="/video-loop-tool">
            <Link id="video-loop-tool-button" to="/" style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary" style={{ 'marginTop': "12px", 'marginRight': '12px' }}>
                    Video Loop Tool
                </Button>
            </Link>
            <Switch>
                <Route exact path="/" component={VideoLoopTool}>
                </Route>
                <Route exact path="/playlists" component={Playlists}>
                </Route>
            </Switch>
            <Playlists />
        </BrowserRouter>
    ));

    let instance = result.find(Playlists).instance() as Playlists;

    let spy = jest.spyOn(instance, "promptMessageCallback");
    let saveChangesSpy = jest.spyOn(instance, "saveChanges");

    instance.addPlaylist();

    result.find('#video-loop-tool-button').hostNodes().simulate('click');

    let r = instance.promptMessageCallback({ pathname: '', search: '', state: '', hash: '' }, "PUSH");

    expect(r).toEqual(true);
    expect(spy).toBeCalledTimes(1);
    expect(saveChangesSpy).toBeCalledTimes(1);

    let f = result.find(Prompt).prop('message') as Function;

    r = f();
    expect(spy).toBeCalledTimes(2);
    expect(saveChangesSpy).toBeCalledTimes(2);

    expect(r).toEqual(true);

});

test('drag and drop should resort the playlists', () => {
    const result = render((
        <BrowserRouter basename="/video-loop-tool">
            <Playlists />
        </BrowserRouter>
    ));


    let first = result.getAllByTestId(/video-item/i)[0] as HTMLElement;
    let second = result.getAllByTestId(/video-item/i)[1] as HTMLElement;

    expect(first.id).toEqual('drag-handle-video-1');
    expect(second.id).toEqual('drag-handle-video-2');

    verticalDrag(second).inFrontOf(first);

    first = result.getAllByTestId(/video-item/i)[0] as HTMLElement;
    second = result.getAllByTestId(/video-item/i)[1] as HTMLElement;

    expect(first.id).toEqual('drag-handle-video-2');
    expect(second.id).toEqual('drag-handle-video-1');

});

test('save changes button should save the playlist', () => {
    const result = mount((
        <BrowserRouter basename="/video-loop-tool">
            <Playlists />
        </BrowserRouter>
    ));

    let instance = result.find(Playlists).instance() as Playlists;
    let spy = jest.spyOn(instance, "saveChanges");

    instance.addPlaylist();

    expect(spy).toHaveBeenCalledTimes(0);

    result.find('#save-changes-button').hostNodes().simulate('click');

    expect(spy).toHaveBeenCalledTimes(1);
});