import { Link } from "react-router-dom";
import { Card, Typography, Space } from "antd";

const { Title } = Typography;

const Utils = () => (
  <Card style={{ maxWidth: 400, margin: "40px auto", textAlign: "center" }}>
    <Title level={3}>Утилиты</Title>
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Link to="/utils/images">
        <Card hoverable>
          <Title level={5}>Изображения</Title>
          <span>Перейти к управлению изображениями</span>
        </Card>
      </Link>
      <Link to="/utils/prompts">
        <Card hoverable>
          <Title level={5}>Промпты</Title>
          <span>Перейти к управлению промптами</span>
        </Card>
      </Link>
    </Space>
  </Card>
);

export default Utils;
