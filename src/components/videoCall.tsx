import { useEffect, useRef, useState } from "react";
import {
  Box,
  Loader,
  Text,
  rem,
  createStyles,
  ActionIcon,
  Tooltip,
  Group,
} from "@mantine/core";
import {
  IconPhoneOff,
  IconMicrophone,
  IconMicrophoneOff,
  IconVideo,
} from "@tabler/icons-react";
import { useLocation } from "react-router-dom";
import { CreateWebSocketConnection } from "@/lib/Api"; // Your own WebSocket utility

const useStyles = createStyles(() => ({
  wrapper: {
    height: "100vh",
    width: "100vw",
    backgroundColor: "#000",
    position: "relative",
    overflow: "hidden",
  },
  videoContainer: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  localVideo: {
    position: "absolute",
    bottom: rem(10),
    right: rem(10),
    width: rem(120),
    height: rem(160),
    borderRadius: rem(10),
    objectFit: "cover",
    border: "2px solid #fff",
    "@media (max-width: 768px)": {
      width: rem(80),
      height: rem(100),
    },
  },
  remoteVideo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  controls: {
    position: "absolute",
    bottom: rem(20),
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 10,
    backgroundColor: "#ffffff20",
    backdropFilter: "blur(10px)",
    padding: rem(10),
    borderRadius: rem(12),
    display: "flex",
    gap: rem(12),
    "@media (max-width: 768px)": {
      bottom: rem(10),
      gap: rem(8),
    },
  },
  loaderWrapper: {
    height: "100%",
    width: "100%",
    backgroundColor: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
}));

const VideoCall = () => {
  const location = useLocation();
  const requestData = location.state || {};
  const userId = requestData?.chatPerson?.user;
  const frndId = requestData?.chatPerson?.fUser;
  const { classes } = useStyles();

  const [loading, setLoading] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [mediaError, setMediaError] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const ws = useRef<WebSocket | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);

  // WebSocket setup
  useEffect(() => {
    const socket = CreateWebSocketConnection(`/vc?userId=${userId}`);
    socket.onopen = () => {
      socket.send(userId); // Initial handshake
    };
    socket.onmessage = async (message) => {
      const { type, data } = JSON.parse(message.data);

      if (type === "offer") {
        await ensurePeer();
        await peerConnection.current!.setRemoteDescription(
          new RTCSessionDescription(data)
        );
        const answer = await peerConnection.current!.createAnswer();
        await peerConnection.current!.setLocalDescription(answer);
        sendSignal("answer", answer);
      }

      if (type === "answer") {
        await peerConnection.current!.setRemoteDescription(
          new RTCSessionDescription(data)
        );
      }

      if (type === "ice-candidate") {
        await peerConnection.current!.addIceCandidate(
          new RTCIceCandidate(data)
        );
      }
    };
    ws.current = socket;
  }, []);

  // Media device setup
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStream.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play();
        }
        setLoading(false);
        setMediaError(false);
      })
      .catch((err) => {
        console.error("Camera/mic not found:", err);
        setMediaError(true);
        setLoading(false);
      });
  }, []);

  const ensurePeer = async () => {
    if (peerConnection.current) return;

    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    localStream.current?.getTracks().forEach((track) =>
      peer.addTrack(track, localStream.current!)
    );

    peer.onicecandidate = (e) => {
      if (e.candidate) sendSignal("ice-candidate", e.candidate);
    };

    peer.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        remoteVideoRef.current.play();
      }
    };

    peerConnection.current = peer;
  };

  const sendSignal = (type: string, data: any) => {
    const msg = JSON.stringify({ type, data });
    ws.current?.send(frndId.padEnd(36) + msg);
  };

  const startCall = async () => {
    await ensurePeer();
    const offer = await peerConnection.current!.createOffer();
    await peerConnection.current!.setLocalDescription(offer);
    sendSignal("offer", offer);
  };

  const toggleMic = () => {
    setMicOn((prev) => !prev);
    localStream.current
      ?.getAudioTracks()
      .forEach((track) => (track.enabled = !micOn));
  };

  const endCall = () => {
    localStream.current?.getTracks().forEach((track) => track.stop());
    peerConnection.current?.close();
    alert("Call ended.");
  };

  if (loading) {
    return (
      <Box className={classes.loaderWrapper}>
        <Loader color="pink" size="xl" />
        <Text mt="md" color="gray" fw={600}>
          Connecting your love line...
        </Text>
      </Box>
    );
  }

  if (mediaError) {
    return (
      <Box className={classes.loaderWrapper}>
        <Text color="red" size="xl" fw={700}>
          No camera or microphone found!
        </Text>
        <Text color="gray" size="md" mt="sm">
          Please connect a device and allow permissions.
        </Text>
      </Box>
    );
  }

  return (
    <Box className={classes.wrapper}>
      <Box className={classes.videoContainer}>
        <video
          ref={remoteVideoRef}
          className={classes.remoteVideo}
          playsInline
          autoPlay
        />
        <video
          ref={localVideoRef}
          className={classes.localVideo}
          muted
          playsInline
          autoPlay
        />
      </Box>

      <Group className={classes.controls}>
        <Tooltip label={micOn ? "Mute" : "Unmute"}>
          <ActionIcon
            size="lg"
            variant="light"
            color={micOn ? "green" : "red"}
            onClick={toggleMic}
          >
            {micOn ? <IconMicrophone /> : <IconMicrophoneOff />}
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Start Call">
          <ActionIcon
            size="lg"
            variant="filled"
            color="blue"
            onClick={startCall}
          >
            <IconVideo />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="End Call">
          <ActionIcon size="lg" variant="filled" color="red" onClick={endCall}>
            <IconPhoneOff />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Box>
  );
};

export default VideoCall;
