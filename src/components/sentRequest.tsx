import {
  Box,
  Loader,
  Stack,
  Text,
  Title,
  Card,
  Group,
  Avatar,
  Badge,
  Divider,
} from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const SentRequest = () => {
  const location = useLocation();
  const requestData = location.state || [];

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);
  console.log("requested data", requestData);
  return (
    <Box
      h="100vh"
      w="100%"
      px="md"
      py="lg"
      style={{
        background: "linear-gradient(135deg, #f0f4ff, #e3f9ff)",
        overflowY: "auto",
      }}
    >
      {loading ? (
        <Stack align="center" justify="center" h="100%">
          <Loader color="blue" size="lg" />
          <Title order={3} c="blue.6">
            Processing...
          </Title>
          <Text c="gray.6" size="sm">
            Please wait while we fetch your sent requests.
          </Text>
        </Stack>
      ) : (
        <>
          <Title order={2} align="center" mb="xl" c="blue.7">
            Sent Friend Requests
          </Title>

          <Stack spacing="md">
            {requestData.length === 0 ? (
              <Text align="center" c="gray.6">
                No sent requests found.
              </Text>
            ) : (
              requestData.map((item: any, index: number) => (
                <Card
                  key={item.uuid || index}
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                >
                  <Group position="apart">
                    <Group>
                      <Avatar color="blue" radius="xl">
                        <IconSend size={18} />
                      </Avatar>
                      <Box>
                        <Text fw={600}>
                          Request ID: {item?.requestData?.uuid}
                        </Text>
                        <Text fw={600} size="sm" c="gray.6">
                          USERNAME: {item?.requestData?.username}
                        </Text>

                        <Text fw={600} size="sm" c="gray.6">
                          Mobile NO.: {item?.requestData?.mobileNo}
                        </Text>
                      </Box>
                    </Group>

                    <Badge
                      color={
                        item.friendReqStatus === "YES"
                          ? "green"
                          : item.friendReqStatus == "NO"
                          ? "orange"
                          : "red"
                      }
                      variant="filled"
                    >
                      {item.friendReqStatus === "YES"
                        ? "Accepted"
                        : item.friendReqStatus == "NO"
                        ? "NO"
                        : item.friendReqStatus == "BLOCKED"
                        ? "Blocked"
                        : "Rejected"}
                    </Badge>
                  </Group>
                </Card>
              ))
            )}
          </Stack>
        </>
      )}
    </Box>
  );
};

export default SentRequest;
