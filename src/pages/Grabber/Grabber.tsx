import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Button, Typography, Spin, Flex, List } from "antd";
import { useLoaderApi } from "../../utils/router";
import { GrabberInfo, GrabberFile } from "../../models/grabber";
import { useTestGrabberMutation } from "../../store/channels/api";
import Prism from "prismjs";
import styles from "./Grabber.module.css";
import "prismjs/themes/prism-tomorrow.css";

const { Title, Text } = Typography;

const GrabberPage = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const { data: grabberInfo, isLoading, isError } = useLoaderApi<GrabberInfo>();
  const [selectedFile, setSelectedFile] = useState<GrabberFile | null>(null);
  const [testGrabber, { isLoading: testLoading }] = useTestGrabberMutation();
  const [testResult, setTestResult] = useState<string>("");

  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      Prism.highlightElement(ref.current);
    }
  }, [selectedFile?.content]);

  const handleTestGrabber = async () => {
    if (!channelId) return;
    setTestResult("");
    try {
      const res = await testGrabber({ channelId }).unwrap();
      setTestResult(res.content);
    } catch {
      setTestResult("Test failed or timed out");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Grabber Files for Channel: {channelId}</Title>
      {isLoading ? <Spin /> : null}
      {isError ? <Text type="danger">Failed to load grabber info</Text> : null}
      <Flex vertical={false} gap={16}>
        {!isLoading && !isError && (
          <Flex gap={12} wrap="wrap">
            <List
              header={<div>Grabber files</div>}
              bordered
              dataSource={grabberInfo?.grabbers}
              renderItem={(item) => (
                <List.Item
                  onClick={() => setSelectedFile(item)}
                  className={styles.listItem}
                >
                  <Typography.Text mark>{item.fileName}</Typography.Text>
                </List.Item>
              )}
            />
          </Flex>
        )}
        {selectedFile ? (
          <Card title={selectedFile.fileName}>
            <div
              ref={ref}
              className="language-javascript"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {selectedFile.content}
            </div>
          </Card>
        ) : null}
      </Flex>
      <Button
        type="primary"
        size="large"
        style={{ marginTop: 32 }}
        loading={testLoading}
        onClick={handleTestGrabber}
      >
        Test Grabber
      </Button>
      {testResult ? (
        <Card style={{ marginTop: 24 }} title="Test Result">
          <pre style={{ whiteSpace: "pre-wrap" }}>{testResult}</pre>
        </Card>
      ) : null}
    </div>
  );
};

export default GrabberPage;
