import React from "react";
import { MainContext } from "./mainContext";
import { useMain } from "./hooks/useMain";
function Main({ children }: React.PropsWithChildren) {
    const { currentOffers, setCurrentOffers, handleJoinRoom } = useMain();
    return (
        <MainContext.Provider
            value={{ currentOffers, setCurrentOffers, handleJoinRoom }}
        >
            {children}
        </MainContext.Provider>
    );
}

export default Main;
