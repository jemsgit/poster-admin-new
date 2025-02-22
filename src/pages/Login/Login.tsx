import styles from "./Login.module.css";
import { Button, Checkbox, Flex, Form, Input, notification } from "antd";
import { Typography } from "antd";
import { useLoginMutation } from "../../store/auth/api";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/store";
import { setUserData } from "../../store/user/user";
import { setUserIsAuth } from "../../adapters/localStorageAdapter";
import { User } from "../../models/user";
import { LoginFormData } from "./types";
import { useEffect } from "react";

const { Title } = Typography;

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

function Login() {
  const [login, loginResult] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onFinish = async (formData: LoginFormData) => {
    try {
      let res = await login(formData).unwrap();
      dispatch(setUserData(res as User));
      setUserIsAuth(true);
      navigate("/dashboard", { replace: true });
    } catch (e) {
      console.log(e);
    }
  };

  const onFinishFailed = () => {
    console.log("failed");
  };

  console.log(loginResult);

  useEffect(() => {
    if (loginResult.isError) {
      const apiError = loginResult.error as {
        data: {
          message: string;
        };
      };
      notification.error({ message: apiError.data.message });
    }
  }, [loginResult.isError, loginResult.error]);

  return (
    <div className={styles.page}>
      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, width: "100%" }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className={styles.form}
      >
        <Title level={2} style={{ margin: "0 0 12px 0" }}>
          Login
        </Title>
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Flex gap="middle" align="start">
          <Form.Item<FieldType>
            name="remember"
            valuePropName="checked"
            label={null}
            labelCol={{ span: 0 }}
          >
            <Checkbox style={{ whiteSpace: "nowrap" }}>Remember me</Checkbox>
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Flex>
      </Form>
    </div>
  );
}

export default Login;
