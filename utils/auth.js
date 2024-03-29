import cookie from "js-cookie";
import Router from "next/router";

var inADay = 1;
export function handleLogin(id) {
  Router.push(`/verify?id=${id}`);
}

export function handleVerify(token) {
  cookie.set("token", token, { expires: inADay });
  Router.push("/dashboard");
}

export function handleSignup(id) {
  Router.replace(`/verify?id=${id}`);
}

export function redirectUser(ctx, location) {
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();
  } else {
    Router.push(location);
  }
}

export function handleLogOut() {
  cookie.remove("token");
  Router.push("/login");
  window.localStorage.setItem("logout", Date.now());
}

export function deleteAccountRedirect() {
  cookie.remove("token");
  cookie.remove("acceptCookie");
  cookie.remove("rsCookie");
  Router.push("/login");
}
