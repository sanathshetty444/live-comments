import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHome } from "./hooks/useHome";

function Home() {
    const { handleRoomChangeText, handleJoin, roomId } = useHome();
    return (
        <>
            <div className="flex w-[100vw] flex-row items-center gap-4 justify-center min-h-svh">
                <Input
                    value={roomId}
                    onChange={handleRoomChangeText}
                    className="w-1/6"
                    type="text"
                    placeholder="Room Id"
                />
                <Button onClick={handleJoin}>Click me</Button>
            </div>
        </>
    );
}

export default Home;
