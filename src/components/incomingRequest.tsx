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
  Button,
  MediaQuery,
} from "@mantine/core";
import { IconCheck, IconSend, IconX } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import API from "@/lib/Api";
import { showNotification } from "@mantine/notifications";
import Logout from "./logout";

const InComingRequest = () => {
  const location = useLocation();
  const requestData = location.state || [];

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  const handleAction = (action: string, rId: number, pId: number) => {
    let v: any = {
      userProfileId: pId,
      requestId: rId,
      status: action,
    };
    requestStatus(v);
  };

  const { isLoading: requestLoading, mutate: requestStatus } = useMutation<
    any,
    Error
  >(
    async (v: any) => {
      if (true) {
        return await API.post<any>("/requestARB", v, {
          withCredentials: true,
        });
      }
    },
    {
      onSuccess: (response) => {
        showNotification({
          title: "Success",
          message: response?.data?.data,
          color: "teal",
          icon: <IconCheck />,
        });
        navigate("/chatDashboard");
      },
      onError: (errMsg: any) => {
     
        showNotification({
          title: "Error",
          message: errMsg?.response?.data,
          color: "red",
          icon: <IconX />,
        });
        navigate("/chatDashboard");
      },
    }
  );

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
            Incoming Friend Requests
          </Title>

          <Stack spacing="md">
            {requestData.length === 0 ? (
              <Text align="center" c="gray.6">
                No incoming requests found.
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
                  <Group position="apart" align="flex-start">
                    <Group>
                      <Avatar color="blue" radius="xl">
                        <IconSend size={18} />
                      </Avatar>
                      <Box>
                        <Text fw={600}>
                          Request ID: {item?.userProfileData?.uuid}
                        </Text>
                        <Text fw={600} size="sm" c="gray.6">
                          USERNAME: {item?.userProfileData?.username}
                        </Text>
                        <Text fw={600} size="sm" c="gray.6">
                          Mobile NO.: {item?.userProfileData?.mobileNo}
                        </Text>
                      </Box>
                    </Group>

                    <Badge
                      color={
                        item.friendReqStatus === "YES" ? "green" : "orange"
                      }
                      variant="filled"
                    >
                      {item?.friendReqStatus}
                    </Badge>
                  </Group>

                  <Divider my="sm" />

                  {/* Buttons Section */}
                  <MediaQuery
                    smallerThan="sm"
                    styles={{ flexDirection: "column", gap: 8 }}
                  >
                    <Group position="apart" mt="sm">
                      <Button
                        loading={requestLoading}
                        fullWidth
                        color="green"
                        variant="light"
                        onClick={() =>
                          handleAction(
                            "YES",
                            item?.requestId,
                            item?.userProfileId
                          )
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        loading={requestLoading}
                        fullWidth
                        color="red"
                        variant="light"
                        onClick={() =>
                          handleAction(
                            "REJECTED",
                            item?.requestId,
                            item?.userProfileId
                          )
                        }
                      >
                        Reject
                      </Button>
                      <Button
                        loading={requestLoading}
                        fullWidth
                        color="gray"
                        variant="outline"
                        onClick={() =>
                          handleAction(
                            "BLOCKED",
                            item?.requestId,
                            item?.userProfileId
                          )
                        }
                      >
                        Block
                      </Button>
                    </Group>
                  </MediaQuery>
                </Card>
              ))
            )}
          </Stack>
        </>
      )}
       <Logout/>
    </Box>
  );
};

export default InComingRequest;
