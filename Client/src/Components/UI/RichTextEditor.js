import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CardBody } from '../text';


const RichTextEditor = (props) => {
  /*
   * Quill modules to attach to editor
   * See https://quilljs.com/docs/modules/ for complete options
   */
  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['link'],
      ['clean'],
    ],
    // 'emoji-toolbar': true,
    // 'emoji-textarea': true,
    // 'emoji-shortname': true,
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };
  /*
   * Quill editor formats
   * See https://quilljs.com/docs/formats/
   */
  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
    // 'emoji',
  ];

  return (
    <div className="py-3">
      <CardBody name={props.label} additional="font-semibold" />
      <ReactQuill
        className="max-h-50vh overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100"
        theme="snow"
        editorHtml="html"
        value={props.value}
        onChange={props.onChange}
        modules={modules}
        formats={formats}
        placeholder={props.placeholder}
      />
    </div>
  );
};
export default RichTextEditor;
