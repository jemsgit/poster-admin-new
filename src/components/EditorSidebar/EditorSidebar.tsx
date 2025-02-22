import useDesktopMode from "../../hooks/useDesktopMode";
import EditorSidebarBase from "./EditorSidebarBase/EditorSidebarBase";
import { Drawer } from "antd";

interface Props {
  className?: string;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  onActiveContentUpdate: (text: string) => void;
}

function Sidebar({
  className,
  isMobileOpen,
  onMobileClose,
  onActiveContentUpdate,
}: Props) {
  const isDesktop = useDesktopMode();

  return isDesktop ? (
    <EditorSidebarBase
      className={className}
      onActiveContentUpdate={onActiveContentUpdate}
    />
  ) : (
    <Drawer
      title="Content helper"
      placement={"bottom"}
      onClose={onMobileClose}
      open={isMobileOpen}
      size="large"
    >
      <EditorSidebarBase
        className={className}
        onActiveContentUpdate={onActiveContentUpdate}
      />
    </Drawer>
  );
}

export default Sidebar;
