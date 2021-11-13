import React, { useState, useEffect } from 'react'
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { addArticleApi, getArticleDetailApi } from '../apis/articleApi';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

export default function CreateArticle(props) {

  const [articleTitle, setArticleTitle] = useState('')
  const [articleContent, setArticleContent] = useState('')
  const [imageFile, setImageFile] = useState(undefined)
  const [isGettingArticle, setIsGettingArticle] = useState(true)

  useEffect(() => {
    if (props.location.state?.articleData) {
      getArticleDetail(props.location.state?.articleData?.id)
    } else {
      setIsGettingArticle(false)
    }
  }, [])

  useEffect(() => {
  }, [articleTitle])

  const handleEditorChange = content => {
    setArticleContent(content)
  };

  const onSubmit = async () => {
    let formData = new FormData()

    formData.append('AvatarFile', imageFile)
    formData.append('Tittle', articleTitle)
    formData.append('Description', articleContent)

    let res = await addArticleApi(formData)

    if (res) {
      props.history.push({
        pathname: `/article`,
      })
    }
  }

  const getArticleDetail = async (id) => {

    let res = await getArticleDetailApi({
      id: id
    })
    console.log(res)
    if (res) {
      setArticleTitle(res?.data?.tittle)
      setArticleContent(res?.data?.description)
    }

  }



  return (
    <div>
      <div className='card' style={{ height: '45em' }}>
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
          <div className={'flex flex-row my-1 items-center '} style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <span style={{
              textAlign: 'left',
              width: '8rem',
              marginTop: '1em',
              marginBottom: '1em'
            }}>Upload image</span>
            <div>
              {/* <img src={imageLink} className='w-40 mx-10' /> */}
              <input
                type='file'
                accept="image/*"
                style={{
                  display: 'flex',
                  flex: '1 1 auto',
                  outline: '2px solid transparent',
                  outlineOffset: '2px',
                }}
                onChange={(event) => {
                  console.log(event.target.files[0])
                  setImageFile(event.target.files[0])
                }}
              />
            </div>
          </div>


          <div style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}>
            {
              props.location.state?.articleData?.id && props.location.state?.articleData?.id
            }
            <SunEditor
              // setContents="My contents"
              defaultValue={articleContent}
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
        <div style={{ display: 'flex', flex: 'row', }}>
          <Button variant="outlined" onClick={() => onSubmit()}>
            Submit
          </Button>
        </div>

      </div>
    </div>
  );
}
