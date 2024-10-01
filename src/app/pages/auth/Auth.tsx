import React, { useState } from "react";
import styles from "./Auth.module.scss";
import LoginPage, {
  Email,
  Password,
  Submit,
  Title,
  Logo,
  Reset,
} from "@react-login-page/page2";
import defaultBannerImage from "@react-login-page/page2/banner-image";
import LoginLogo from "react-login-page/logo";
import { useAccessStore } from "@/app/stores/access";

export function Auth() {
  const { updateUsername, updatePassword, login, errorMsgs } = useAccessStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    updateUsername(username);
    updatePassword(password);
    try {
      await login();
      console.log("Login successful");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleReset = () => {
    setUsername("");
    setPassword("");
  };

  return (
    <div className={styles["auth-container"]}>
      <LoginPage>
        <LoginPage.Banner>
          <img src={defaultBannerImage} alt="Banner" />
        </LoginPage.Banner>
        <Email
          name="userUserName"
          placeholder="请输入用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Password
          type="password"
          name="userPassword"
          placeholder="请输入密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Submit index={1} onClick={handleLogin}>
          提交
        </Submit>
        <Reset index={2} onClick={handleReset}>
          重置
        </Reset>
        <Title visible={true} style={{color:"#6192A6"}}>
          <a target="_blank" href="https://github.com/Herbert0501/dynamic-thread-pool-web">
            DynamicTP-Herbert0501
          </a>
        </Title>
        <Logo>
          <LoginLogo />
        </Logo>
        {errorMsgs && <p className={styles["error-message"]}>{errorMsgs}</p>}
      </LoginPage>
    </div>
  );
}
