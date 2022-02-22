import { shallow } from 'enzyme';
import VideoLoopTool from './video-loop-tool.component';

test('renders video loop tool', () => {
    const result = shallow((
            < VideoLoopTool />
    ));

    let instance = result.instance() as VideoLoopTool;

    expect(instance).toBeInstanceOf(VideoLoopTool);
});