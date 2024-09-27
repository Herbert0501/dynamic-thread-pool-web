import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login } from "@/apis";

// 定义后端响应的类型
interface LoginResponse {
  code: string;
  info: string;
  data: string;
}

export interface AccessControlStore {
  username: string;
  password: string;
  token: string;
  errorMsgs: string;

  updateUsername: (username: string) => void;
  updatePassword: (password: string) => void;
  updateToken: (token: string) => void;
  isAuthorized: () => boolean;
  login: () => Promise<string>;
  goToLogin: () => void;
}

export const useAccessStore = create<AccessControlStore>()(
  persist(
    (set, get) => ({
      token: "",
      username: "",
      password: "",
      errorMsgs: "",
      updateUsername(username: string) {
        set(() => ({ username }));
      },
      updatePassword(password: string) {
        set(() => ({ password }));
      },
      updateToken(token: string) {
        set(() => ({ token }));
      },
      isAuthorized() {
        return !!get().token;
      },
      goToLogin() {
        get().updateUsername("");
        get().updatePassword("");
        get().updateToken("");
      },
      async login() {
        const { username, password } = get();
        const res = await login(username, password);
        const { data, code, info }: LoginResponse = await res.json();

        // 根据后端返回的响应码进行处理
        if (code === "0000") {
          console.log("登录成功");
          get().updateToken(data);
          set(() => ({ errorMsgs: "" }));
        } else {
          console.log("登录失败:", info);
          set(() => ({ errorMsgs: info }));
        }

        return data;
      },
    }),
    {
      name: "login-access",
      version: 1,
    }
  )
);
