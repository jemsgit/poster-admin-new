import React from "react";
import AuthProtected from "../AuthProtected/AuthProtected";
import { Link, Outlet, useMatches } from "react-router-dom";
import { Breadcrumb, Layout as AntLayout, Menu, theme } from "antd";

const { Header, Content, Footer } = AntLayout;

function Layout() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const matches = useMatches();

  const match = matches.filter((m) => m.pathname === location.pathname);
  let breadcrumbs;

  if (match[0].handle && match[0].handle.breadcrumbs) {
    breadcrumbs = match[0].handle.breadcrumbs;
  }

  return (
    <AuthProtected>
      <AntLayout style={{ minHeight: "100vh" }}>
        <Header style={{ display: "flex", alignItems: "center" }}>
          <div className="demo-logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            items={[]}
            style={{ flex: 1, minWidth: 0 }}
          />
        </Header>
        <Content style={{ padding: "0 48px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            {breadcrumbs?.map((item) => {
              return (
                <Breadcrumb.Item>
                  <Link to={item.url} key={item.url}>
                    {item.title}
                  </Link>
                </Breadcrumb.Item>
              );
            })}
          </Breadcrumb>
          <div
            style={{
              background: colorBgContainer,
              minHeight: 280,
              padding: 24,
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
