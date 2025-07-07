import API from "@/lib/Api";
import IsEmptyOrZeroOrUndefined from "@/utils/utils";
import {
  Box,
  Button,
  Loader,
  Stack,
  Text,
  TextInput,
  Title,
  Card,
  Paper,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import {
  IconCheck,
  IconPhone,
  IconUser,
  IconMail,
  IconX,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RequestedUser = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>({});
  let mNo = localStorage.getItem("mobileNo");
  let pId = Number(localStorage.getItem("id"));
  console.log("mNo", mNo);
  const form = useForm({
    initialValues: {
      mobileNo: "",
    },
    validate: {
      mobileNo: (value) =>
        /^\d{10}$/.test(value) ? null : "Enter a valid 10-digit phone number",
    },
  });

  // const requestForm = useForm({
  //   initialValues: {
  //     userProfileId: "",
  //     friendId: "",
  //   },
  //   validate: {
  //     userProfileId: (value) =>
  //       IsEmptyOrZeroOrUndefined(value)
  //         ? "failed to pass user profile id"
  //         : null,
  //     friendId: (value) =>
  //       IsEmptyOrZeroOrUndefined(value) ? "failed to pass friend id" : null,
  //   },
  // });

  const { isLoading: findUserLoading, mutate: findUser } = useMutation<
    any,
    Error
  >(
    async () => {
      return await API.post<any>(
        "/findUserByMobileNo",
        { mobileNo: form.values.mobileNo },
        { withCredentials: true }
      );
    },
    {
      onSuccess: (response) => {
        setUserData(response?.data?.data);
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

  const handleSubmit = (values: typeof form.values) => {
    if (!form.validate().hasErrors) {
      if (String(mNo).trim() !== String(form?.values?.mobileNo).trim()) {
        console.log("hahahhaha", mNo, form.values.mobileNo);
        findUser();
      } else {
        showNotification({
          title: "Error",
          message: "Oops! You can't send a request to your own account.",
          color: "red",
          icon: <IconX />,
        });
      }
    } else {
      showNotification({
        title: "Error",
        message: "Please enter a valid number",
        color: "red",
        icon: <IconX />,
      });
    }
  };

  //send request

  const { isLoading: sendUserRequestLoading, mutate: sendUserRequest } =
    useMutation<any, Error>(
      async () => {
        return await API.post<any>(
          "/requestSend",
          {
            userProfileId: Number(pId),
            friendId: Number(userData?.id),
          },
          {
            withCredentials: true,
          }
        );
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
          console.log("errmsg", errMsg);
          showNotification({
            title: "Error",
            message: errMsg?.response?.data || "Something went wrong",
            color: "red",
            icon: <IconX />,
          });
          navigate("/chatDashboard");
        },
      }
    );

  const sentRequest = () => {
    if (
      !IsEmptyOrZeroOrUndefined(pId) &&
      !IsEmptyOrZeroOrUndefined(userData?.id)
    ) {
      sendUserRequest();
    } else {
      showNotification({
        title: "Error",
        message: "Something went wrong",
        color: "red",
        icon: <IconX />,
      });
    }
  };

  return (
    <Box
      h="100vh"
      w="100%"
      bg="linear-gradient(135deg, #f9f0ff, #e3f9ff)"
      p="md"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {findUserLoading ? (
        <Stack align="center" spacing="sm">
          <Loader color="violet" size="lg" />
          <Title order={3} c="violet.6">
            Processing...
          </Title>
          <Text c="gray.6" size="sm">
            Please wait while we search the user.
          </Text>
        </Stack>
      ) : userData?.id ? (
        <Card shadow="md" padding="lg" radius="lg" w="100%" maw={360}>
          <Stack align="center" spacing="md">
            <Group spacing="xs">
              <IconUser color="violet" />
              <Text fw={600}>{userData?.username}</Text>
            </Group>
            <Group spacing="xs">
              <IconMail color="blue" />
              <Text>{userData?.emailId}</Text>
            </Group>
            <Group spacing="xs">
              <IconPhone color="green" />
              <Text>{userData?.mobileNo}</Text>
            </Group>

            <Button
              loading={sendUserRequestLoading}
              onClick={sentRequest}
              fullWidth
              radius="xl"
              size="md"
              style={{
                background: "linear-gradient(90deg, #00b09b, #96c93d)",
                color: "white",
                fontWeight: 600,
              }}
            >
              Send Request
            </Button>
          </Stack>
        </Card>
      ) : (
        <Paper shadow="sm" radius="lg" p="lg" w="100%" maw={360} withBorder>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack spacing="md">
              <Title order={3} align="center" c="indigo.6">
                🔍 Find User
              </Title>
              <TextInput
                label="Phone Number"
                placeholder="Enter 10-digit number"
                icon={<IconPhone size={18} />}
                {...form.getInputProps("mobileNo")}
                radius="md"
                size="md"
              />
              <Button
                type="submit"
                fullWidth
                radius="xl"
                size="md"
                loading={findUserLoading}
                style={{
                  background:
                    "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  fontWeight: 600,
                }}
              >
                Find User
              </Button>
            </Stack>
          </form>
        </Paper>
      )}
    </Box>
  );
};

export default RequestedUser;
