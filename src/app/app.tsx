import './app.css';
import { Suspense, lazy } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    BrowserRouter
} from "react-router-dom";

const VideoLoopTool = lazy(() => import('video-loop-tool/video-loop-tool.component'));
const Playlists = lazy(() => import('playlists/playlists.component'));

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <div>
                    {/* Nav bar */}
                    <ul>
                        <li>
                            <Link to="/video-loop-tool">Video Loop Tool</Link>
                        </li>
                        <li>
                            <Link to="/playlists">Playlists</Link>
                        </li>
                    </ul>

                    {/* Routes */}
                    <Routes>
                        <Route path="/playlists" element={<Playlists />}>
                        </Route>
                        <Route path="/video-loop-tool" element={<VideoLoopTool />}>
                        </Route>
                    </Routes>
                </div>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;