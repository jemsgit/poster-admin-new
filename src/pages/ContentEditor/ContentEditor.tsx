import React from "react";
import Editor from "../../components/Editor/Editor";

interface Props {}

function ContentEditor(props: Props) {
  const {} = props;

  return (
    <div>
      <Editor
        onSave={() => {}}
        isSaving={false}
        content="<div>131313 dasdals;d naklsdjflk as</div>"
      />
    </div>
  );
}

export default ContentEditor;
