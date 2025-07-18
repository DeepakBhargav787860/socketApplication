import { useEffect, useRef, useState } from "react";
import {
  Button,
  Center,
  Stack,
  Text,
  Loader,
  Group,
  Box,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconPhoneOff,
  IconMicrophone,
  IconMicrophoneOff,
  IconVideo,
  IconVideoOff,
} from "@tabler/icons-react";
import { CreateWebSocketConnection } from "@/lib/Api";
import { useLocation } from "react-router-dom";

const VideoCall = () => {
  const location = useLocation();
  const requestData = location.state || [];
  let userId: any = requestData?.userId;
  let friendId: any = requestData?.friendId;

  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const [isCalling, setIsCalling] = useState(false);
  const [connected, setConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoHidden, setVideoHidden] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);

  const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const safeSend = (message: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log("send", message);
      console.log(
        "socketRef.current?.readyState",
        socketRef.current?.readyState
      );
      console.log("WebSocket.OPEN", WebSocket.OPEN);
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("Socket not open. Message not sent:", message);
    }
  };

  const toggleMute = () => {
    if (!localStream.current) return;
    localStream.current.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setIsMuted((prev) => !prev);
  };

  const toggleVideo = () => {
    if (!localStream.current) return;
    localStream.current.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    setVideoHidden((prev) => !prev);
  };

  const endCall = () => {
    peerRef.current?.close();
    peerRef.current = null;
    setIsCalling(false);
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
    }
    if (localVideo.current) localVideo.current.srcObject = null;
    if (remoteVideo.current) remoteVideo.current.srcObject = null;
    safeSend({ type: "end-call", target: friendId });
  };

  const startCall = async () => {
    try {
      setIsCalling(true);
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideo.current) {
        localVideo.current.srcObject = localStream.current;
      }

      peerRef.current = new RTCPeerConnection(servers);

      localStream.current.getTracks().forEach((track) => {
        peerRef.current!.addTrack(track, localStream.current!);
      });

      peerRef.current.onicecandidate = (e) => {
        if (e.candidate) {
          safeSend({
            type: "ice-candidate",
            target: friendId,
            candidate: e.candidate,
          });
        }
      };

      peerRef.current.ontrack = (e) => {
        if (remoteVideo.current) {
          remoteVideo.current.srcObject = e.streams[0];
        }
      };

      const offer = await peerRef.current.createOffer();
      await peerRef.current.setLocalDescription(offer);

      safeSend({ type: "offer", target: friendId, offer });
    } catch (error) {
      console.error("Error starting call:", error);
      setIsCalling(false);
    }
  };

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    setIncomingCall(true);
    const acceptCall = confirm("You have an incoming call. Join?");
    if (!acceptCall) return;

    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideo.current) {
        localVideo.current.srcObject = localStream.current;
      }

      peerRef.current = new RTCPeerConnection(servers);

      localStream.current.getTracks().forEach((track) => {
        peerRef.current!.addTrack(track, localStream.current!);
      });

      peerRef.current.onicecandidate = (e) => {
        if (e.candidate) {
          safeSend({
            type: "ice-candidate",
            target: friendId,
            candidate: e.candidate,
          });
        }
      };

      peerRef.current.ontrack = (e) => {
        if (remoteVideo.current) {
          remoteVideo.current.srcObject = e.streams[0];
        }
      };

      await peerRef.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);

      safeSend({ type: "answer", target: friendId, answer });
      setIsCalling(true);
    } catch (err) {
      console.error("Error handling offer:", err);
    }
  };

  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    await peerRef.current?.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  };

  const handleICE = async (candidate: RTCIceCandidateInit) => {
    try {
      await peerRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error("ICE Error", err);
    }
  };

  useEffect(() => {
    console.log("1");
    const socket = CreateWebSocketConnection(`/vc?id=${userId}`);
    socketRef.current = socket;
    console.log("2");
    const onSocketMessage = (msg: MessageEvent) => {
      const data = JSON.parse(msg.data);
      console.log("3");
      if (data.type === "connection") console.log("Connection established");
      if (data.type === "offer") handleOffer(data.offer);
      if (data.type === "answer") handleAnswer(data.answer);
      if (data.type === "ice-candidate") handleICE(data.candidate);
      if (data.type === "end-call") endCall();
    };

    const onOpen = () => setConnected(true);
    const onClose = () => setConnected(false);

    socket.addEventListener("message", onSocketMessage);
    socket.addEventListener("open", onOpen);
    socket.addEventListener("close", onClose);

    return () => {
      socket.removeEventListener("message", onSocketMessage);
      socket.removeEventListener("open", onOpen);
      socket.removeEventListener("close", onClose);
      socket.close();
    };
  }, [userId]);

  return (
    <Stack spacing="md" align="center" px="md" py="lg">
      <Text fw={600} size="lg">
        Video Call
      </Text>

      <Group>
        <Button onClick={startCall} disabled={!connected || isCalling}>
          {isCalling ? "Calling..." : "Start Call"}
        </Button>
        <ActionIcon
          variant="light"
          onClick={toggleMute}
          color={isMuted ? "red" : "green"}
        >
          {isMuted ? <IconMicrophoneOff /> : <IconMicrophone />}
        </ActionIcon>
        <ActionIcon
          variant="light"
          onClick={toggleVideo}
          color={videoHidden ? "red" : "green"}
        >
          {videoHidden ? <IconVideoOff /> : <IconVideo />}
        </ActionIcon>
        <ActionIcon variant="light" onClick={endCall} color="red">
          <IconPhoneOff />
        </ActionIcon>
        {!connected && <Loader size="sm" color="red" />}
      </Group>

      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <video
          ref={localVideo}
          autoPlay
          muted
          playsInline
          style={{ width: "100%", borderRadius: "8px" }}
        />
        <video
          ref={remoteVideo}
          autoPlay
          playsInline
          style={{ width: "100%", borderRadius: "8px" }}
        />
      </Box>
    </Stack>
  );
};

