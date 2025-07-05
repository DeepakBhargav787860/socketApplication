import {
  Box,
  Button,
  Card,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { IconPhone, IconLock, IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const SignPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: e.currentTarget.value });
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
            value={form.name}
            onChange={handleChange("name")}
            radius="md"
            size="sm"
          />

          <TextInput
            label="Phone Number"
            placeholder="Enter your phone"
            icon={<IconPhone size={16} />}
            value={form.phone}
            onChange={handleChange("phone")}
            radius="md"
            size="sm"
          />

          <TextInput
            label="Address"
            placeholder="Enter your address"
            icon={<IconPhone size={16} />}
            value={form.address}
            onChange={handleChange("address")}
            radius="md"
            size="sm"
          />

          <TextInput
            label="Email"
            placeholder="Enter your email"
            icon={<IconPhone size={16} />}
            value={form.email}
            onChange={handleChange("email")}
            radius="md"
            size="sm"
          />

          <PasswordInput
            label="Password"
            placeholder="Enter password"
            icon={<IconLock size={16} />}
            value={form.password}
            onChange={handleChange("password")}
            radius="md"
            size="sm"
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Re-enter password"
            icon={<IconLock size={16} />}
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            radius="md"
            size="sm"
          />

          <Group position="apart" mt="sm">
            <Button
              fullWidth
              radius="xl"
              size="sm"
              style={{
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                fontWeight: 600,
              }}
            >
              SignUp
            </Button>
          </Group>
        </Stack>
      </Card>

      {/* ✨ Blinking animatilon */}
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
