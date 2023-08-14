import { useAuth } from "@/stores/auth.ts";

export default async function routes(to, from, next) {
  if (to.meta?.auth) {
    const auth = useAuth();
    if (auth.token ) {
      // const isAuthenticated = await auth.checkToken();
       next();
      // else next({ name: "login" });
    } else {
      next({ name: "login" });
    }
    console.log(to.name);
  } else {
    next();
  }
}
