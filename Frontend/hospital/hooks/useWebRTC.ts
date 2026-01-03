// hooks/useWebRTC.js
import { useEffect, useRef, useState } from "react";

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
};

export const useWebRTC = (
  socket,
  conversationId,
  localVideoRef,
  remoteVideoRef
) => {
  const pc = useRef(null);
  const localStream = useRef(null);

  const cleanup = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
    }
    if (pc.current) {
      pc.current.close();
      pc.current = null;
    }
  };

  const setupPeerConnection = async () => {
    cleanup();
    pc.current = new RTCPeerConnection(servers);

    // Get camera/mic
    localStream.current = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    if (localVideoRef.current)
      localVideoRef.current.srcObject = localStream.current;

    // Add tracks to PeerConnection
    localStream.current
      .getTracks()
      .forEach((track) => pc.current.addTrack(track, localStream.current));

    // Listen for remote tracks
    pc.current.ontrack = (event) => {
      if (remoteVideoRef.current)
        remoteVideoRef.current.srcObject = event.streams[0];
    };

    // Listen for local ICE candidates and send to peer
    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice_candidate", {
          conversationId,
          candidate: event.candidate,
        });
      }
    };
  };

  const createOffer = async () => {
    await setupPeerConnection();
    const offer = await pc.current.createOffer();
    await pc.current.setLocalDescription(offer);
    socket.emit("outgoing_call", { conversationId, offer });
  };

  const handleIncomingCall = async (offer) => {
    await setupPeerConnection();
    await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answer);
    socket.emit("answer_call", { conversationId, answer });
  };

  const handleCallAccepted = async (answer) => {
    if (pc.current) {
      await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleNewICECandidate = async (candidate) => {
    if (pc.current) {
      await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  return {
    createOffer,
    handleIncomingCall,
    handleCallAccepted,
    handleNewICECandidate,
    cleanup,
  };
};
