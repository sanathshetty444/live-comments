import { MainContext } from "@/layouts/main/mainContext";
import { RootState } from "@/redux/store";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useHome = () => {
    const state = useSelector((state: RootState) => state?.home);
    const context = useContext(MainContext);
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState(0);
    const handleRoomChangeText = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRoomId(Number(event.target.value));
    };

    useEffect(() => {
        if (state?.roomId) navigate("/room");
    }, [state?.roomId]);

    const handleJoin = () => {
        context?.handleJoinRoom(roomId);
    };
    return {
        roomId,
        handleRoomChangeText,
        handleJoin,
    };
};
