import { Navigate } from "react-router-dom";
import Login from "../pages/Login";
// layouts
import { Admins, Users, MainLayout } from "../layouts";
// main layout
import MainLayoutHome from "../pages/MainLayout/Home";
// admin
import AdminTerms from "../pages/Admins/Terms";
import AdminTerm from "../pages/Admins/Term";
import AdminTermSections from "../pages/Admins/Term/Sections";
import AdminTermActivities from "../pages/Admins/Term/Activities";
import AdminTermActivity from "../pages/Admins/Term/Activity";
import AdminQuestions from "../pages/Admins/Questions";
import AdminQuestion from "../pages/Admins/Question";
import AdminHomeworks from "../pages/Admins/Homeworks";
import AdminHomework from "../pages/Admins/Homework";
// import AdminUsers from "../pages/Admins/Users";
// import AdminUser from "../pages/Admins/User";
import AdminMainVideos from "../pages/Admins/MainVideos";
import AdminMainVideo from "../pages/Admins/MainVideo";
import AdminCategories from "../pages/Admins/Categories";
import AdminCategory from "../pages/Admins/Category";
// users
import UserTerms from "../pages/Users/Terms";
import UserTerm from "../pages/Users/Term";
import UserProfile from "../pages/Users/Profile";
import UserResults from "../pages/Users/Results";
import UserQuestions from "../pages/Users/Questions";
// errors
import Error500 from "../pages/Errors/Error500";
import Error403 from "../pages/Errors/Error403";
import Error404 from "../pages/Errors/Error404";

const routes = (isLogged = false, role = "") => {
  const checkRole = (roles = []) =>
    isLogged && role !== null && roles.includes(role);
  return [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: <MainLayout />,
      children: [{ path: "/", element: <MainLayoutHome /> }],
    },
    {
      path: "/admin",
      element: checkRole(["super", "admin"]) ? (
        <Admins />
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [
        { path: "terms", element: <AdminTerms /> },
        {
          path: "terms/:id",
          element: <AdminTerm />,
          children: [
            { path: "", element: <AdminTermSections /> },
            { path: ":sectionIndex", element: <AdminTermActivities /> },
            {
              path: ":sectionIndex/:activityIndex",
              element: <AdminTermActivity />,
            },
          ],
        },
        { path: "questions", element: <AdminQuestions /> },
        { path: "questions/:id", element: <AdminQuestion /> },
        { path: "homeworks", element: <AdminHomeworks /> },
        { path: "homeworks/:id", element: <AdminHomework /> },
        // { path: "users", element: <AdminUsers /> },
        // { path: "users/:id", element: <AdminUser /> },
        { path: "main-videos", element: <AdminMainVideos /> },
        { path: "main-videos/:id", element: <AdminMainVideo /> },
        { path: "categories", element: <AdminCategories /> },
        { path: "categories/:id", element: <AdminCategory /> },
      ],
    },
    {
      path: "/student",
      element: checkRole(["student", "super", "admin"]) ? (
        <Users />
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [
        { path: "terms", element: <UserTerms /> },
        { path: "terms/:id", element: <UserTerm /> },
        { path: "profile", element: <UserProfile /> },
        { path: "results", element: <UserResults /> },
        { path: "questions/:id", element: <UserQuestions /> },
      ],
    },
    {
      path: "/500",
      element: <Error500 />,
    },
    {
      path: "/403",
      element: <Error403 />,
    },
    {
      path: "*",
      element: <Error404 />,
    },
  ];
};
export default routes;
