import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerBindings, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { Home, TicketSlash } from "lucide-react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider } from "./authProvider";
import { AppShellLayout } from "./common/app-shell-layout";
import { customTitleHandler } from "./lib/utils";
import { Dashboard } from "./pages/dashboard";
import { Invitations } from "./pages/invitations";
import { Login } from "./pages/login";
import { NotFound } from "./pages/not-found";
import { Register } from "./pages/register";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <DevtoolsProvider>
          <Refine
            dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
            routerProvider={routerBindings}
            authProvider={authProvider}
            resources={[
              {
                name: "dashboard",
                list: "/",
                meta: {
                  label: "Dashboard",
                  icon: <Home />,
                },
              },
              {
                name: "invitations",
                list: "/invitations",
                // show: "/invitations/show/:id",
                // create: "/invitations/new",
                meta: {
                  parent: "dashboard",
                  icon: <TicketSlash />,
                },
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: "6Pwv7v-89Qq3Q-KB404D",
              disableTelemetry: true,
            }}
          >
            <Routes>
              <Route
                element={
                  <Authenticated key="guard" fallback={<Outlet />}>
                    <NavigateToResource resource="dashboard" />
                  </Authenticated>
                }
              >
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
              <Route
                element={
                  <Authenticated
                    key="main"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <AppShellLayout>
                      <Outlet />
                    </AppShellLayout>
                  </Authenticated>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="invitations">
                  <Route index element={<Invitations />} />
                </Route>
              </Route>
              <Route
                element={
                  <Authenticated
                    key="error"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <AppShellLayout>
                      <Outlet />
                    </AppShellLayout>
                  </Authenticated>
                }
              >
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler handler={customTitleHandler} />
          </Refine>
          <DevtoolsPanel />
        </DevtoolsProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
