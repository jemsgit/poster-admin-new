import AuthProtected from "../AuthProtected/AuthProtected";
import {
  Link,
  Outlet,
  UIMatch,
  useMatches,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Breadcrumb, Layout as AntLayout, Menu, theme } from "antd";
import { RouterHandle, RouterLoader } from "../../routes/routes.types";
import styles from "./Layout.module.css";

const { Header, Content, Footer } = AntLayout;

function Layout() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const params = useParams();
  const navigate = useNavigate();

  const matches = useMatches() as UIMatch<RouterLoader, RouterHandle>[];

  const match = matches.filter((m) => m.pathname === location.pathname).pop();
  let breadcrumbs;

  const handleMenuClick = (menu: { key: string }) => {
    navigate(`./${menu.key}`);
  };

  if (match?.handle?.breadcrumbs) {
    breadcrumbs = match.handle.breadcrumbs;
  }

  if (match?.handle?.extraBreadcrumbs) {
    breadcrumbs = breadcrumbs?.concat(match?.handle.extraBreadcrumbs(params));
  }

  return (
    <AuthProtected>
      <AntLayout className={styles.layout}>
        <Header style={{ display: "flex", alignItems: "center" }}>
          <div className="demo-logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            onClick={handleMenuClick}
            items={[
              { label: "Channels", key: "channels" },
              { label: "Dashboard", key: "dashboard" },
              { label: "Utils", key: "utils" },
            ]}
            style={{ flex: 1, minWidth: 0 }}
          />
        </Header>
        <Content className={styles.content}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            {breadcrumbs?.map((item) => {
              return (
                <Breadcrumb.Item key={item.title}>
                  <Link to={item.url} key={item.url}>
                    {item.title}
                  </Link>
                </Breadcrumb.Item>
              );
            })}
          </Breadcrumb>
          <div
            className={styles.contentInner}
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Jem Jem ©{new Date().getFullYear()}
        </Footer>
      </AntLayout>
    </AuthProtected>
  );
}

export default Layout;
