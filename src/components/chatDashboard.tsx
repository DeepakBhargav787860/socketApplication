import {
  Box,
  Grid,
  Title,
  Text,
  Stack,
  useMantineTheme,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconMessage,
  IconSend,
  IconInbox,
  IconUserPlus,
  IconHelpCircle,
  IconX,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import API from "@/lib/Api";
import { showNotification } from "@mantine/notifications";

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
`;

const ChatDashboard = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  let pId = Number(localStorage.getItem("id"));
  const [getRequest, setRequest] = useState<any>([]);

  const { isLoading: findUserLoading, mutate: sendRequest } = useMutation<
    any,
    Error
  >(
    async () => {
      return await API.post<any>(
        "/getRequestSend",
        { id: pId },
        { withCredentials: true }
      );
    },
    {
      onSuccess: (response) => {
        setRequest(response?.data?.data);
      },
      onError: (errMsg: any) => {
        showNotification({
          title: "Error",
          message: errMsg?.response?.data || "Something went wrong",
          color: "red",
          icon: <IconX />,
        });
      },
    }
  );

  useEffect(() => {
    sendRequest();
  }, []);

  const cards = [
    {
      title: "Start Chat",
      icon: <IconMessage size={32} />,
      color: theme.colors.blue[6],
      bg: theme.colors.blue[0],
      link: "/activeUser",
      count: 0,
      state: {},
    },
    {
      title: "Sent Requests",
      icon: <IconSend size={32} />,
      color: theme.colors.green[6],
      bg: theme.colors.green[0],
      link: "/sentRequest",
      count:
        Array.isArray(getRequest) && getRequest.length > 0
          ? getRequest.length
          : 0,
      state: { state: getRequest },
    },
    {
      title: "Incoming Requests",
      icon: <IconInbox size={32} />,
      color: theme.colors.orange[6],
      bg: theme.colors.orange[0],
      link: "/inComingRequest",
      count: 0,
      state: {},
    },
    {
      title: "Requested Users",
      icon: <IconUserPlus size={32} />,
      color: theme.colors.pink[6],
      bg: theme.colors.pink[0],
      link: "/requestedUser",
      count: 0,
      state: {},
    },
  ];

  return (
    <Box p="md" pos="relative">
      <Title order={2} mb="md" align="center" c="dark">
        Chat Dashboard
      </Title>

      <Grid gutter="md">
        {cards.map((card, index) => (
          <Grid.Col key={index} xs={12} sm={6}>
            <Box
              bg={card.bg}
              p="lg"
              onClick={() => navigate(card.link, card.state)}
              style={{
                borderRadius: "16px",
                boxShadow: theme.shadows.sm,
                transition: "transform 0.2s ease",
                cursor: "pointer",
                position: "relative",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              {/* Count Bubble */}
              {card.count > 0 && (
                <Box
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: theme.colors.red[6],
                    color: "white",
                    borderRadius: "50%",
                    width: 24,
                    height: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    zIndex: 1,
                  }}
                >
                  {card.count}
                </Box>
              )}

              <Stack align="center" spacing="xs">
                <Box c={card.color}>{card.icon}</Box>
                <Text size="lg" fw={600} c={card.color}>
                  {card.title}
                </Text>
              </Stack>
            </Box>
          </Grid.Col>
        ))}
      </Grid>

      {/* Floating Query Button */}
      <Tooltip
        label="Have a question? Open Query Tool!"
        position="left"
        withArrow
      >
        <ActionIcon
          size="xl"
          radius="xl"
          color="violet"
          variant="filled"
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            animation: `${blink} 1.5s infinite`,
            zIndex: 999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
          onClick={() => navigate("/queryTool")}
        >
          <IconHelpCircle size={28} />
        </ActionIcon>
      </Tooltip>
    </Box>
  );
};

export default ChatDashboard;
