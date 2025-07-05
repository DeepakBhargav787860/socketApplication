import ActiveUser from "@/components/activeUser";
import ChatDashboard from "@/components/chatDashboard";
import InComingRequest from "@/components/incomingRequest";
import LoginPage from "@/components/loginPage";
import RequestedUser from "@/components/RequestedUser";
import SentRequest from "@/components/sentRequest";
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
  {
    path: "/requestedUser",
    element: <RequestedUser />,
  },
  {
    path: "/sentRequest",
    element: <SentRequest />,
  },
  {
    path: "/inComingRequest",
    element: <InComingRequest />,
  },
]);

export default Router;
