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
]);

export default Router;
