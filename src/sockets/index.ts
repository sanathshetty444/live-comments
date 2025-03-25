import { Namespace, Server } from "socket.io";
import SocketConfig from "../config/socket";

abstract class SocketHandler {
    protected io: Server;
    protected namespace: Namespace;

    constructor(namespace: string) {
        this.io = SocketConfig.getInstance().getIO();
        this.namespace = this.io.of(namespace);
    }

    // Abstract method to enforce implementation
    abstract initialize(): void;
}

export default SocketHandler;
