import {
  Box,
  Button,
  Center,
  Flex,
  Group,
  Loader,
  Stack,
  Text,
  rem,
  createStyles,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconPhoneOff,
  IconMicrophone,
  IconMicrophoneOff,
  IconVideo,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

const useStyles = createStyles((theme) => ({
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
  const { classes } = useStyles();
  const [loading, setLoading] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Simulate connection delay
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Dummy setup - replace with WebRTC stream setup
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play();
        }

        // Simulate remote video with same stream (for demo only)
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
          remoteVideoRef.current.play();
        }
      });
  }, []);

  const toggleMic = () => {
    setMicOn((prev) => !prev);
    const stream = localVideoRef.current?.srcObject as MediaStream;
    stream?.getAudioTracks().forEach((track) => (track.enabled = !micOn));
  };

  const endCall = () => {
    const stream = localVideoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
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

  return (
    <Box className={classes.wrapper}>
      <Box className={classes.videoContainer}>
        <video ref={remoteVideoRef} className={classes.remoteVideo} muted />
        <video ref={localVideoRef} className={classes.localVideo} muted />
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
