import { useState } from "react";
import {
  Card,
  Button,
  Modal,
  Upload,
  List,
  message,
  Typography,
  Space,
} from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { useLoaderApi } from "../../utils/router";
import { Image } from "../../models/image";
import {
  useDeleteImageMutation,
  useUploadImageMutation,
} from "../../store/utils/api";
import { getImagePathByUrl } from "../../utils/images";

const { Title } = Typography;

const Images = () => {
  const { data, isLoading, isError } = useLoaderApi<{ images: Image[] }>();
  const [deleteImage, { isLoading: isDeleting }] = useDeleteImageMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const [deleteName, setDeleteName] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const refetch = () => window.location.reload(); // fallback for loaderApi

  const handleDelete = async () => {
    if (!deleteName) return;
    try {
      await deleteImage({ imageId: deleteName }).unwrap();
      setDeleteName(null);
      setModalOpen(false);
      message.success("Image deleted");
      refetch();
    } catch {
      message.error("Failed to delete image");
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
    }
    return isImage || Upload.LIST_IGNORE;
  };

  const handleUpload = async ({ file }: any) => {
    try {
      await uploadImage(file).unwrap();
      message.success("Image uploaded");
      refetch();
    } catch {
      message.error("Failed to upload image");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading images</div>;

  return (
    <Card style={{ maxWidth: 600, margin: "0 auto" }}>
      <Title level={3}>Images</Title>
      <Upload.Dragger
        name="file"
        multiple={false}
        customRequest={handleUpload}
        beforeUpload={beforeUpload}
        showUploadList={false}
        disabled={isUploading}
        style={{ marginBottom: 24 }}
      >
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">Click or drag image to upload</p>
      </Upload.Dragger>
      <List
        dataSource={data.images || []}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
                loading={isDeleting && deleteName === item.filename}
                onClick={() => {
                  setDeleteName(item.filename);
                  setModalOpen(true);
                }}
              >
                Delete
              </Button>,
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
                loading={isDeleting && deleteName === item.filename}
                onClick={async () => {
                  try {
                    const url = getImagePathByUrl(item.url);
                    await navigator.clipboard.writeText(getImagePathByUrl(url));
                    message.success("Copied! " + url);
                  } catch {
                    message.error("Failed to copy");
                  }
                }}
              >
                Copy url
              </Button>,
            ]}
          >
            <Space>
              <img
                src={getImagePathByUrl(item.url)}
                alt={item.filename}
                style={{ maxHeight: 60, maxWidth: 100, objectFit: "contain" }}
              />
              <span>{item.filename}</span>
            </Space>
          </List.Item>
        )}
      />
      <Modal
        open={modalOpen}
        onOk={handleDelete}
        onCancel={() => setModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
        confirmLoading={isDeleting}
      >
        Are you sure you want to delete this image?
      </Modal>
    </Card>
  );
};

export default Images;