export default VideoCall;

// import { useEffect, useRef, useState } from "react";
// import { Button, Center, Stack, Text, Loader, Group, Box } from "@mantine/core";
// import { CreateWebSocketConnection } from "@/lib/Api";
// import { useLocation } from "react-router-dom";

// interface VideoCallProps {
//   userId: string;
//   friendId: string;
// }

// const VideoCall = () => {
//   const location = useLocation();
//   const requestData = location.state || [];
//   console.log("requestedData", requestData);
//   let userId: any = requestData?.userId;
//   let friendId: any = requestData?.friendId;
//   const localVideo = useRef<HTMLVideoElement>(null);
//   const remoteVideo = useRef<HTMLVideoElement>(null);
//   const peerRef = useRef<RTCPeerConnection | null>(null);
//   const localStream = useRef<MediaStream | null>(null);
//   const socketRef = useRef<WebSocket | null>(null);

//   const [isCalling, setIsCalling] = useState(false);
//   const [connected, setConnected] = useState(false);

//   const servers = {
//     iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//   };

//   const safeSend = (message: any) => {
//     if (socketRef.current?.readyState === WebSocket.OPEN) {
//       socketRef.current.send(JSON.stringify(message));
//     } else {
//       console.warn("Socket not open. Message not sent:", message);
//     }
//   };

//   const startCall = async () => {
//     try {
//       setIsCalling(true);
//       localStream.current = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });

//       if (localVideo.current) {
//         localVideo.current.srcObject = localStream.current;
//       }

//       peerRef.current = new RTCPeerConnection(servers);

//       localStream.current.getTracks().forEach((track) => {
//         peerRef.current!.addTrack(track, localStream.current!);
//       });

//       peerRef.current.onicecandidate = (e) => {
//         if (e.candidate) {
//           safeSend({
//             type: "ice-candidate",
//             target: friendId,
//             candidate: e.candidate,
//           });
//         }
//       };

