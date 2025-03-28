import { localStream as localStreamAction } from "@/redux/home/slice";
import { RootState } from "@/redux/store";
import React, { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useRoom = () => {
    const ref = useRef<HTMLVideoElement>(null);
    // const videoRefs = useRef<HTMLVideoElement[]>([]);
    const dispatch = useDispatch();
    const { streams, localStream, peerConnections } = useSelector(
        (state: RootState) => state?.home
    );

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
    }, [streams]);

    useEffect(() => {
        if (ref.current) ref.current.srcObject = localStream;
    }, [localStream]);

    console.log("Streams===", streams, localStream);

    useEffect(() => {
        if (ref.current) {
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    dispatch(localStreamAction({ stream }));
                    //@ts-ignore
                });
        }
    }, [ref.current]);

    return { streams, ref, videoRefs };
};
