import React from "react";
import { MainContext } from "./mainContext";
import { useMain } from "./hooks/useMain";
function Main({ children }: React.PropsWithChildren) {
    const { handleJoinRoom } = useMain();
    return (
        <MainContext.Provider value={{ handleJoinRoom }}>
            {children}
        </MainContext.Provider>
    );
}

export default Main;
