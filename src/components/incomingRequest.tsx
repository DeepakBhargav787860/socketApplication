import { Box, Loader, Stack, Text, Title } from "@mantine/core";

const InComingRequest = () => {
  return (
    <Box
      h="100vh"
      w="100%"
      display="flex"
      style={{
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f0f4ff, #e3f9ff)",
      }}
    >
      <Stack align="center" spacing="sm">
        <Loader color="blue" size="lg" />
        <Title order={3} c="blue.6">
          Processing...
        </Title>
        <Text c="gray.6" size="sm">
          Please wait while we fetch your sent requests.
        </Text>
      </Stack>
    </Box>
  );
};

export default InComingRequest;
