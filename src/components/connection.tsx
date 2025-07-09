import {
  Avatar,
  Box,
  Button,
  Group,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  rem,
  createStyles,
} from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import Logout from "./logout";

const useStyles = createStyles((theme) => ({
  chatWrapper: {
    height: "100vh",
    backgroundImage: "url('/heart-bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    padding: rem(10),
  },
  messageBox: {
    maxWidth: "75%",
    padding: rem(10),
    borderRadius: rem(12),
    wordBreak: "break-word",
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
  },
}));

type Message = {
  from: "me" | "friend";
  text: string;
};

const dummyMessages: Message[] = [
  { from: "me", text: "Hey, how are you?" },
  { from: "friend", text: "I'm good! You?" },
  { from: "me", text: "Doing great 😄" },
  { from: "friend", text: "Let's meet this weekend." },
];

const ChatWindow = () => {
  const { classes, cx } = useStyles();
  const [messages, setMessages] = useState<Message[]>(dummyMessages);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket
    socketRef.current = new WebSocket("wss://example.com/chat");

    socketRef.current.onmessage = (event) => {
      try {
        const message: Message = JSON.parse(event.data);
        setMessages((prev) => [...prev, message]);
      } catch (e) {
        console.error("Invalid message:", e);
      }
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom on new message
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() === "") return;
    const message: Message = { from: "me", text: input };
    setMessages((prev) => [...prev, message]);

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    }

    setInput("");
  };

  return (
    <Box className={classes.chatWrapper}>
      <ScrollArea style={{ flex: 1 }} viewportRef={scrollRef}>
        <Stack spacing="xs">
          {messages.map((msg, index) => (
            <Box
              key={index}
              className={cx(classes.messageBox, {
                [classes.fromUser]: msg.from === "me",
                [classes.fromFriend]: msg.from === "friend",
              })}
            >
              <Text size="sm">{msg.text}</Text>
            </Box>
          ))}
        </Stack>
      </ScrollArea>

      <Box className={classes.inputArea}>
        <Group noWrap>
          <TextInput
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            style={{ flexGrow: 1 }}
          />
          <Button color="blue" onClick={sendMessage}>
            <IconSend size={18} />
          </Button>
        </Group>
      </Box>

      <Logout />
    </Box>
  );
};

export default ChatWindow;
