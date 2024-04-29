import { type ITreeMenu, useMenu } from "@refinedev/core";
import { useMemo } from "react";

export function useFlatMenu() {
  const { menuItems, ...rest } = useMenu();
  /*
   * The resources list in App.tsx is structured in a way that every resource
   * is nested in the Dashboard resource, which is the root resource. This
   * step flattens the nested resources into a single array.
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
