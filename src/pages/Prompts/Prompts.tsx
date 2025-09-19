import { useState } from "react";
import {
  Card,
  Button,
  Typography,
  Input,
  Modal,
  List,
  Space,
  message,
} from "antd";
import { Prompt } from "../../models/prompt";
import {
  useAddPromptMutation,
  useDeletePromptMutation,
} from "../../store/utils/api";
import { useLoaderApi } from "../../utils/router";

const { Title } = Typography;

const Prompts = () => {
  const {
    data: prompts,
    isLoading,
    isError,
  } = useLoaderApi<{ prompts: Prompt[] }>();
  const [addPrompt, { isLoading: isAdding }] = useAddPromptMutation();
  const [deletePrompt, { isLoading: isDeleting }] = useDeletePromptMutation();
  const [input, setInput] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleAdd = async () => {
    if (!input.trim()) return;
    try {
      await addPrompt({ text: input }).unwrap();
      setInput("");
      //refetch();
      message.success("Prompt added");
    } catch {
      message.error("Failed to add prompt");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePrompt({ propmtId: deleteId }).unwrap();
      setDeleteId(null);
      setModalOpen(false);
      //refetch();
      message.success("Prompt deleted");
    } catch {
      message.error("Failed to delete prompt");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading prompts</div>;

  return (
    <Card style={{ maxWidth: 500, margin: "0 auto" }}>
      <Title level={3}>Prompts</Title>
      <List
        dataSource={prompts.prompts || []}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                danger
                size="small"
                loading={isDeleting && deleteId === item.id}
                onClick={() => {
                  setDeleteId(item.id);
                  setModalOpen(true);
                }}
              >
                Delete
              </Button>,
            ]}
          >
            <span>{item.text}</span>
          </List.Item>
        )}
      />
      <Space style={{ marginTop: 16 }}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="New prompt"
          onPressEnter={handleAdd}
          disabled={isAdding}
        />
        <Button type="primary" onClick={handleAdd} loading={isAdding}>
          Add
        </Button>
      </Space>
      <Modal
        open={modalOpen}
        onOk={handleDelete}
        onCancel={() => setModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
        confirmLoading={isDeleting}
      >
        Are you sure you want to delete this prompt?
      </Modal>
    </Card>
  );
};

export default Prompts;
