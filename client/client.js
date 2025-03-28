const socket = io("http://localhost:8888/streaming");

//vars
const candidateSet = new Set();
const config = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

//initialize peer connnection
let peerConnection = new RTCPeerConnection(config);

// DOM Elements
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
//listen to events
peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
        socket.emit("iceCandidate", {
            roomId: localStorage.getItem("roomId"),
            candidate: event.candidate,
        });
    }
};

//listen to events
peerConnection.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
};

peerConnection.onicecandidateerror = (ev) => {
    console.log("onicecandidateerror==", ev);
};
// Join Room
function joinRoom(roomId) {
    socket.emit("joinRoom", { roomId });
    localStorage.setItem("roomId", roomId);
    navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
            localVideo.srcObject = stream;
            stream
                .getTracks()
                .forEach((track) => peerConnection.addTrack(track, stream));

            createOffer(roomId);
        });
}

// Create Offer
async function createOffer(roomId) {
    try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit("offer", { roomId, offer });
    } catch (error) {
        console.error("Error creating offer:", error);
    }
}

// Handle Offer
socket.on("offer", async ({ offer, roomId }) => {
    try {
        await peerConnection.setRemoteDescription(
            new RTCSessionDescription(offer)
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit("answer", { roomId, answer });
    } catch (error) {
        console.error("Error handling offer:", error);
    }
});

// Handle Answer
socket.on("answer", async ({ answer }) => {
    try {
        await peerConnection.setRemoteDescription(
            new RTCSessionDescription(answer)
        );
    } catch (error) {
        console.error("Error handling answer:", error);
    }
});

// Handle ICE Candidate
socket.on("iceCandidate", async ({ candidate }) => {
    try {
        if (!candidateSet.has(JSON.stringify(candidate))) {
            candidateSet.add(JSON.stringify(candidate));
            await peerConnection.addIceCandidate(
                new RTCIceCandidate(candidate)
            );
        }
    } catch (error) {
        console.error("Error adding ICE candidate:", error);
    }
});
