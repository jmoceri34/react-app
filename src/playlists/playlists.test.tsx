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