import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useRoom } from "./hooks/useRoom";

function Room() {
    const { streams, ref, videoRefs, socket } = useRoom();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Card>
                <CardContent>
                    <video ref={ref} autoPlay playsInline muted />
                </CardContent>
                <CardTitle className="text-center">{socket?.id}</CardTitle>
            </Card>

            {Object.keys(streams).map((key, index) => (
                <Card>
                    <CardContent>
                        <video
                            key={index}
                            ref={videoRefs[index]}
                            autoPlay
                            playsInline
                            muted
                        />
                    </CardContent>
                    <CardTitle className="text-center">{key}</CardTitle>
                </Card>
            ))}
        </div>
    );
}

export default Room;
