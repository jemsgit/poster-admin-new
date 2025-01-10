import React from "react";
import AuthProtected from "../AuthProtected/AuthProtected";
import { Link, Outlet, UIMatch, useMatches, useParams } from "react-router-dom";
import { Breadcrumb, Layout as AntLayout, Menu, theme } from "antd";
import { RouterHandle, RouterLoader } from "../../routes/routes.types";

const { Header, Content, Footer } = AntLayout;

function Layout() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const params = useParams();
  console.log(params);

  const matches = useMatches() as UIMatch<RouterLoader, RouterHandle>[];

  const match = matches.filter((m) => m.pathname === location.pathname).pop();
  let breadcrumbs;

  console.log(match);

  if (match?.handle?.breadcrumbs) {
    breadcrumbs = match.handle.breadcrumbs;
  }

  if (match?.handle?.extraBreadcrumbs) {
    breadcrumbs = breadcrumbs?.concat(match?.handle.extraBreadcrumbs(params));
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
        <Content
          style={{
            padding: "0 48px",
            maxWidth: "1500px",
            margin: "0 auto",
            width: "100%",
          }}
        >
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
