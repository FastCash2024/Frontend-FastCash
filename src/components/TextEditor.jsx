'use client'
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.core.css';
import React, { useState, useEffect } from 'react';
// import 'react-quill/dist/quill.Bubble.css';
import dynamic from 'next/dynamic'

const ReactQuill = dynamic(async () => await import("react-quill"), { ssr: false })
// import ReactQuill from 'react-quill';
// var FontAttributor = Quill.import('attributors/class/font');
// FontAttributor.whitelist = [
//   'sofia', 'slabo', 'roboto', 'inconsolata', 'ubuntu'
// ];
// Quill.register(FontAttributor, true);

export default function TextEditor({ value, setValue, edit }) {
    const [isLoading, setIsLoading] = useState(false)
    const [modules, setModules] = useState({
        toolbar: [
            ['bold', 'italic', 'underline'],        // toggled buttons
            // ['blockquote', 'code-block'],
            // [{ 'header': 1 }, { 'header': 2 }],               // custom button values

            [{ 'size': ['small', '', 'large'] }],  // custom dropdown
            [{ 'align': '' }],
            [{ 'align': 'center' }],
            [{ 'align': 'right' }],
            [{ 'align': 'justify' }],
            // [{ 'size': ['Config'] }],  // custom dropdown
            // [{ 'font': [] }],

            // [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            // [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            // [{ 'direction': 'rtl' }],

            // text direction

            // {'size': {'Small': '14px', 'Normal': false, 'Large': '16px', 'Huge': '18px'}}
            ["link", 'image', "video"],
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript




            ['clean']                                         // remove formatting button
        ],
        // clipboard: {
        //     // toggle to add extra line breaks when pasting HTML:
        //     matchVisual: false,
        // },

    }
    );


    const [formats, setFormats] = useState([
        'font', 'size',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'script',
        'header', 'blockquote', 'code-block',
        'indent', 'list',
        'direction', 'align',
        'link', 'image', 'video', 'formula',
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "align",
        "color",
        "background",
    ]);

    useEffect(() => {
        setIsLoading(true)
    }, []);
    return isLoading && <div className='bg-white text-black z-50'>
   
        {
            edit
                ?
                <ReactQuill theme="snow" modules={modules}
                    formats={formats} value={value} onChange={setValue} />
                :''
                // <ReactQuill theme="bubble"
                //     formats={formats} value={value} />
        }
    </div>
}