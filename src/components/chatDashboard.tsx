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
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
`;

const ChatDashboard = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const cards = [
    {
      title: "Start Chat",
      icon: <IconMessage size={32} />,
      color: theme.colors.blue[6],
      bg: theme.colors.blue[0],
      link: "/activeUser",
    },
    {
      title: "Sent Requests",
      icon: <IconSend size={32} />,
      color: theme.colors.green[6],
      bg: theme.colors.green[0],
      link: "/sentRequest",
    },
    {
      title: "Incoming Requests",
      icon: <IconInbox size={32} />,
      color: theme.colors.orange[6],
      bg: theme.colors.orange[0],
      link: "/inComingRequest",
    },
    {
      title: "Requested Users",
      icon: <IconUserPlus size={32} />,
      color: theme.colors.pink[6],
      bg: theme.colors.pink[0],
      link: "/requestedUser",
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
              onClick={() => navigate(card.link)}
              style={{
                borderRadius: "16px",
                boxShadow: theme.shadows.sm,
                transition: "transform 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
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
