import API from "@/lib/Api";
import { ActionIcon, Box, Tooltip } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconLogout, IconX } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

const Logout = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  let pId = Number(localStorage.getItem("id"));
  const { isLoading: isLogoutLoading, mutate: logout } = useMutation<
    any,
    Error
  >(
    async () => {
      if (true) {
        return await API.post<any>(
          "/logout",
          { id: pId },
          {
            withCredentials: true,
          }
        );
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
        navigate("/");
      },
      onError: (errMsg: any) => {
        showNotification({
          title: "Error",
          message: "logout failed",
          color: "red",
          icon: <IconX />,
        });
      },
    }
  );

  const handleLogout = () => {
    // Add logout logic here (e.g., clearing tokens, redirect)
    logout();
  };

  return (
    <>
      {currentPath == "/startChat" ? null : (
        <>
          <Box
            style={{
              position: "fixed",
              bottom: 16,
              left: 16,
              zIndex: 1,
            }}
          >
            <Tooltip label="Logout" position="right" withArrow>
              <ActionIcon
                loading={isLogoutLoading}
                variant="light"
                color="red"
                size="xl"
                radius="xl"
                onClick={handleLogout}
              >
                <IconLogout size={22} />
              </ActionIcon>
            </Tooltip>
          </Box>
        </>
      )}
    </>
  );
};

export default Logout;
