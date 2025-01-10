import { Card } from "antd";
import styles from "./DashboardListItem.module.css";

interface DasboardListItemProps {
  title: string;
  content: string;
  onClick?: () => void;
}

function DasboardListItem(props: DasboardListItemProps) {
  const { title, content, onClick } = props;

  return (
    <Card
      title={title}
      bordered
      onClick={() => onClick?.()}
      className={styles.container}
    >
      {content}
    </Card>
  );
}

export default DasboardListItem;
