import React from "react";
import { TimePicker, Button } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

interface MultipleTimePickerProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}

export const MultipleTimePicker: React.FC<MultipleTimePickerProps> = ({
  value = [],
  onChange,
}) => {
  const handleChange = (index: number, timeString: string | null) => {
    const newTimes = [...value];
    if (timeString) {
      newTimes[index] = timeString;
    } else {
      newTimes.splice(index, 1);
    }
    onChange?.(newTimes);
  };

  const addTime = () => {
    onChange?.([...value, "00:00"]);
  };

  const parseTime = (timeString: string): Date => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  return (
    <div>
      {value.map((time, index) => (
        <div key={index} style={{ marginBottom: 8 }}>
          <TimePicker
            value={parseTime(time)}
            format="HH:mm"
            onChange={(_, timeString) => handleChange(index, timeString)}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<MinusOutlined />}
            onClick={() => {
              const newTimes = [...value];
              newTimes.splice(index, 1);
              onChange?.(newTimes);
            }}
          />
        </div>
      ))}
      <Button icon={<PlusOutlined />} onClick={addTime}>
        Add Time
      </Button>
    </div>
  );
};
