import Profile from "~/pages/Profile/Profile";
import routers from "../config/routers";
import { Home, Mess } from "../pages";
import Login from "~/pages/Login/Login";
import Register from "~/pages/Register/Register";
import Community from "~/pages/Community";
import Trending from "~/pages/Trending";
import Notifications from "~/pages/Notifications";

export const publicRouters = [
    { path: routers.home, component: Home},
    { path: routers.mess, component: Mess},
    { path: routers.profile, component: Profile, layout: null},
    { path: routers.login, component: Login, layout: null},
    { path: routers.register, component: Register, layout: null},
    { path: routers.community, component: Community},
    { path: routers.trending, component: Trending},
    { path: routers.notifications, component: Notifications},
]

