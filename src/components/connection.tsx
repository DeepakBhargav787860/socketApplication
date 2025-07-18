import {
  Box,
  Button,
  Group,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  rem,
  createStyles,
  ActionIcon,
  Loader,
  Center,
} from "@mantine/core";
import {
  IconSend,
  IconArrowLeft,
  IconHeartFilled,
  IconX,
  IconVideo,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateWebSocketConnection } from "@/lib/Api";
import { showNotification } from "@mantine/notifications";
import IsEmptyOrZeroOrUndefined from "@/utils/utils";

const useStyles = createStyles((theme) => ({
  chatWrapper: {
    height: "100vh",
    backgroundImage: "url('/heart-bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    padding: rem(10),
    position: "relative",
    overflow: "hidden",
    "@media (max-width: 768px)": {
      padding: rem(5),
    },
    "::before": {
      content: '"Best Half"',
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%) rotate(-25deg)",
      fontSize: "18vw",
      color: "#00000015",
      fontWeight: 700,
      whiteSpace: "nowrap",
      zIndex: 0,
      pointerEvents: "none",
      userSelect: "none",
    },
  },
  beatingHeart: {
    position: "absolute",
    top: "60%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 0,
    opacity: 0.15,
    animation: "beat 1s infinite ease-in-out",
    pointerEvents: "none",
  },
  "@keyframes beat": {
    "0%": { transform: "translate(-50%, -50%) scale(1)" },
    "50%": { transform: "translate(-50%, -50%) scale(1.2)" },
    "100%": { transform: "translate(-50%, -50%) scale(1)" },
  },
  messageBox: {
    maxWidth: "75%",
    padding: rem(10),
    borderRadius: rem(12),
    wordBreak: "break-word",
    zIndex: 1,
  },
  fromUser: {
    backgroundColor: theme.colors.blue[1],
    alignSelf: "flex-end",
  },
  fromFriend: {
    backgroundColor: theme.colors.gray[2],
    alignSelf: "flex-start",
  },
  inputArea: {
    borderTop: `1px solid ${theme.colors.gray[3]}`,
    paddingTop: rem(8),
    marginTop: rem(6),
    zIndex: 1,
  },
  inputRow: {
    display: "flex",
    flexDirection: "row",
    gap: rem(6),
    flexWrap: "wrap",
    alignItems: "center",
    width: "100%",
  },
  textInput: {
    flex: 1,
    minWidth: "140px",
  },
  micStart: {
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "8px 14px",
    fontSize: "14px",
    cursor: "pointer",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "@media (max-width: 768px)": {
      padding: "6px 10px",
      fontSize: "13px",
    },
  },
  micStop: {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "8px 14px",
    fontSize: "14px",
    cursor: "pointer",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "@media (max-width: 768px)": {
      padding: "6px 10px",
      fontSize: "13px",
    },
  },
  loaderScreen: {
    height: "100vh",
    backgroundColor: theme.colors.pink[0],
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: rem(20),
  },
  videoCallButton: {
    position: "absolute",
    bottom: rem(60),
    right: rem(20),
    zIndex: 0,
    backgroundColor: "#ff69b4",
    borderRadius: "50%",
    width: rem(50),
    height: rem(50),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    cursor: "pointer",
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "scale(1.1)",
    },
    "@media (max-width: 768px)": {
      bottom: rem(70),
      right: rem(10),
      width: rem(44),
      height: rem(44),
    },
  },
}));

