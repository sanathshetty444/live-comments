import {
    all,
    call,
    put,
    select,
    takeEvery,
    takeLatest,
} from "redux-saga/effects";
import io from "socket.io-client";
import store, { RootState } from "../store";
import {
    addPeerConnectionSuccess,
    addRemoteTrackSuccess,
    clearSocketAndRTC,
    clearSocketAndRTCSuccess,
    createAnswer,
    createOffer,
    initializeSocket,
    initializeSocketSuccess,
    joinRoom,
    joinRoomFailure,
    joinRoomSuccess,
    localStream,
    localStreamSuccess,
    onAnswerReceived,
} from "./slice";
import { PayloadAction } from "@reduxjs/toolkit";

function* joinRoomSaga({ roomId }: { roomId: number }) {
    try {
        yield put(joinRoomSuccess({ roomId }));
    } catch (error) {
        yield put(joinRoomFailure(error));
        console.log(error);
    }
}

function* initialize() {
    try {
        const socket = io("http://localhost:8888/streaming");
        const data: RootState = yield select();

        if (!data?.home?.socket) {
            // const peerConnection = new RTCPeerConnection({
            //     iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
            // });

            yield put(initializeSocketSuccess({ socket }));
        }
    } catch (error) {
        console.log(error);
    }
}
function* createPeerConnectionHelperSaga({ userId }: { userId: string }) {
    try {
        const data: RootState = yield select();
        const socket = data?.home?.socket!;
        const localStream = data?.home?.localStream;
        if (!data?.home?.peerConnections[userId]) {
            const peerConnection = new RTCPeerConnection({
                iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
            });
            peerConnection.onicecandidate = (
                event: RTCPeerConnectionIceEvent
            ) => {
                console.log(
                    "ICE Candidate State:",
                    peerConnection.iceConnectionState
                );

                if (event.candidate) {
                    console.log("Sending ICE Candidate:", event.candidate);
                    socket.emit("iceCandidate", {
                        roomId: data?.home?.roomId,
                        candidate: event.candidate,
                        userId: socket.id,
                    });
                } else {
                    console.log("ICE Candidate Gathering Complete");
                }
            };

            // Add additional event listeners for ICE connection state
            peerConnection.oniceconnectionstatechange = (event) => {
                console.log(
                    "ICE Connection State:",
                    peerConnection.iceConnectionState
                );
            };

            peerConnection.onicecandidateerror = (ev) => {
                console.log("onicecandidateerror==", ev);
            };
            peerConnection.ontrack = (event: RTCTrackEvent) => {
                console.log("ontrack======");

                if (event.streams.length > 0) {
                    store.dispatch(
                        addRemoteTrackSuccess({
                            stream: event?.streams?.[0],
                            userId,
                        })
                    );
                }
            };

            yield put(addPeerConnectionSuccess({ peerConnection, userId }));
            return peerConnection;
        }
        return data?.home?.peerConnections[userId];
    } catch (error) {}
}

function* createOfferSaga({
    payload: { userId },
}: PayloadAction<{ userId: string }>) {
    try {
        const data: RootState = yield select();
        const socket = data?.home?.socket!;
        const localStream = data?.home?.localStream;

        const peerConnection: RTCPeerConnection =
            yield createPeerConnectionHelperSaga({ userId });

        yield call(() => {
            localStream?.getTracks().forEach((track) => {
                peerConnection.addTrack(track, data?.home?.localStream!);
            });
        });

        // for (let track of localStream?.getTracks() || []) {
        //     peerConnection.addTrack(track, data?.home?.localStream!);
        // }
        //@ts-ignore
        const offer = yield call([peerConnection, peerConnection.createOffer]);

        yield call(
            //@ts-ignore
            [peerConnection, peerConnection.setLocalDescription],
            new RTCSessionDescription(offer)
        );

        socket.emit("offer", {
            userId: socket?.id,
            offer,
            roomId: data?.home?.roomId,
        });

        return peerConnection;
    } catch (error) {
        console.log(error);
    }
}

function* createAnswerSaga({
    payload: { offer, userId },
}: PayloadAction<{ offer: RTCSessionDescriptionInit; userId: string }>) {
    try {
        const data: RootState = yield select();
        const socket = data?.home?.socket!;

        const peerConnection: RTCPeerConnection =
            yield createPeerConnectionHelperSaga({ userId });

        yield call(
            //@ts-ignore
            [peerConnection, peerConnection.setRemoteDescription],
            new RTCSessionDescription(offer)
        );

        //@ts-ignore
        const answer = yield call([
            peerConnection,
            peerConnection.createAnswer,
        ]);

        yield call(
            //@ts-ignore
            [peerConnection, peerConnection.setLocalDescription],
            new RTCSessionDescription(answer)
        );

        socket.emit("answer", {
            userId: socket?.id,
            answer,
            roomId: data?.home?.roomId,
        });
    } catch (error) {
        console.log(error);
    }
}

function* onAnswerReceivedSaga({
    payload: { answer, userId },
}: PayloadAction<{
    answer: RTCSessionDescriptionInit;
    userId: string;
}>) {
    try {
        const data: RootState = yield select();
        const peerConnections = data?.home?.peerConnections!;

        if (peerConnections[userId]) {
            yield call(
                //@ts-ignore
                [
                    peerConnections[userId],
                    peerConnections[userId].setRemoteDescription,
                ],
                new RTCSessionDescription(answer)
            );
            //  yield call(() => {
            //      data?.home?.localStream?.getTracks().forEach((track) => {
            //          peerConnections[userId]?.addTrack(
            //              track,
            //              data?.home?.localStream!
            //          );
            //      });
            //  });
        }
    } catch (error) {
        console.log(error);
    }
}

function* clearSocketAndRTCSaga() {
    try {
        const {
            home: { socket, peerConnections },
        }: RootState = yield select();
        if (socket) {
            socket?.removeAllListeners();
            socket?.close();
        }

        for (let key of Object.keys(peerConnections))
            peerConnections[key]?.close();

        yield put(clearSocketAndRTCSuccess());
    } catch (error) {}
}

function* localStreamSaga({
    payload: { stream },
}: PayloadAction<{ stream: MediaStream }>) {
    try {
        const state: RootState = yield select();

        stream?.getTracks().forEach((track) => {
            for (let peerConnection of Object.values(
                state?.home?.peerConnections
            )) {
                console.log("peerConnection===", peerConnection);
                peerConnection?.addTrack(track, stream);
            }
        });

        yield put(localStreamSuccess({ stream }));
    } catch (error) {
        console.log(error);
    }
}
export function* homeSaga() {
    yield all([
        takeLatest(joinRoom.type as any, joinRoomSaga),
        takeLatest(initializeSocket.type as any, initialize),
        takeLatest(clearSocketAndRTC.type as any, clearSocketAndRTCSaga),
        takeEvery(createOffer.type as any, createOfferSaga),
        takeEvery(createAnswer.type as any, createAnswerSaga),
        takeEvery(onAnswerReceived.type as any, onAnswerReceivedSaga),
        takeLatest(localStream.type as any, localStreamSaga),
    ]);
}
