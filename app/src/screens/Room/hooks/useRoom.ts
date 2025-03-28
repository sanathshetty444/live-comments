import { MainContext } from "@/layouts/main/mainContext";
import {
    createAnswer,
    localStream as localStreamAction,
} from "@/redux/home/slice";
import { RootState } from "@/redux/store";
import React, { useContext, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useRoom = () => {
    const ref = useRef<HTMLVideoElement>(null);
    // const videoRefs = useRef<HTMLVideoElement[]>([]);
    const dispatch = useDispatch();
    const { currentOffers, setCurrentOffers } = useContext(MainContext)!;

    const { streams, localStream, socket } = useSelector(
        (state: RootState) => state?.home
    );

    console.log("streams==", streams);

    const videoRefs = useMemo(() => {
        return Array.from({ length: 10 }, () =>
            React.createRef<HTMLVideoElement>()
        );
    }, []);

    useEffect(() => {
        Object.keys(streams).forEach((key, index) => {
            if (videoRefs[index].current) {
                videoRefs[index].current.srcObject = streams[key];
            }
        });
    }, [streams, videoRefs]);

    useEffect(() => {
        if (ref.current) ref.current.srcObject = localStream;

        if (!localStream) {
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    dispatch(localStreamAction({ stream }));
                    //@ts-ignore
                });
        }

        if (localStream && currentOffers.length > 0) {
            let size = currentOffers.length;
            for (let i = 0; i < size; i++) {
                dispatch(
                    createAnswer({ ...currentOffers[i], stream: localStream })
                );
            }
        }
    }, [localStream, currentOffers]);

    return { streams, ref, videoRefs, socket };
};
