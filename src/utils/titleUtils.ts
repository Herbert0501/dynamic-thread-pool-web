import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Path, Pages } from "@/app/constants";

// 定义每个路径对应的标题
const titles: { [key in Path]?: string } = {
  [Path.Home]: Pages.Home,
  [Path.Pools]: Pages.ThreadPool,
  [Path.Monitor]: Pages.Monitor,
  // 其他路径可以根据需要添加
};

/**
 * 根据当前路径获取标题
 * @param defaultTitle 默认标题
 * @returns 路径对应的标题
 */
export function useDynamicTitle(defaultTitle: string = "Mini variant drawer") {
  const location = useLocation();

  useEffect(() => {
    // 根据当前路径设置标题
    const newTitle = titles[location.pathname as Path] || defaultTitle;
    document.title = newTitle;
  }, [location.pathname]);

  return titles[location.pathname as Path] || defaultTitle;
}
