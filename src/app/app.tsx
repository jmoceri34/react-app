import './app.css';
import { Suspense, lazy } from "react";
import {
    Route,
    Link,
    BrowserRouter,
    Switch
} from "react-router-dom";
import { Button, Card, CardContent } from '@material-ui/core';

const VideoLoopTool = lazy(() => import('video-loop-tool/video-loop-tool.component'));
const Playlists = lazy(() => import('playlists/playlists.component'));
const Instructions = lazy(() => import('instructions/instructions.component'));

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <div>
                    {/* Nav bar */}
                    <Card style={{margin: '12px', padding: '0 !important'}}>
                        <CardContent style={{ 'padding': '0 !important' }}>
                            <div style={{ display: 'flex' }}>
                                <Link to="/video-loop-tool" style={{ textDecoration: 'none' }}>
                                    <Button variant="contained" color="primary" style={{ 'marginTop': "12px", 'marginRight': '12px' }}>
                                        Video Loop Tool
                                    </Button>
                                </Link>
                                <Link to="/playlists" style={{ textDecoration: 'none' }}>
                                    <Button variant="contained" color="primary" style={{ 'marginTop': "12px", 'marginRight': '12px' }}>
                                        Playlists
                                    </Button>
                                </Link>
                                <Link to="/instructions" style={{ textDecoration: 'none' }}>
                                    <Button variant="contained" color="primary" style={{ 'marginTop': "12px", 'marginRight': '12px' }}>
                                        Instructions
                                    </Button>
                                </Link>
                                <Link to={{ pathname: 'https://github.com/joemoceri/video-loop-tool'}} target="_blank" style={{ textDecoration: 'none' }}>
                                    <Button variant="contained" color="primary" style={{ 'marginTop': '12px', 'marginRight': '12px' }}>
                                        View on GitHub
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Routes */}
                    <Switch>
                        <Route path="/video-loop-tool" component={VideoLoopTool}>
                        </Route>
                        <Route path="/playlists" component={Playlists}>
                        </Route>
                        <Route path="/instructions" component={Instructions}>
                        </Route>
                    </Switch>
                </div>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;