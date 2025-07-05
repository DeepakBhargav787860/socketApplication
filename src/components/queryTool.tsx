import { Box, Text, Stack, Title, Center } from "@mantine/core";
import { useEffect, useState } from "react";

// Shayari lines
const lines = [
  "I can proudly say this 🌟",
  "My Anjali will never be in competition with another lady 🦋",
  "I don’t care how others look, what they have, or who they are 💁‍♀️",
  "Because my Anjali will always be above them all 👑",
  "She’s the most beautiful in my eyes 🌸",
  "The sweetest, kindest, and most genuine soul I’ve ever met 💖",
  "She's not just my love — she's the magic in my life ❤️✨",
];

const QueryTool = () => {
  const [visibleLines, setVisibleLines] = useState<any>([]);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (current < lines.length) {
        setVisibleLines((prev) => [...prev, lines[current]]);
        current++;
      } else {
        clearInterval(interval);
      }
    }, 1500); // 1.5 seconds delay between lines

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      h="100vh"
      bg="linear-gradient(135deg, #ffe0f0, #f3f0ff)"
      p="lg"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box w="100%">
        <Center mb="md">
          <Title order={2} c="pink.7">
            💌 Shayari for Anjali
          </Title>
        </Center>
        <Stack spacing="md" align="center">
          {visibleLines.map((line, index) => (
            <Text
              key={index}
              size="lg"
              c="violet.7"
              fw={500}
              style={{ textAlign: "center" }}
            >
              {line}
            </Text>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default QueryTool;
