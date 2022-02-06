import './app.css';
import { Suspense, lazy } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";

const VideoLoopTool = lazy(() => import('video-loop-tool/video-loop-tool.component'));
const Playlist = lazy(() => import('playlist/playlist.component'));

function App() {
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <div>
                    {/* Nav bar */}
                    <ul>
                        <li>
                            <Link to="/video-loop-tool">Video Loop Tool</Link>
                        </li>
                        <li>
                            <Link to="/playlist">Playlists</Link>
                        </li>
                    </ul>

                    {/* Routes */}
                    <Routes>
                        <Route path="/playlist" element={<Playlist />}>
                        </Route>
                        <Route path="/video-loop-tool" element={<VideoLoopTool />}>
                        </Route>
                    </Routes>
                </div>
            </Suspense>
        </Router>
    );
}

export default App;