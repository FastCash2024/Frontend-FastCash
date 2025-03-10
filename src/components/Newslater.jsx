'use client'
import { useAppContext } from '@/context/AppContext.js'
import Button from '@/components/Button'
import TextEditor from '@/components/TextEditor'
import Loader from '@/components/Loader'
import { useState, useEffect } from 'react'
import style from '@/components/ModatMSG.module.css'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.core.css';
import { EditIcon, DeleteIcon } from '@/icons_SVG/index.js'; 
import ModalEditNewslater from '@/components/modals/ModalEditNewslater'; // Importa el modal de edición

export default function Newslater() {
    const { user, modal, setUserSuccess, setModal, loader, setLoader, setAlerta, setNewslater } = useAppContext()

    const [data, setData] = useState([])
    const [textEditor2, setTextEditor2] = useState("Redactar...")

    const searchParams = useSearchParams()
    const mode = searchParams.get('mode')
    const seccion = searchParams.get('seccion')
    const item = searchParams.get('item')

    function handlerTextEditorOnChange2(content, delta, source, editor) {
        setTextEditor2(editor.getHTML())
    }

    const save = async () => {
        setLoader('Guardando...')
        const response = await fetch(window?.location?.href?.includes("localhost")
            ? "http://localhost:3005/api/notifications/newsletter" : 'https://api.fastcash-mx.com/api/notifications/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: textEditor2 }),
        });
        const data = await response.json();
        console.log(data);  
        setLoader('')
    };

    const getData = async () => {
        const response = await fetch(window?.location?.href?.includes("localhost")
            ? "http://localhost:3005/api/notifications/newsletter" : 'https://api.fastcash-mx.com/api/notifications/newsletter')
        const db = await response.json()
        setData(db)
    }

    useEffect(() => {
        getData()
    }, [loader])

    const handleselect = (i) => {
        setTextEditor2(i)
    }

    const saveedit = async () => {
        setLoader('Guardando...')
        if (item === null || item === undefined) {
            setAlerta('no elementos para modificar')
        }
        const response = await fetch(window?.location?.href?.includes("localhost")
            ? `http://localhost:3005/api/notifications/newsletter/update/${item}` : `https://api.fastcash-mx.com/api/notifications/newsletter/update/${item}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: textEditor2 }),
        });
        const data = await response.json();
        console.log(data);  
        setLoader('')
    };

    const handleDelete = (i) => {
        setModal("Eliminar newslater");
        setNewslater(i)
    }
    const handleEdit = (i) => {
        setNewslater(i); // Establece el boletín informativo a editar en el contexto
        setModal("Editar newslater"); // Abre el modal de edición
    }

    console.log('data', data)
    return (seccion === 'comunicacion' && <div className={`h-full w-full flex flex-col justify-center items-center px-4 overflow-x-hidden overflow-y-auto `}>
        {modal === 'Guardando...' && <Loader> {modal} </Loader>}
        {modal === 'Eliminando...' && <Loader> {modal} </Loader>}
        <div className={`relative bg-white max-w-[1000px] w-full h-full overflow-y-scroll rounded-t-lg shadow-2xl p-5 `}>
            {
                mode === 'editor'
                    ? <h3 className='text-center py-10 text-black text-[35px] font-bold'>Redactar Newslater</h3>
                    : <h3 className='text-center py-10 text-black text-[35px] font-bold'> Newslater FASTCASH</h3>
            }
            <div className='text-black'>

                {data?.slice(0).reverse().map((item, index) => {
                    return (
                        <div key={index} className='flex flex-col w-full justify-between'>
                            
                            <div className="ql-editor">
                            <p dangerouslySetInnerHTML={{ __html: item.content }} />
                            {user.rol === "Super Admin" && (
                                <div className='flex justify-start space-x-2 mt-2'>
                                    <Link href={`?seccion=comunicacion&mode=editor&item=${item._id}`}>
                                        <button onClick={() => handleEdit(item)} className='text-blue-500 hover:text-blue-700' title="Editar">
                                            <EditIcon />
                                        </button>
                                    </Link>
                                    <button onClick={() => handleDelete(item)} className='text-red-500 hover:text-red-700' title="Eliminar">
                                        <DeleteIcon />
                                    </button>
                                </div>
                            )}
                            </div>   
                            
                        </div>
                    );
                })}
            </div>

            {user.rol === "Super Admin" && (
                <div className="text-center text-black">
                    {mode === 'editor' && (
                        <div className={style.editor}>
                            <TextEditor setValue={handlerTextEditorOnChange2} value={textEditor2 ? textEditor2 : 'nada'} edit={true} />
                        </div>
                    )}
                    <br />
                    {mode === 'editor' ? (
                        <div className='flex justify-around'>
                            <Link href="?seccion=comunicacion&mode=viewer" className='w-[250px]'>
                                <Button theme="Primary" click={() => setTextEditor2("Redactar...")}>Previsualizar</Button>
                            </Link>
                            <span className='w-[250px]'>
                                <Button theme="Primary" click={(item === null || item === undefined ? save : saveedit)}>Guardar</Button>
                            </span>
                        </div>
                    ) : (
                        <div className='flex justify-around'>
                            <Link href="?seccion=comunicacion&mode=editor" className='w-[250px]'>
                                <Button theme="Primary">Editor</Button>
                            </Link>
                            <span className='w-[250px]'>
                                <Button theme="Primary" click={(item === null || item === undefined ? save : saveedit)} >Guardar</Button>
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
        {modal === 'Editar newslater' && (
            <ModalEditNewslater /> // Renderiza el modal de edición cuando el estado modal es 'Editar newslater'
        )}
    </div>
    )
}