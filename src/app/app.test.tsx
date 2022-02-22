import { shallow } from 'enzyme';
import { lazy, Suspense } from 'react';
import VideoLoopTool from '../video-loop-tool/video-loop-tool.component';
import App from './app';

test('App\'s BrowserRouter basename equals /video-loop-loop', () => {

    // arrange
    const result = shallow(<App />);

    // act
    let basename = result.find('BrowserRouter').prop("basename");

    // assert
    expect(basename).toEqual("/video-loop-tool");
});

test('App has Suspense element wrapper that\'s a child of BrowserRouter', () => {
    const result = shallow(<App />);

    let suspenseElement = result.find('Suspense');

    expect(suspenseElement).toHaveLength(1);
    expect(suspenseElement.parent().name()).toEqual('BrowserRouter');
});

test('App has Links', () => {
    const result = shallow(<App />);

    let linkContainerElement = result.find('#link-container');

    expect(linkContainerElement.childAt(0).prop('to')).toEqual('/');
    expect(linkContainerElement.childAt(1).prop('to')).toEqual('/playlists');
    expect(linkContainerElement.childAt(2).prop('to')).toEqual('/instructions');
    expect(linkContainerElement.childAt(3).prop('href')).toEqual('https://github.com/joemoceri/video-loop-tool');
});

test('App has Routes', () => {
    const result = shallow(<App />);

    let switchElement = result.find('Switch');

    expect(switchElement.childAt(0).prop('path')).toEqual('/');
    expect(switchElement.childAt(0).prop('exact')).toBeDefined();

    expect(switchElement.childAt(1).prop('path')).toEqual('/playlists');
    expect(switchElement.childAt(1).prop('exact')).toBeDefined();

    expect(switchElement.childAt(2).prop('path')).toEqual('/instructions');
    expect(switchElement.childAt(2).prop('exact')).toBeDefined();
});