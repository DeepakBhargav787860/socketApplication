import {
  Box,
  Button,
  Card,
  Group,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  Transition,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { IconPhone, IconLock } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showWelcome, setShowWelcome] = useState(true); // welcome msg visibility
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 1000); // Hide after 1 second

    return () => clearTimeout(timer); // Clean up
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

          <TextInput
            label="Phone Number"
            placeholder="Enter your phone"
            icon={<IconPhone size={18} />}
            value={phone}
            onChange={(e) => setPhone(e.currentTarget.value)}
            radius="md"
            size="md"
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            icon={<IconLock size={18} />}
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            radius="md"
            size="md"
          />

          <SimpleGrid cols={2}>
            <Button
              fullWidth
              radius="xl"
              size="md"
              style={{
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
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
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                fontWeight: 600,
              }}
            >
              Sign Up
            </Button>
          </SimpleGrid>
        </Stack>
      </Card>
    </Box>
  );
};

export default LoginPage;
