import React, { useState, useEffect } from 'react'
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { addArticleApi } from '../apis/articleApi';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

export default function Article() {

  const [articleTitle, setArticleTitle] = useState('')
  const [articleContent, setArticleContent] = useState('')

  const handleEditorChange = content => {
    setArticleContent(content)
  };

  const onSubmit = async () => {
    let res = await addArticleApi({
      "tittle": articleTitle,
      "description": articleContent
    })
    console.log(res)
  }


  return (
    <div>
      <div className='card' style={{
        height: '45em'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          height: '38em'
        }}>
          <TextField
            required
            id="outlined-basic"
            label="Title"
            variant="outlined"
            style={{
              width: '100%',
              marginTop: '1em',
              marginBottom: '1em'
            }}
            value={articleTitle}
            onChange={(event) => {
              setArticleTitle(event.target.value)
            }}
          />
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}>
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

        </div>
        <div style={{
          display: 'flex',
          flex: 'row',

        }}>
          <Button variant="outlined" color="success" onClick={() => onSubmit()}>
            Submit
          </Button>
        </div>

      </div>
    </div>
  );
}
