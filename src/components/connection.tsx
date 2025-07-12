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
import { IconSend, IconArrowLeft, IconHeartFilled } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateWebSocketConnection } from "@/lib/Api";

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
    paddingTop: rem(10),
    marginTop: rem(10),
    zIndex: 1,
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

  //sound
  // const notificationSound = new Audio("../src/assets/hello.mp3");
const notificationSound = new Audio("https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3");
  //sound

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
        const data = JSON.parse(event.data);

        if (data.type === "error") {
          console.error("⚠️ Server error:", data.error);
          return;
        }

        if (Array.isArray(data)) {
          if (chatPerson?.user != pId) {
            notificationSound
              .play()
              .then(() => {
                setTimeout(() => {
                  notificationSound.pause();
                  notificationSound.currentTime = 0; // reset to start
                }, 2000);
              })
              .catch((err) => {
                console.warn("🔇 Audio play error:", err);
              });
          }
          setMessages((prev) => [...prev, ...data]);
        } else if (data.type === "typing") {
          console.log("1");
          setIsTyping(true);
        } else if (data.type === "stop_typing") {
          console.log("2");
          setIsTyping(false);
        } else {
          if (chatPerson?.user != pId) {
            notificationSound
              .play()
              .then(() => {
                setTimeout(() => {
                  notificationSound.pause();
                  notificationSound.currentTime = 0; // reset to start
                }, 2000);
              })
              .catch((err) => {
                console.warn("🔇 Audio play error:", err);
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
  console.log("typinggggg", isTyping);
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

      <ScrollArea style={{ flex: 1 }} viewportRef={scrollRef}>
        <Stack spacing="xs">
          {messages.map((msg, index) => (
            <Box
              key={index}
              className={cx(classes.messageBox, {
                [classes.fromUser]: msg.userProfileId === pId,
                [classes.fromFriend]: msg.userProfileId !== pId,
              })}
            >
              <Text size="sm">{msg.content}</Text>
            </Box>
          ))}
        </Stack>
      </ScrollArea>

      <Box className={classes.inputArea}>
        <Group noWrap>
          <TextInput
            placeholder={isTyping ? "Typing.....💍" : "Type a message..."}
            value={input}
            onChange={handleTyping}
            style={{ flexGrow: 1 }}
          />
          <Button color="blue" onClick={sendMessage}>
            <IconSend size={18} />
          </Button>
        </Group>
      </Box>
    </Box>
  );
};

export default ChatWindow;
