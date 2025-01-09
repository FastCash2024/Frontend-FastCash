'use client'
// import style from '../styles/Loader.module.css' 
import { useAppContext } from '@/context/AppContext.js'
import Button from '@/components/Button'
import TextEditor from '@/components/TextEditor'
import Loader from '@/components/Loader'
import { useState } from 'react'
import style from '@/components/ModatMSG.module.css'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.core.css';

export default function Modal() {
    const { modal, setUserSuccess, setModal } = useAppContext()

    const [textEditor, setTextEditor] = useState("Redactar...")
    const [textEditor2, setTextEditor2] = useState("Redactar...")

    const searchParams = useSearchParams()
    const mode = searchParams.get('mode')

    function handlerTextEditorOnChange(content, delta, source, editor) {
        // console.log(editor.getHTML())
        // setTextEditor(editor.getHTML())
        console.log(editor.getContents())
        setTextEditor(editor.getHTML())

    }
    function handlerTextEditorOnChange2(content, delta, source, editor) {
        // console.log(editor.getHTML())
        // setTextEditor(editor.getHTML())
        setTextEditor2(editor.getHTML())

    }
    function save(route) {
        function callback() {
            setModal('')
        }
        setModal('Guardando...')
        writeUserData(route, { content: route !== '/politicas' ? textEditor : textEditor2 }, setUserSuccess, callback)
    }

    return (<div className={`h-full w-full flex flex-col justify-center items-center px-4 overflow-x-hidden overflow-y-auto `}>
        {modal === 'Guardando...' && <Loader> {modal} </Loader>}
        {/* <div className={`relative bg-white max-w-[1000px] w-full  rounded-lg shadow p-5 `}>
            <h3 className='text-center py-10'>Redactar Newslater</h3>
            <div className=" text-center">
                <div className={style.editor}>
                    <TextEditor setValue={handlerTextEditorOnChange} value={textEditor ? textEditor : 'nada'} edit={true} />
                </div>
                <br />
                <Button theme="Primary" click={() => save('/nosotros')}>Enviar</Button>
            </div>
        </div>  <br />  */}
        <div className={`relative bg-white max-w-[1000px] w-full h-full overflow-y-scroll rounded-t-lg shadow p-5 `}>
            {
                mode === 'editor' && <h3 className='text-center py-10'>Redactar Newslater</h3>
            }
            <div className="text-center">
                {mode === 'editor'
                    ? <div className={style.editor}>
                        {/* <TextEditor setValue={handlerTextEditorOnChange2} value={textEditor2 ? textEditor2 : 'nada'} edit={true} /> */}
                    </div>
                    : <div className={style.editor}>
                        <div className='ql-editor' dangerouslySetInnerHTML={{ __html: textEditor2 }}></div>
                        {/* <TextEditor setValue={handlerTextEditorOnChange2} value={textEditor2 ? textEditor2 : 'nada'} edit={false} /> */}
                    </div>
                }
                <br />
                {mode === 'editor' ?
                    <div className='flex justify-around'>
                        <Link href="?mode=viewer" className='w-[250px]'>
                            <Button theme="Primary">Previsualizar</Button>
                        </Link>
                        <span className='w-[250px]'>
                            <Button theme="Primary">Guardar</Button>
                        </span>
                    </div>
                    : <div className='flex justify-center'>
                        <Link href="?mode=editor" className='w-[250px]'>
                            <Button theme="Primary">Editor</Button>
                        </Link>
                    </div>
                }
            </div>
        </div>
    </div>
    )
}






