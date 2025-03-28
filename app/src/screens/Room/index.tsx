import { Card, CardContent, CardTitle } from "@/components/ui/card";
import React from "react";
import { useRoom } from "./hooks/useRoom";

function Room() {
    const { streams, ref, videoRefs } = useRoom();
    console.log("videoRefs", videoRefs);

    return (
        <div className="grid-cols-3">
            {/* <Card>
                <CardContent> */}
            <video ref={ref} autoPlay playsInline muted />
            <video ref={videoRefs[0]} autoPlay playsInline muted />
            {/* {Object.keys(streams).map((_, index) => (
                        <>
                            <video
                                key={index}
                                ref={videoRefs[index]}
                                autoPlay
                                playsInline
                            />
                        </>
                    ))} */}
            {/* </CardContent>
                <CardTitle className="text-center">Self</CardTitle>
            </Card> */}
        </div>
    );
}

export default Room;
