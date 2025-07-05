import ActiveUser from "@/components/activeUser";
import ChatDashboard from "@/components/chatDashboard";
import LoginPage from "@/components/loginPage";
import SignPage from "@/components/signup";
import { createBrowserRouter } from "react-router-dom";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/signUp",
    element: <SignPage />,
  },
  {
    path: "/chatDashboard",
    element: <ChatDashboard />,
  },
  {
    path: "/activeUser",
    element: <ActiveUser />,
  },
]);

export default Router;
