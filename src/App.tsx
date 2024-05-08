import { Toaster } from "@/components/ui/sonner";
import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerBindings, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router-v6";
import {
  BookUser,
  Car,
  Home,
  Link,
  TicketSlash,
  Users,
  RouteIcon,
} from "lucide-react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider } from "./auth-provider";
import { AppShellLayout } from "./common/layouts/app-shell-layout";
import { AuthLayout } from "./common/layouts/auth-layout";
import { dataProvider } from "./data-provider";
import { customTitleHandler } from "./lib/utils";
import { notificationProvider } from "./notification-provider";
import { Login } from "./pages/_auth.login";
import { Register } from "./pages/_auth.register";
import { AssignmentsPage } from "./pages/assignments";
import { AssignmentsEditPage } from "./pages/assignments.edit";
import { AssignmentsNewPage } from "./pages/assignments.new";
import { Dashboard } from "./pages/dashboard";
import { DriversPage } from "./pages/drivers";
import { DriversEditPage } from "./pages/drivers.edit";
import { DriversNewPage } from "./pages/drivers.new";
import { Invitations } from "./pages/invitations";
import { NotFound } from "./pages/not-found";
import { UsersPage } from "./pages/users";
import { VehiclesPage } from "./pages/vehicles";
import { VehiclesEditPage } from "./pages/vehicles.edit";
import { VehiclesNewPage } from "./pages/vehicles.new";
import { RoutesPage } from "./pages/routes";
import { RoutesNewPage } from "./pages/routes.new";
import { RoutesEditPage } from "./pages/routes.edit";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <RefineKbarProvider>
        <DevtoolsProvider>
          <Refine
            dataProvider={dataProvider(import.meta.env.VITE_API_ORIGIN)}
            routerProvider={routerBindings}
            authProvider={authProvider}
            notificationProvider={notificationProvider}
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
                name: "users",
                list: "/users",
                meta: {
                  parent: "dashboard",
                  icon: <Users />,
                },
              },
              {
                name: "invitations",
                list: "/invitations",
                meta: {
                  parent: "dashboard",
                  icon: <TicketSlash />,
                },
              },
              {
                name: "drivers",
                list: "/drivers",
                create: "/drivers/new",
                edit: "/drivers/:id/edit",
                meta: {
                  parent: "dashboard",
                  icon: <BookUser />,
                },
              },
              {
                name: "vehicles",
                list: "/vehicles",
                create: "/vehicles/new",
                edit: "/vehicles/:id/edit",
                meta: {
                  parent: "dashboard",
                  icon: <Car />,
                },
              },
              {
                name: "assignments",
                list: "/assignments",
                create: "/assignments/new",
                edit: "/assignments/:id/edit",
                meta: {
                  parent: "dashboard",
                  icon: <Link />,
                },
              },
              {
                name: "routes",
                list: "/routes",
                create: "/routes/new",
                edit: '/routes/:id/edit',
                meta: {
                  parent: "dashboard",
                  icon: <RouteIcon />,
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
                  <Authenticated
                    key="guard"
                    fallback={
                      <AuthLayout>
                        <Outlet />
                      </AuthLayout>
                    }
                  >
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
                <Route path="drivers">
                  <Route index element={<DriversPage />} />
                  <Route path="new" element={<DriversNewPage />} />
                  <Route path=":id/edit" element={<DriversEditPage />} />
                </Route>
                <Route path="users">
                  <Route index element={<UsersPage />} />
                </Route>
                <Route path="vehicles">
                  <Route index element={<VehiclesPage />} />
                  <Route path="new" element={<VehiclesNewPage />} />
                  <Route path=":id/edit" element={<VehiclesEditPage />} />
                </Route>
                <Route path="assignments">
                  <Route index element={<AssignmentsPage />} />
                  <Route path="new" element={<AssignmentsNewPage />} />
                  <Route path=":id/edit" element={<AssignmentsEditPage />} />
                </Route>
                <Route path="routes">
                  <Route index element={<RoutesPage />} />
                  <Route path="new" element={<RoutesNewPage />} />
                  <Route path=":id/edit" element={<RoutesEditPage />}/>
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
            <Toaster />
          </Refine>
          <DevtoolsPanel />
        </DevtoolsProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
