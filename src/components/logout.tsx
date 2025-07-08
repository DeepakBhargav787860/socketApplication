import { ActionIcon, Box, Tooltip } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";

const Logout = () => {
  const handleLogout = () => {
    // Add logout logic here (e.g., clearing tokens, redirect)
    console.log("Logged out");
  };

  return (
    <Box
      style={{
        position: "fixed",
        bottom: 16,
        left: 16,
        zIndex: 1,
      }}
    >
      <Tooltip label="Logout" position="right" withArrow>
        <ActionIcon
          variant="light"
          color="red"
          size="xl"
          radius="xl"
          onClick={handleLogout}
        >
          <IconLogout size={22} />
        </ActionIcon>
      </Tooltip>
    </Box>
  );
};

export default Logout;
