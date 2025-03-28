import { createContext } from "react";

type TMainContext = {
    handleJoinRoom: (roomId: number) => void;
};
export const MainContext = createContext<TMainContext | null>(null);
