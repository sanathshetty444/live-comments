import {
    addICE,
    clearSocketAndRTC,
    createAnswer,
    createOfferWhenSomeoneJoins,
    initializeSocket,
    joinRoom,
    onAnswerReceived,
} from "@/redux/home/slice";
import { RootState } from "@/redux/store";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useMain = () => {
    const state = useSelector((state: RootState) => state?.home);
    const dispatch = useDispatch();
    const [currentOffers, setCurrentOffers] = useState<
        {
            userId: string;
            offer: RTCSessionDescriptionInit;
        }[]
    >([]);

    useEffect(() => {
        dispatch(initializeSocket());

        return () => {
            dispatch(clearSocketAndRTC());
        };
    }, []);

    useEffect(() => {
        const { socket, peerConnections } = state;

        if (socket && peerConnections) bindListeners();
    }, [state?.socket]);

    const handleJoinRoom = useCallback(
        (roomId: number) => {
            state?.socket?.emit("joinRoom", {
                roomId,
                userId: state?.socket?.id,
            });
            dispatch(joinRoom({ roomId }));
        },
        [state?.socket]
    );

    function bindListeners() {
        const { socket } = state;

        socket?.on("joinRoom", async ({ userId }: { userId: string }) => {
            try {
                console.log("Join room==", userId, socket.id);
                if (userId !== socket.id) {
                    dispatch(createOfferWhenSomeoneJoins({ userId }));
                }
            } catch (error) {
                console.error("Join Room==", error);
            }
        });
        socket?.on(
            "offer",
            async ({
                offer,
                userId,
            }: {
                userId: string;
                offer: RTCSessionDescriptionInit;
            }) => {
                try {
                    if (userId !== socket?.id) {
                        setCurrentOffers((offers) => [
                            ...offers,
                            { offer, userId },
                        ]);
                    }
                } catch (error) {
                    console.error("Error handling offer:", error);
                }
            }
        );
        socket?.on(
            "answer",
            async ({
                answer,
                userId,
            }: {
                answer: RTCSessionDescriptionInit;
                userId: string;
            }) => {
                try {
                    if (userId !== socket.id)
                        dispatch(onAnswerReceived({ answer, userId }));
                } catch (error) {
                    console.error("Error handling answer:", error);
                }
            }
        );

        // Handle ICE Candidate
        socket?.on(
            "iceCandidate",
            async ({
                // ice,
                userId,
                candidate,
            }: {
                candidate: RTCIceCandidateInit;
                userId: string;
            }) => {
                try {
                    const candidateString = JSON.stringify(candidate);
                    // if (!candidateSet?.current.has(candidateString)) {
                    //     candidateSet?.current.add(candidateString);

                    dispatch(addICE({ ice: candidate, userId }));
                    // }
                } catch (error) {
                    console.error("Error adding ICE candidate:", error);
                }
            }
        );
    }

    return { currentOffers, setCurrentOffers, handleJoinRoom };
};
