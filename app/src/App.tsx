import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import Home from "./screens/Home";
import Room from "./screens/Room";
import store from "./redux/store";
import Main from "./layouts/main";

function App() {
    return (
        <>
            <Provider store={store}>
                <BrowserRouter>
                    <Main>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/room" element={<Room />} />
                        </Routes>
                    </Main>
                </BrowserRouter>
            </Provider>
        </>
    );
}

export default App;
