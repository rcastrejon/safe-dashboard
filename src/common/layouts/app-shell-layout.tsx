import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumb as RootBreadcrumb,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { type BreadcrumbsType, useBreadcrumb } from "@refinedev/core";
import { type ITreeMenu, useMenu } from "@refinedev/core";
import { CarFront, Menu } from "lucide-react";
import React from "react";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

/*
 * This file exports the `AppShellLayout` component which is the main layout
 * component for the application once the user is authenticated. This layout
 * should wrap all the pages that are part of the application in the Route
 * component in App.tsx.
 *
 * The layout consists of a sidebar, a header, and a main content area. The
 * sidebar is collapsible and contains the main navigation menu. The header
 * contains the breadcrumb navigation.
 */

function useFlatMenu() {
  const { menuItems, ...rest } = useMenu();
  /*
   * The resources list in App.tsx is structured in a way that every resource
   * is nested in the Dashboard resource, which is the root resource. This
   * function flattens the nested resources into a single array.
   */
  const flatMenuItems = useMemo(() => {
    const result: ITreeMenu[] = [];
    const queue: ITreeMenu[] = [...menuItems];

    while (queue.length > 0) {
      const obj = queue.shift();
      if (!obj) throw new Error("Object is undefined");
      result.push(obj);

      if (obj.children) {
        queue.push(...obj.children);
      }
    }

    return result;
  }, [menuItems]);
  return {
    menuItems: flatMenuItems,
    ...rest,
  };
}

export function AppShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-4 lg:px-6">
            <span className="flex items-center gap-2 font-semibold">
              <CarFront size={24} /> S.A.F.E.
            </span>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 font-medium text-sm lg:px-4">
              <ResourcesMenu />
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-[60px] items-center gap-4 border-b bg-muted/40 px-4 md:px-6">
          <Sidebar />
          <Breadcrumb />
        </header>
        <main className="flex flex-1 flex-col gap-4 px-4 py-4 lg:gap-6 lg:p-6 md:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function Breadcrumb() {
  const { breadcrumbs } = useBreadcrumb();
  return (
    <RootBreadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((bc, i) => (
          <React.Fragment key={`breadcrumb-${bc.label}`}>
            <SkipFirst index={i}>
              <BreadcrumbSeparator />
            </SkipFirst>
            <BreadcrumbItem>
              <ResourceBreadcrumb breadcrumb={bc} />
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </RootBreadcrumb>
  );
}

function ResourceBreadcrumb({
  breadcrumb: { href, label },
}: {
  breadcrumb: BreadcrumbsType;
}) {
  const { pathname } = useLocation();
  if (href && href !== pathname) {
    // Make sure to use `BreadcrumbLink` to make the breadcrumb clickable.
    // Do not make the last breadcrumb clickable, as it should be the current page.
    return (
      <BreadcrumbLink asChild>
        <Link to={href}>{label}</Link>
      </BreadcrumbLink>
    );
  }
  return <BreadcrumbPage>{label}</BreadcrumbPage>;
}

/*
 * Skip the first breadcrumb separator
 */
function SkipFirst({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  return index === 0 ? undefined : children;
}

function Sidebar() {
  const [open, setOpen] = React.useState(false);
  const { menuItems, selectedKey } = useFlatMenu();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="shrink-0 lg:hidden" size="icon" variant="outline">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col" side="left">
        <nav className="grid gap-2 font-medium text-lg">
          <span className="flex items-center gap-2 font-semibold text-lg">
            <CarFront size={24} />
            <span className="sr-only">S.A.F.E.</span>
          </span>
          {menuItems.map((item) => (
            <Link
              key={item.key}
              className={cn(
                "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                selectedKey === item.key && "bg-muted text-foreground",
              )}
              to={item.route ?? "/"}
              onClick={() => setOpen(false)}
            >
              <IconWrapper icon={item.icon} className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function ResourcesMenu() {
  const { menuItems, selectedKey } = useFlatMenu();
  return menuItems.map((item) => (
    <Link
      key={item.key}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        selectedKey === item.key && "bg-muted text-foreground",
      )}
      to={item.route ?? "/"}
    >
      <IconWrapper icon={item.icon} className="h-4 w-4" />
      {item.label}
    </Link>
  ));
}

/*
 * The purpose of this component is to wrap the icon, given by the resources
 * attribute from Refine, in order to customize the styles. We can not set an
 * static size in the original icon component because different use cases may
 * require different sizes. For example, the non-collapsible sidebar uses a
 * smaller size than the collapsible sidebar.
 */

interface IconWrapperProps extends React.HTMLAttributes<SVGElement> {
  icon: React.ReactNode;
  className?: string;
}

const IconWrapper = React.forwardRef<SVGElement, IconWrapperProps>(
  ({ icon, className, ...rest }, ref) => {
    if (!React.isValidElement(icon))
      throw new Error("Icon must be a valid React element");
    return React.cloneElement(icon, {
      ...rest,
      ...icon.props,
      className: cn(icon.props.className, className),
      ref,
    });
  },
);
