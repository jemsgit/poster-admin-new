import { Collapse } from "antd";
import styles from "./RuleInfo.module.css";

const text = `Жирный текст: *Текст*
Перевод на новую строку: Привет!///nЭто текст на новой строке.
Изображение: [img-at](http|https://.....)
Видео: [video-at](http|https://.....).
Хеш тег (будет перемещен наверх поста): ##hashTag 
`;

interface RulesInfoProps {
  className?: string;
}

function RulesInfo({ className }: RulesInfoProps) {
  return (
    <Collapse
      className={`${className || ""}`}
      items={[
        {
          key: "1",
          label: "Правила разметки",
          children: <p className={styles.rulesItem}>{text}</p>,
        },
      ]}
    />
  );
}

export default RulesInfo;
