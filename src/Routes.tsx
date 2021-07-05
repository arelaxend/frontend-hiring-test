import { Fragment, lazy, Suspense } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";

import LoadingScreen from "./components/LoadingScreen";
import MainLayout from "./layout/MainLayout";

const routesConfig: any[] = [
  {
    exact: true,
    path: "/",
    layout: MainLayout,
    component: lazy(() => import("src/views/calls")),
  },
  {
    exact: true,
    path: "/404",
    layout: MainLayout,
    component: lazy(() => import("src/views/404/Error404View")),
  },
  {
    layout: MainLayout,
    path: [
      "/call/:id",
    ],
    routes: [
      {
        exact: true,
        path: ["/call/:id"],
        component: lazy(() => import("src/views/details")),
      }
    ],
  },
  {
    path: "*",
    routes: [
      {
        component: () => <Redirect to="/404" />,
      },
    ],
  },
];

const renderRoutes = (routes: any, pathname: string, search: string) =>
  routes ? (
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        {routes.map((route: any, i: number) => {
          const Layout = route.layout || Fragment;
          const Component = route.component;

          return (
            <Route
              key={i}
              path={route.path}
              exact={route.exact}
              render={(props) => (
                  <Layout>
                    {route.routes ? (
                      renderRoutes(route.routes, pathname, search)
                    ) : (
                      <Component {...props} />
                    )}
                  </Layout>
              )}
            />
          );
        })}
      </Switch>
    </Suspense>
  ) : null;

function Routes() {
  const { pathname, search } = useLocation();
  return renderRoutes(routesConfig, pathname, search);
}

export default Routes;
