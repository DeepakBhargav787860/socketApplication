// import { Box, Text, Stack, Title, Center } from "@mantine/core";
// import { useEffect, useState } from "react";

// // Shayari lines
// const lines = [
//   "I can proudly say this 🌟",
//   "My Anjali will never be in competition with another lady 🦋",
//   "I don’t care how others look, what they have, or who they are 💁‍♀️",
//   "Because my Anjali will always be above them all 👑",
//   "She’s the most beautiful in my eyes 🌸",
//   "The sweetest, kindest, and most genuine soul I’ve ever met 💖",
//   "She's not just my love — she's the magic in my life ❤️✨",
// ];

// const QueryTool = () => {
//   const [visibleLines, setVisibleLines] = useState<any>([]);

//   useEffect(() => {
//     let current = 0;
//     const interval = setInterval(() => {
//       if (current < lines.length) {
//         setVisibleLines((prev) => [...prev, lines[current]]);
//         current++;
//       } else {
//         clearInterval(interval);
//       }
//     }, 1500); // 1.5 seconds delay between lines

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <Box
//       h="100vh"
//       bg="linear-gradient(135deg, #ffe0f0, #f3f0ff)"
//       p="lg"
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <Box w="100%">
//         <Center mb="md">
//           <Title order={2} c="pink.7">
//             💌  for my Best Half 🌸
//           </Title>
//         </Center>
//         <Stack spacing="md" align="center">
//           {visibleLines.map((line, index) => (
//             <Text
//               key={index}
//               size="lg"
//               c="violet.7"
//               fw={500}
//               style={{ textAlign: "center" }}
//             >
//               {line}
//             </Text>
//           ))}
//         </Stack>
//       </Box>
//     </Box>
//   );
// };

// export default QueryTool;

import {
  Box,
  Text,
  Stack,
  Title,
  Center,
  List,
  ThemeIcon,
} from "@mantine/core";
import {
  IconHelpCircle,
  IconMessage,
  IconRefresh,
  IconAlertTriangle,
  IconExternalLink,
} from "@tabler/icons-react";
import Logout from "./logout";

const QueryTool = () => {
  return (
    <Box
      h="100vh"
      bg="linear-gradient(135deg, #f3f9ff, #e6f0ff)"
      p="xl"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box w="100%" maw={600}>
        <Center mb="lg">
          <Title order={2} c="blue.7">
            🛠️ Need Help? Here's What to Do
          </Title>
        </Center>

        <Stack spacing="lg">
          <Text size="md" c="gray.7" align="center">
            If you're facing issues or feeling stuck, follow these steps to get
            back on track:
          </Text>

          <List
            spacing="md"
            size="md"
            icon={
              <ThemeIcon color="blue" size={24} radius="xl">
                <IconHelpCircle size={16} />
              </ThemeIcon>
            }
          >
            <List.Item>
              <strong>Refresh the page</strong> — Sometimes, a simple refresh
              resolves unexpected behavior.
            </List.Item>

            <List.Item
              icon={
                <ThemeIcon color="teal" size={24} radius="xl">
                  <IconMessage size={16} />
                </ThemeIcon>
              }
            >
              <strong>Check your internet connection</strong> — Ensure you're
              online and connected.
            </List.Item>

            <List.Item
              icon={
                <ThemeIcon color="orange" size={24} radius="xl">
                  <IconAlertTriangle size={16} />
                </ThemeIcon>
              }
            >
              <strong>If you see an error</strong> — Note the error message or
              take a screenshot. This helps in reporting the issue clearly.
            </List.Item>

            <List.Item
              icon={
                <ThemeIcon color="grape" size={24} radius="xl">
                  <IconExternalLink size={16} />
                </ThemeIcon>
              }
            >
              <strong>Contact support</strong> — Reach out through the feedback
              form or send us a message from the chat section.
            </List.Item>
          </List>

          <Text size="sm" c="dimmed" align="center">
            We're here to help you anytime — because this journey matters to us
            just as much as it does to you. 💙
          </Text>
        </Stack>
      </Box>
      <Logout />
    </Box>
  );
};

export default QueryTool;