//       peerRef.current.ontrack = (e) => {
//         if (remoteVideo.current) {
//           remoteVideo.current.srcObject = e.streams[0];
//         }
//       };

//       const offer = await peerRef.current.createOffer();
//       await peerRef.current.setLocalDescription(offer);

//       safeSend({
//         type: "offer",
//         target: friendId,
//         offer,
//       });
//     } catch (error) {
//       console.error("Error starting call:", error);
//       setIsCalling(false);
//     }
//   };

//   const handleOffer = async (offer: RTCSessionDescriptionInit) => {
//     try {
//       localStream.current = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });

//       if (localVideo.current) {
//         localVideo.current.srcObject = localStream.current;
//       }

//       peerRef.current = new RTCPeerConnection(servers);

//       localStream.current.getTracks().forEach((track) => {
//         peerRef.current!.addTrack(track, localStream.current!);
//       });

//       peerRef.current.onicecandidate = (e) => {
//         if (e.candidate) {
//           safeSend({
//             type: "ice-candidate",
//             target: friendId,
//             candidate: e.candidate,
//           });
//         }
//       };

//       peerRef.current.ontrack = (e) => {
//         if (remoteVideo.current) {
//           remoteVideo.current.srcObject = e.streams[0];
//         }
//       };

//       await peerRef.current.setRemoteDescription(
//         new RTCSessionDescription(offer)
//       );
//       const answer = await peerRef.current.createAnswer();
//       await peerRef.current.setLocalDescription(answer);

//       safeSend({
//         type: "answer",
//         target: friendId,
//         answer,
//       });
//     } catch (err) {
//       console.error("Error handling offer:", err);
//     }
//   };

//   const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
//     await peerRef.current?.setRemoteDescription(
//       new RTCSessionDescription(answer)
//     );
//   };

//   const handleICE = async (candidate: RTCIceCandidateInit) => {
//     try {
//       await peerRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
//     } catch (err) {
//       console.error("ICE Error", err);
//     }
//   };

//   useEffect(() => {
//     const socket = CreateWebSocketConnection(`/vc?id=${userId}`);
//     socketRef.current = socket;

//     const onSocketMessage = (msg: MessageEvent) => {
//       const data = JSON.parse(msg.data);
//       if (data.type == "connection") {
//         console.log("connection stablish");
//       }
//       if (data.type === "offer") handleOffer(data.offer);
//       if (data.type === "answer") handleAnswer(data.answer);
//       if (data.type === "ice-candidate") handleICE(data.candidate);
//     };

//     const onOpen = () => setConnected(true);
//     const onClose = () => setConnected(false);

//     socket.addEventListener("message", onSocketMessage);
//     socket.addEventListener("open", onOpen);
//     socket.addEventListener("close", onClose);

//     return () => {
//       socket.removeEventListener("message", onSocketMessage);
//       socket.removeEventListener("open", onOpen);
//       socket.removeEventListener("close", onClose);
//       socket.close();
//     };
//   }, [userId]);

//   return (
//     <Stack spacing="md" align="center" px="md" py="lg">
//       <Text fw={600} size="lg">
//         Video Call
//       </Text>

//       <Group>
//         <Button onClick={startCall} disabled={!connected || isCalling}>
//           {isCalling ? "Calling..." : "Start Call"}
//         </Button>
//         {!connected && <Loader size="sm" color="red" />}
//       </Group>

//       <Box
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           gap: "1rem",
//           width: "100%",
//           maxWidth: "500px",
//         }}
//       >
//         <video
//           ref={localVideo}
//           autoPlay
//           muted
//           playsInline
//           style={{ width: "100%", borderRadius: "8px" }}
//         />
//         <video
//           ref={remoteVideo}
//           autoPlay
//           playsInline
//           style={{ width: "100%", borderRadius: "8px" }}
//         />
//       </Box>
//     </Stack>
//   );
// };

// export default VideoCall;
