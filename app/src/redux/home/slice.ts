import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

interface HomeState {
    roomId: number | null;
    loading: boolean;
    error: any;
    socket: typeof Socket | null;
    peerConnections: Record<string, RTCPeerConnection | null>;
    streams: Record<string, MediaStream>;
    localStream: MediaStream | null;
}

const initialState: HomeState = {
    roomId: null,
    loading: false,
    error: null,
    socket: null,
    peerConnections: {},
    streams: {},
    localStream: null,
};

const homeSlice = createSlice({
    name: "home",
    initialState,
    reducers: {
        joinRoom(
            state,
            { payload: { roomId } }: PayloadAction<{ roomId: number }>
        ) {
            return {
                ...state,
                roomId,
            };
        },
        initializeSocket(state) {
            return {
                ...state,
            };
        },
        initializeSocketSuccess(
            state,
            data: PayloadAction<{
                socket: typeof Socket | null;
            }>
        ) {
            return {
                ...state,
                socket: data?.payload?.socket,
            };
        },
        createOfferWhenSomeoneJoins(
            state,
            _: PayloadAction<{ userId: string }>
        ) {
            return {
                ...state,
            };
        },
        addPeerConnectionSuccess(
            state,
            {
                payload: { peerConnection, userId },
            }: PayloadAction<{
                peerConnection: RTCPeerConnection;
                userId: string;
            }>
        ) {
            return {
                ...state,
                peerConnections: {
                    ...state?.peerConnections,
                    [userId]: peerConnection,
                },
            };
        },

        addRemoteTrackSuccess(
            state,
            {
                payload: { stream, userId },
            }: PayloadAction<{ userId: string; stream: MediaStream }>
        ) {
            return {
                ...state,
                streams: {
                    ...state?.streams,
                    [userId]: stream,
                },
            };
        },
        removePeer(
            state,
            { payload: { userId } }: PayloadAction<{ userId: string }>
        ) {
            delete state.peerConnections[userId];
            delete state.streams[userId];
        },
        createAnswer(
            state: HomeState,
            _: PayloadAction<{
                offer: RTCSessionDescriptionInit;
                userId: string;
                stream: MediaStream;
            }>
        ) {
            return {
                ...state,
            };
        },
        onAnswerReceived(
            state: HomeState,
            _: PayloadAction<{
                answer: RTCSessionDescriptionInit;
                userId: string;
            }>
        ) {
            return {
                ...state,
            };
        },
        addICE(
            state: HomeState,
            {
                payload: { ice, userId },
            }: PayloadAction<{
                ice: RTCIceCandidateInit;
                userId: string;
            }>
        ) {
            state.peerConnections[userId]?.addIceCandidate(
                new RTCIceCandidate(ice)
            );
            return {
                ...state,
            };
        },
        joinRoomSuccess(state, _: PayloadAction<any>) {
            return {
                ...state,
                loading: false,
                error: false,
            };
        },
        joinRoomFailure(state, data: PayloadAction<any>) {
            return {
                ...state,
                loading: false,
                error: data.payload,
            };
        },
        clearSocketAndRTC(state) {
            return {
                ...state,
            };
        },
        clearSocketAndRTCSuccess(state) {
            return {
                ...state,
                socket: null,
                peerConnection: null,
            };
        },
        localStream(state, _: PayloadAction<{ stream: MediaStream }>) {
            return {
                ...state,
            };
        },
        localStreamSuccess(
            state,
            { payload: { stream } }: PayloadAction<{ stream: MediaStream }>
        ) {
            return {
                ...state,
                localStream: stream,
            };
        },
    },
});

export const {
    joinRoom,
    initializeSocket,
    joinRoomFailure,
    joinRoomSuccess,
    initializeSocketSuccess,
    clearSocketAndRTC,
    clearSocketAndRTCSuccess,
    addPeerConnectionSuccess,
    addRemoteTrackSuccess,
    createAnswer,
    addICE,
    createOfferWhenSomeoneJoins,
    onAnswerReceived,
    localStream,
    localStreamSuccess,
    removePeer,
} = homeSlice.actions;
export default homeSlice;
