import API from "@/lib/Api";
import {
  Box,
  Button,
  Card,
  Group,
  Notification,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import {
  IconPhone,
  IconLock,
  IconArrowLeft,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignPage = () => {
  // const socket = new WebSocket("wss://mysocket-6xmu.onrender.com/ws");
  const health = "https://mysocket-6xmu.onrender.com/health";

  // const socket = new WebSocket("ws://localhost:8080/ws");

  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      username: "",
      mobileNo: "",
      address: "",
      emailId: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      username: (value) =>
        value.trim().length === 0 ? "Name is required" : null,
      mobileNo: (value) =>
        /^\d{10}$/.test(value) ? null : "Enter a valid 10-digit phone number",
      address: (value) =>
        value.trim().length === 0 ? "Address is required" : null,
      emailId: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : "Enter a valid email",
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords do not match" : null,
    },
  });

  const { isLoading: isSignUpLoading, mutate: signUp } = useMutation<
    any,
    Error
  >(
    async (v: any) => {
      if (true) {
        return await API.post<any>("/signUpUser", v, {
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
        form.reset();
        navigate("/");
      },
      onError: (errMsg: any) => {
        showNotification({
          title: "Error",
          message: "signUp failed",
          color: "red",
          icon: <IconX />,
        });
      },
    }
  );

  const handleSubmit = (values: typeof form.values) => {
    console.log("Form submitted ✅", values);
    const msg: any = {
      username: values?.username,
      mobileNo: values?.mobileNo,
      address: values?.address,
      emailId: values?.emailId,
      password: values?.password,
    };
    if (!form.validate().hasErrors) {
      signUp(msg);
    } else {
      showNotification({
        title: "Error",
        message: "fill the details correctly",
        color: "red",
        icon: <IconX />,
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(health)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data.response);
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 12,
        position: "relative",
      }}
    >
      {/* 🔙 Back Arrow */}
      <Box
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          cursor: "pointer",
          animation: "blink 1.2s infinite",
          zIndex: 10,
        }}
      >
        <IconArrowLeft size={30} color="#111" />
      </Box>

      {/* 🔐 Sign Up Card */}
      <Card
        shadow="md"
        radius="md"
        padding="lg"
        style={{
          width: "90%",
          maxWidth: 320,
          backgroundColor: "white",
          border: "1px solid #e0e0e0",
        }}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack spacing="sm">
            <Title order={3} align="center" style={{ color: "#333" }}>
              JaliTalks 👋
            </Title>
            <Text align="center" size="xs" color="dimmed">
              Create your account
            </Text>

            <TextInput
              label="Name"
              placeholder="Enter your name"
              icon={<IconPhone size={16} />}
              radius="md"
              size="sm"
              {...form.getInputProps("username")}
            />

            <TextInput
              label="Phone Number"
              placeholder="Enter your phone"
              icon={<IconPhone size={16} />}
              radius="md"
              size="sm"
              {...form.getInputProps("mobileNo")}
            />

            <TextInput
              label="Address"
              placeholder="Enter your address"
              icon={<IconPhone size={16} />}
              radius="md"
              size="sm"
              {...form.getInputProps("address")}
            />

            <TextInput
              label="Email"
              placeholder="Enter your email"
              icon={<IconPhone size={16} />}
              radius="md"
              size="sm"
              {...form.getInputProps("emailId")}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter password"
              icon={<IconLock size={16} />}
              radius="md"
              size="sm"
              {...form.getInputProps("password")}
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Re-enter password"
              icon={<IconLock size={16} />}
              radius="md"
              size="sm"
              {...form.getInputProps("confirmPassword")}
            />

            <Group position="apart" mt="sm">
              <Button
              loading={isSignUpLoading}
                type="submit"
                fullWidth
                radius="xl"
                size="sm"
                style={{
                  background:
                    "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  fontWeight: 600,
                }}
              >
                SignUp
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>

      {/* ✨ Blinking animation */}
      <style>
        {`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

export default SignPage;
