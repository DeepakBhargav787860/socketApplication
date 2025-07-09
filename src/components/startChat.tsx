import { Box, Text, Title, rem, createStyles } from "@mantine/core";
import { IconMessageCircle2 } from "@tabler/icons-react";
import Logout from "./logout";
import { useLocation } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: rem(16),
    backgroundColor: theme.colors.gray[0],
  },
  iconWrapper: {
    background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743)",
    padding: rem(16),
    borderRadius: "50%",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: rem(16),
  },
  icon: {
    color: theme.white,
  },
  title: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    color: theme.colors.dark[6],
    fontSize: rem(24),
    marginBottom: rem(8),
  },
  subtitle: {
    color: theme.colors.gray[6],
    fontSize: rem(14),
    marginBottom: rem(12),
  },
  usernameConnection: {
    fontSize: rem(18),
    fontWeight: 500,
    color: theme.colors.pink[6],
    fontFamily: "'Poppins', sans-serif",
    marginBottom: rem(24),
  },
}));

const StartChat = () => {
  const { classes } = useStyles();
  const location = useLocation();
  const requestData = location.state || [];
  const user = requestData?.pId;
  const fUser = requestData?.frndId;
  const username = requestData?.pUser;
  const fUsername = requestData?.fUser;

  return (
    <Box className={classes.container}>
      <Box className={classes.iconWrapper}>
        <IconMessageCircle2 size={40} className={classes.icon} />
      </Box>

      <Title order={2} className={classes.title}>
        Chat Starting...
      </Title>

      <Text className={classes.subtitle}>
        Hold on! We're connecting you with your best one 💬
      </Text>

      <Text className={classes.usernameConnection}>
        {username} ❤️ {fUsername}
      </Text>

      <Logout />
    </Box>
  );
};

export default StartChat;
