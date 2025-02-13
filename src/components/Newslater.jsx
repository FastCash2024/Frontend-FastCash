'use client'
// import style from '../styles/Loader.module.css' 
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

export default function Modal() {
    const {user, modal, setUserSuccess, setModal,loader, setLoader,setAlerta } = useAppContext()

    const [data, setData] = useState([])
    const [textEditor2, setTextEditor2] = useState("Redactar...")

    const searchParams = useSearchParams()
    const mode = searchParams.get('mode')
    const seccion = searchParams.get('seccion')
    const item = searchParams.get('item')

    function handlerTextEditorOnChange2(content, delta, source, editor) {
        // console.log(editor.getHTML())
        // setTextEditor(editor.getHTML())
        setTextEditor2(editor.getHTML())

    }

    const save = async () => {
        setLoader('Guardando...')
        const response = await fetch(window?.location?.href?.includes("localhost")
            ? "http://localhost:3000/api/newsletter" : 'https://api.fastcash-mx.com/api/newsletter', {
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
            ? "http://localhost:3000/api/newsletter" : 'https://api.fastcash-mx.com/api/newsletter')
        const db = await response.json()
        setData(db)
    }

    useEffect(() => {
        getData()
    }, [loader])

    const handleselect = (i)=>{
        setTextEditor2(i)
    }

    const saveedit = async () => {
        setLoader('Guardando...')
        if(item===null||item===undefined){
            setAlerta('no elementos para modificar')
        }
        const response = await fetch(window?.location?.href?.includes("localhost")
            ? `http://localhost:3000/api/newsletter/update/${item}`: 'https://api.fastcash-mx.com/api/newsletter', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: textEditor2 }),
        });
        const data = await response.json();
        console.log(data);  
        setLoader('')
    };

    const deleteItem = async (id) => {
        setLoader('Eliminando...');
        const response = await fetch(window?.location?.href?.includes("localhost")
          ? `http://localhost:3000/api/newsletter/delete/${id}`
          : `https://api.fastcash-mx.com/api/newsletter/delete/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        console.log(data);
        setLoader('');
        getData(); // Actualizar la lista después de eliminar
      };

    console.log('data', data)
    return (seccion ==='comunicacion' && <div className={`h-full w-full flex flex-col justify-center items-center px-4 overflow-x-hidden overflow-y-auto `}>
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
                        <div className='flex flex-row w-full justify-between'>   
                        <p key={index} className='ql-editor' dangerouslySetInnerHTML={{ __html: item.content }} />
                        
                        {user.rol === "Super Admin" && (
                            <Link href={`?seccion=comunicacion&mode=editor&item=${item._id}`} className='w-[250px] space-x-2'>
                                <button onClick={()=>handleselect (item.content)} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded'>editar</button>
                                <button onClick={() => deleteItem(item._id)} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded'>Eliminar</button>
                            </Link>
                        )}
                        </div>
                    );
                })}
            </div>


            <div className="text-center text-black">
                {mode === 'editor' && user.rol === "Super Admin" && (
                    <div className={style.editor}>
                        <TextEditor setValue={handlerTextEditorOnChange2} value={textEditor2 ? textEditor2 : 'nada'} edit={true} />
                    </div>
                )}
                <br />
                {mode === 'editor' && user.rol === "Super Admin" ? (
                    <div className='flex justify-around'>
                        <Link href="?seccion=comunicacion&mode=viewer" className='w-[250px]'>
                            <Button theme="Primary" click={()=>setTextEditor2("Redactar...")}>Previsualizar</Button>
                        </Link>
                        <span className='w-[250px]'>
                            <Button theme="Primary" click={(item !== null || item !== undefined ? saveedit : save)}>Guardar</Button>
                        </span>
                    </div>
                ) : (
                    <div className='flex justify-around'>
                        <Link href="?seccion=comunicacion&mode=editor" className='w-[250px]'>
                            <Button theme="Primary">Editor</Button>
                        </Link>
                        <span className='w-[250px]'>
                            <Button theme="Primary" click={(item !== null || item !== undefined ? saveedit : save)} >Guardar</Button>
                        </span>
                    </div>
                )}
            </div>
        </div>
    </div>
    )
}


