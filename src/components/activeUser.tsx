import {
  Avatar,
  Box,
  Stack,
  Text,
  Group,
  Loader,
  Title,
  ScrollArea,
  rem,
  createStyles,
} from "@mantine/core";
import { IconUser, IconX } from "@tabler/icons-react";
import Logout from "./logout";
import { useMutation } from "@tanstack/react-query";
import API from "@/lib/Api";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Gradient ring styles like Instagram
const useStyles = createStyles((theme) => ({
  gradientRing: {
    background:
      "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
    padding: rem(2.5),
    borderRadius: "50%",
    display: "inline-block",
  },
  avatarBox: {
    backgroundColor: theme.colors.white,
    padding: rem(2),
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  userCard: {
    borderRadius: rem(16),
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    transition: "transform 0.2s ease",
    padding: rem(12),
    backgroundColor: theme.colors.gray[0],
    "&:hover": {
      transform: "scale(1.02)",
    },
  },
  userName: {
    fontSize: rem(16),
    fontWeight: 600,
    color: theme.colors.dark[5],
    fontFamily: `'Poppins', sans-serif`,
  },
}));

const ActiveUser = () => {
  const navigate = useNavigate();
  const { classes } = useStyles();
  let pId = Number(localStorage.getItem("id"));
  const [actUser, setActUser] = useState<any>([]);
  const { isLoading: activeUserLoading, mutate: activeUSer } = useMutation<
    any,
    Error
  >(
    async () => {
      return await API.post<any>(
        "/activeUser",
        { id: pId },
        { withCredentials: true }
      );
    },
    {
      onSuccess: (response) => {
        setActUser(response?.data?.data);
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
    activeUSer();
  }, []);

  const handleChatFun = (
    pId: number,
    frndId: number,
    pUser: string,
    fUser: string
  ) => {
    console.log("data get", pId, frndId);
    navigate("/startChat", {
      state: { pId: pId, frndId: frndId, pUser: pUser, fUser: fUser },
    });
  };

  const data = actUser.map((user, index) => {
    if (pId === user?.userProfileId) {
      return (
        <Box key={index} className={classes.userCard}>
          <Group spacing="sm">
            <Box className={classes.gradientRing}>
              <Box className={classes.avatarBox}>
                <Avatar radius="xl" size="md" src={user.image}>
                  <IconUser size={18} />
                </Avatar>
              </Box>
            </Box>
            <Text
              onClick={() =>
                handleChatFun(
                  pId,
                  user?.pd,
                  user?.userProfileData?.username,
                  user?.requestData?.username
                )
              }
              className={classes.userName}
            >
              {user?.requestData?.username}
            </Text>
          </Group>
        </Box>
      );
    } else {
      return (
        <Box key={index} className={classes.userCard}>
          <Group spacing="sm">
            <Box className={classes.gradientRing}>
              <Box className={classes.avatarBox}>
                <Avatar radius="xl" size="md" src={user.image}>
                  <IconUser size={18} />
                </Avatar>
              </Box>
            </Box>
            <Text
              onClick={() =>
                handleChatFun(
                  user?.pd,
                  user?.userProfileId,
                  user?.requestData?.username,
                  user?.userProfileData?.username
                )
              }
              className={classes.userName}
            >
              {user?.userProfileData?.username}
            </Text>
          </Group>
        </Box>
      );
    }
  });

  console.log("datas", actUser);
  return (
    <Box p={{ base: "sm", sm: "md" }} style={{ position: "relative" }}>
      {activeUserLoading ? (
        <Stack align="center" justify="center" h="100%">
          <Loader color="blue" size="lg" />
          <Title order={3} c="blue.6">
            Processing...
          </Title>
          <Text c="gray.6" size="sm">
            Please wait while we fetch your active user.
          </Text>
        </Stack>
      ) : Array.isArray(actUser) && actUser?.length > 0 ? (
        <ScrollArea h="calc(100vh - 140px)">
          <Stack spacing="sm">{data}</Stack>
        </ScrollArea>
      ) : (
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            textAlign: "center",
            backgroundColor: "#f8f9fa",
            borderRadius: "12px",
            marginTop: "2rem",
          }}
        >
          <Text
            size="md"
            fw={500}
            c="gray.7"
            style={{
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            😔 No active users found
          </Text>
          <Text size="xs" c="gray.6" mt={4}>
            Looks like you're the only one here right now.
          </Text>
        </Box>
      )}

      {/* Logout button bottom-left fixed */}
      <Box
        style={{
          position: "fixed",
          bottom: rem(16),
          left: rem(16),
          zIndex: 1,
        }}
      >
        <Logout />
      </Box>
    </Box>
  );
};

export default ActiveUser;
