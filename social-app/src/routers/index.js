import Profile from "~/pages/Profile/Profile";
import routers from "../config/routers";
import { Home, Mess } from "../pages";
import Login from "~/pages/Login/Login";
import Register from "~/pages/Register/Register";
import Community from "~/pages/Community";
import Trending from "~/pages/Trending";
import Notifications from "~/pages/Notifications";
import Chat from "~/Layout/Chat/Chat";
import ForgotPassword from "~/components/ForgotPassword/ForgotPassword";
import ResetPassword from "~/components/ResetPassword/ResetPassword";

export const publicRouters = [
    { path: routers.home, component: Home},
    { path: routers.chat, component: Mess, layout: Chat},
    { path: routers.chatRoom, component: Mess, layout: Chat},
    { path: routers.profile, component: Profile, layout: null},
    { path: routers.login, component: Login, layout: null},
    { path: routers.register, component: Register, layout: null},
    { path: routers.community, component: Community},
    { path: routers.trending, component: Trending},
    { path: routers.notifications, component: Notifications},
    { path: routers.forgotPassword, component: ForgotPassword, layout: null},
    { path: routers.resetPassword, component: ResetPassword, layout: null},
]

