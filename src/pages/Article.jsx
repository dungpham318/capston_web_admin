import React from 'react'
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

export default function Article() {
  const handleEditorChange = content => {
    console.log(content);
  };
  return (
    <div className="App">
      <SunEditor
        // setContents="My contents"
        showToolbar={true}
        onChange={handleEditorChange}
        setDefaultStyle="height: auto"
        setOptions={{
          buttonList: [
            [
              "bold",
              "underline",
              "italic",
              "strike",
              "list",
              "align",
              "fontSize",
              "formatBlock",
              "table",
              "image",
              "print",
              "save"
            ]
          ]
        }}
      />
    </div>
  );
}
