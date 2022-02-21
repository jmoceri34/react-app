import { shallow } from 'enzyme';
import Instructions from './instructions.component';

test('renders instructions', () => {
    const result = shallow(<Instructions />);

    let instance = result.instance() as Instructions;

    expect(instance).toBeInstanceOf(Instructions);
});