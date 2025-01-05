const authParam = "userAuth";
// const themeParam = "theme";

export function checkUserIsAuth(): boolean {
  return localStorage.getItem(authParam) === "true";
}

export function setUserIsAuth(flag = true): void {
  localStorage.setItem(authParam, flag ? "true" : "false");
}
