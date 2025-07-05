import {
  Box,
  Button,
  Card,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  Transition,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { IconPhone, IconLock, IconCheck, IconX } from "@tabler/icons-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { showNotification } from "@mantine/notifications";

const LoginPage = () => {
  const form = useForm({
    initialValues: {
      mobileNo: "",
      password: "",
    },

    validate: {
      mobileNo: (value) =>
        /^\d{10}$/.test(value) ? null : "Enter a valid 10-digit phone number",
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
    },
  });

  const [showWelcome, setShowWelcome] = useState(true); // welcome msg visibility
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 1000); // Hide after 1 second

    return () => clearTimeout(timer); // Clean up
  }, []);

  const { isLoading: isLoginLoading, mutate: login } = useMutation<any, Error>(
    async () => {
      if (true) {
        return await axios.post<any>(
          "https://mysocket-6xmu.onrender.com/loginUser",
          {
            mobileNo: form.values.mobileNo,
            password: form.values.password,
          },
          {
            withCredentials: true,
          }
        );
      }
    },
    {
      onSuccess: (response) => {
        localStorage.setItem(
          "mobileNo",
          JSON.stringify(response?.data?.user?.mobileNo)
        );
        localStorage.setItem(
          "userName",
          JSON.stringify(response?.data?.user?.userName)
        );
        localStorage.setItem("id", JSON.stringify(response?.data?.user?.id));
        localStorage.setItem(
          "uuid",
          JSON.stringify(response?.data?.user?.uuid)
        );
        localStorage.setItem("user", JSON.stringify(response?.data?.user));

        showNotification({
          title: "Success",
          message: response?.data?.message,
          color: "teal",
          icon: <IconCheck />,
        });
        navigate("/chatDashboard");
      },
      onError: (errMsg: any) => {
        console.log("errmsg", errMsg?.response?.data);
        showNotification({
          title: "Error",
          message: errMsg?.response?.data,
          color: "red",
          icon: <IconX />,
        });
      },
    }
  );

  const handleSubmit = (values: typeof form.values) => {
    if (!form.validate().hasErrors) {
      login();
    } else {
      showNotification({
        title: "Error",
        message: "enter the correct details",
        color: "red",
        icon: <IconX />,
      });
    }
  };

  return (
    <Box
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        padding: 16,
        overflow: "hidden",
      }}
    >
      {/* Welcome Animation Overlay */}
      <Transition
        mounted={showWelcome}
        transition="slide-down"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <Box
            style={{
              position: "absolute",
              top: 100,
              left: "30%",
              transform: "translateX(-50%)",
              background: "white",
              padding: "12px 24px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              fontSize: 24,
              fontWeight: 600,
              color: "#764ba2",
              zIndex: 1000,
              ...styles,
            }}
          >
            Hi Jali 🌸
          </Box>
        )}
      </Transition>

      {/* Main Card */}
      <Card
        shadow="md"
        radius="lg"
        padding="lg"
        style={{
          width: 350,
          maxWidth: "100%",
          backgroundColor: "white",
          border: "1px solid #e0e0e0",
        }}
      >
        <Stack spacing="md">
          <Title order={2} align="center" style={{ color: "#333" }}>
            JaliTalks 👋
          </Title>
          <Text align="center" size="sm" color="dimmed">
            Login to your account
          </Text>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Phone Number"
              placeholder="Enter your phone"
              icon={<IconPhone size={18} />}
              {...form.getInputProps("mobileNo")}
              radius="md"
              size="md"
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              icon={<IconLock size={18} />}
              {...form.getInputProps("password")}
              radius="md"
              size="md"
            />

            <SimpleGrid cols={2} mt={5}>
              <Button
                loading={isLoginLoading}
                type="submit"
                fullWidth
                radius="xl"
                size="md"
                style={{
                  background:
                    "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  fontWeight: 600,
                }}
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/signUp")}
                fullWidth
                radius="xl"
                size="md"
                style={{
                  background:
                    "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  fontWeight: 600,
                }}
              >
                Sign Up
              </Button>
            </SimpleGrid>
          </form>
        </Stack>
      </Card>
    </Box>
  );
};

export default LoginPage;