const ChatWindow = ({ chatPerson }: any) => {
  const pId = Number(localStorage.getItem("id"));
  const { classes, cx } = useStyles();
  const [messages, setMessages] = useState<any>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const lastTypingState = useRef(false);
  const navigate = useNavigate();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const notificationSound = new Audio(
    "https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3"
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    socketRef.current = CreateWebSocketConnection(
      `/chatWindow?userId=${pId}&friendId=${chatPerson.fUser}`
    );

    socketRef.current.onopen = () => console.log("WebSocket connected ✅");

    socketRef.current.onmessage = (event) => {
      try {
        const data: any = JSON.parse(event.data);

        if (data.type === "error") {
          console.log("error");
          return;
        }

        if (Array.isArray(data)) {
          console.log("datachat", data);
          setMessages((prev) => [...prev, ...data]);
        } else if (data.type === "typing") {
          setIsTyping(true);
        } else if (data.type === "stop_typing") {
          setIsTyping(false);
        } else {
          if (data?.friendId == pId) {
            notificationSound.play().then(() => {
              setTimeout(() => {
                notificationSound.pause();
                notificationSound.currentTime = 0;
              }, 2000);
            });
          }

          setMessages((prev) => [...prev, data]);
        }
      } catch (e) {
        console.error("Invalid JSON received:", e);
      }
    };

    return () => socketRef.current?.close();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setInput(value);

    const isTypingNow = value.trim().length > 0;

    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN &&
      isTypingNow !== lastTypingState.current
    ) {
      lastTypingState.current = isTypingNow;

      socketRef.current.send(
        JSON.stringify({
          type: isTypingNow ? "typing" : "stop_typing",
          userProfileId: pId,
          friendId: chatPerson.fUser,
        })
      );
    }
  };

  const sendMessage = () => {
    if (input.trim() === "") return;

    const message = {
      type: "message",
      userProfileId: pId,
      friendId: chatPerson.fUser,
      content: input,
    };

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
      socketRef.current.send(
        JSON.stringify({
          type: "stop_typing",
          userProfileId: pId,
          friendId: chatPerson.fUser,
        })
      );
    }

    lastTypingState.current = false;
    setInput("");
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: "audio/webm" });
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64Audio = reader.result?.toString().split(",")[1] || "";
          if (!base64Audio) {
            showNotification({
              title: "Error",
              message: "Empty recording not sent.",
              color: "red",
              icon: <IconX />,
            });
            return;
          }

          if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(
              JSON.stringify({
                type: "voice",
                userProfileId: pId,
                friendId: chatPerson.fUser,
                audioData: base64Audio,
              })
            );
          }
        };

        reader.readAsDataURL(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      showNotification({
        title: "Mic Error",
        message: "Please allow microphone permission.",
        color: "red",
        icon: <IconX />,
      });
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const toggleAudio = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const audio = e.currentTarget.nextElementSibling as HTMLAudioElement;
    if (!audio) return;

    document.querySelectorAll("audio").forEach((el) => {
      if (el !== audio) {
        el.pause();
        el.currentTime = 0;
      }
    });

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  if (loading) {
    return (
      <Box className={classes.loaderScreen}>
        <Loader color="pink" size="xl" />
        <Text mt="md" size="lg" color="pink" fw={700}>
          Connecting to your Best Half...
        </Text>
      </Box>
    );
  }

  return (
    <Box className={classes.chatWrapper}>
      <IconHeartFilled
        size={100}
        className={classes.beatingHeart}
        color="pink"
      />

      <ActionIcon
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 2,
          backgroundColor: "pink",
        }}
        size="lg"
        radius="xl"
        variant="filled"
      >
        <IconArrowLeft size={20} />
      </ActionIcon>

      {isTyping && (
        <Center mb="xs">
          <Text size="sm" color="gray">
            Typing...
          </Text>
        </Center>
      )}

      <ScrollArea
        style={{
          flex: 1,
          maxHeight: "calc(100vh - 160px)",
          overflow: "auto",
        }}
        viewportRef={scrollRef}
      >
        <Stack spacing="xs">
          {messages.map((msg, index) => {
            const isFromUser = msg.userProfileId === pId;
            const isVoiceNote = !IsEmptyOrZeroOrUndefined(msg.filePath);

            return (
              <Box
                key={index}
                className={cx(classes.messageBox, {
                  [classes.fromUser]: isFromUser && !isVoiceNote,
                  [classes.fromFriend]: !isFromUser && !isVoiceNote,
                })}
                style={{
                  maxWidth: "90%",
                  wordWrap: "break-word",
                  backgroundColor: isVoiceNote
                    ? isFromUser
                      ? "#d0f0c0"
                      : "#e1e8ff"
                    : undefined,
                }}
              >
                {isVoiceNote ? (
                  <Box style={{ width: "100%" }}>
                    <Text
                      size="xs"
                      color="blue"
                      style={{ cursor: "pointer", marginBottom: 6 }}
                      onClick={toggleAudio}
                    >
                      🔊 Play / ⏸️ Pause
                    </Text>

                    <audio
                      onEnded={(e) => {
                        const audio = e.currentTarget;
                        audio.pause();
                        audio.currentTime = 0;
                      }}
                      style={{
                        width: "100%",
                        maxWidth: "100%",
                        outline: "none",
                        borderRadius: "8px",
                      }}
                    >
                      <source src={msg.filePath} type="audio/webm" />
                      Your browser does not support the audio element.
                    </audio>
                  </Box>
                ) : (
                  <Text size="sm">{msg.content}</Text>
                )}
              </Box>
            );
          })}
        </Stack>
      </ScrollArea>
      {/* Video Call Button */}

      <Box className={classes.inputArea}>
        <Stack spacing="xs">
          {/* Text input + Send button */}
          <Group className={classes.inputRow}>
            <TextInput
              className={classes.textInput}
              placeholder={isTyping ? "Typing.....💍" : "Type a message..."}
              value={input}
              onChange={handleTyping}
            />
            <Button color="blue" onClick={sendMessage}>
              <IconSend size={18} />
            </Button>
          </Group>

          {/* Audio + Video Buttons */}
          <Group
            spacing="sm"
            grow
            align="center"
            position="apart"
            style={{ flexWrap: "wrap" }}
          >
            {!isRecording ? (
              <button className={classes.micStart} onClick={startRecording}>
                🎤 Start
              </button>
            ) : (
              <button className={classes.micStop} onClick={stopRecording}>
                ⏹ Stop
              </button>
            )}

            <ActionIcon
              onClick={() =>
                navigate("/videoCall", {
                  state: {
                    userId: pId,
                    friendId: chatPerson.fUser,
                  },
                })
              }
              variant="filled"
              size="lg"
              style={{
                backgroundColor: "#ff69b4",
                width: "44px",
                height: "44px",
              }}
            >
              <IconVideo color="white" size={22} />
            </ActionIcon>
          </Group>
        </Stack>
      </Box>
    </Box>
  );
};

export default ChatWindow;
