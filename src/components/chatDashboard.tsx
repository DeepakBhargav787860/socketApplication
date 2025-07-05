import {
  Box,
  Grid,
  Title,
  Text,
  Stack,
  useMantineTheme,
} from '@mantine/core';
import {
  IconMessage,
  IconSend,
  IconInbox,
  IconUserPlus,
} from '@tabler/icons-react';

const ChatDashboard = () => {
  const theme = useMantineTheme();

  const cards = [
    {
      title: 'Start Chat',
      icon: <IconMessage size={32} />,
      color: theme.colors.blue[6],
      bg: theme.colors.blue[0],
    },
    {
      title: 'Sent Requests',
      icon: <IconSend size={32} />,
      color: theme.colors.green[6],
      bg: theme.colors.green[0],
    },
    {
      title: 'Incoming Requests',
      icon: <IconInbox size={32} />,
      color: theme.colors.orange[6],
      bg: theme.colors.orange[0],
    },
    {
      title: 'Requested Users',
      icon: <IconUserPlus size={32} />,
      color: theme.colors.pink[6],
      bg: theme.colors.pink[0],
    },
  ];

  return (
    <Box p="md">
      <Title order={2} mb="md" align="center" c="dark">
        Chat Dashboard
      </Title>
      <Grid gutter="md">
        {cards.map((card, index) => (
          <Grid.Col key={index} xs={12} sm={6}>
            <Box
              bg={card.bg}
              p="lg"
              style={{
                borderRadius: '16px',
                boxShadow: theme.shadows.sm,
                transition: 'transform 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
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
    </Box>
  );
};

export default ChatDashboard;
