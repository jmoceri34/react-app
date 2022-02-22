import { shallow } from 'enzyme';
import Instructions from './instructions.component';

test('renders instructions', () => {
    const result = shallow(<Instructions />);

    let instance = result.instance() as Instructions;

    expect(instance).toBeInstanceOf(Instructions);
});

test('instructions how to gif has the right src', () => {
    const result = shallow(<Instructions />);

    expect(result.find('#how-to-gif').prop('src')).toEqual(process.env.PUBLIC_URL + '/video-loop-tool-how-to-gif.gif');
});