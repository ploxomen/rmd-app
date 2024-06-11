import { Editor } from '@tinymce/tinymce-react'
import React from 'react'
function EditorText({label,editorRef,id,initialValue = ""}) {
  return (
    <>
        <span className='text-sm mb-1 block dark:text-white text-placeholder'>{label}</span>
        <Editor
            apiKey='8t4qx4b9gcwo6s7dzp7nsa21iratzhav27cguj5jjkstyi8a'
            onInit={(evt, editor) => editorRef.current = editor}
            initialValue={!initialValue ? "" : initialValue}
            id={id}
            init={{
              language:'es',
              branding:false,
              toolbar_mode:'sliding',
              height: 300,
              menubar: false,
              font_size_formats: '5pt 6pt 7pt 8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks fontfamily fontsize | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:8pt;}'
            }}
        />
    </>
  )
}

export default EditorText