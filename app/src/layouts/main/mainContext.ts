import { createContext } from "react";

type TMainContext = {
    handleJoinRoom: (roomId: number) => void;
    currentOffers: { offer: RTCSessionDescriptionInit; userId: string }[];
    setCurrentOffers: React.Dispatch<
        React.SetStateAction<
            {
                userId: string;
                offer: RTCSessionDescriptionInit;
            }[]
        >
    >;
};
export const MainContext = createContext<TMainContext | null>(null);
