import { shallow } from 'enzyme';
import App from './app';

test('renders app', () => {
    const result = shallow(<App />);

    let basename = result.find('BrowserRouter').prop("basename");

    expect(basename).toEqual("/video-loop-tool");
});
