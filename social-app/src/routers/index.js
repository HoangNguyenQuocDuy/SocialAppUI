import routers from "../config/routers";
import { Home, Mess } from "../pages";

export const publicRouters = [
    { path: routers.home, component: Home},
    { path: routers.mess, component: Mess}
]

