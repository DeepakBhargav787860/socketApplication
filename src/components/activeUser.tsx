import { Avatar, Box, Stack, Text, Group } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";

const dummyUsers = [
  { name: "Priya Sharma", image: null },
  { name: "Ravi Mehta", image: null },
  { name: "Sneha Kapoor", image: null },
  { name: "Arjun Verma", image: null },
  { name: "Megha Singh", image: null },
];

const ActiveUser = () => {
  return (
    <Box p="md">
      <Stack spacing="sm">
        {dummyUsers.map((user, index) => (
          <Box
            key={index}
            p="sm"
            bg="gray.0"
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.01)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Group>
              <Avatar color="indigo" radius="xl" size="md" src={user.image}>
                <IconUser size={18} />
              </Avatar>
              <Text fw={500} size="md" c="gray.8">
                {user.name}
              </Text>
            </Group>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default ActiveUser;
