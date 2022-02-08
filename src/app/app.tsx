import './app.css';
import { Suspense, lazy } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    BrowserRouter
} from "react-router-dom";
import { Button } from '@material-ui/core';

const VideoLoopTool = lazy(() => import('video-loop-tool/video-loop-tool.component'));
const Playlists = lazy(() => import('playlists/playlists.component'));
const Instructions = lazy(() => import('instructions/instructions.component'));

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <div>
                    {/* Nav bar */}
                    <div style={{ display: 'flex', paddingLeft: '12px'/*, alignItems: 'center', justifyContent: 'center' */}}>
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
                    </div>

                    {/* Routes */}
                    <Routes>
                        <Route path="/video-loop-tool" element={<VideoLoopTool />}>
                        </Route>
                        <Route path="/playlists" element={<Playlists />}>
                        </Route>
                        <Route path="/instructions" element={<Instructions />}>
                        </Route>
                    </Routes>
                </div>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;