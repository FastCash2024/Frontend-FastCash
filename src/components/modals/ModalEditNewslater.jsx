import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import TextEditor from '@/components/TextEditor';
import Button from '@/components/Button';
import FormLayoutEdit from '@/components/formModals/FormLayoutEdit'; // Importa el nuevo FormLayoutEdit

export default function ModalEditNewslater() {
    const { newslater, setModal, setLoader, setAlerta } = useAppContext();
    const [textEditorContent, setTextEditorContent] = useState(newslater.content);

    useEffect(() => {
        setTextEditorContent(newslater.content);
    }, [newslater]);

    const handleSave = async () => {
        setLoader('Guardando...');
        try {
            const response = await fetch(window?.location?.href?.includes('localhost')
                ? `http://localhost:3000/api/newsletter/update/${newslater._id}`
                : `https://api.fastcash-mx.com/api/newsletter/update/${newslater._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: textEditorContent }),
            });

            if (!response.ok) {
                throw new Error(`Error en la actualización`);
            }

            const result = await response.json();
            setModal('');
            setLoader('');
            setAlerta('Boletín informativo actualizado exitosamente!');
            console.log('Respuesta del servidor:', result);
        } catch (error) {
            console.error('Error al actualizar el boletín informativo:', error.message);
        }
    };

    const handleCancel = () => {
        setModal('');
    };

    return (
        <FormLayoutEdit>
            <div className="text-center w-full"> {/* Ajusta el ancho del modal */}
                <h3 className='text-black text-[35px] font-bold'>Editando...</h3>
                <div className="mt-4">
                    <TextEditor setValue={setTextEditorContent} value={textEditorContent} edit={true} />
                </div>
                <div className="flex justify-center mt-4 space-x-3">
                    <button
                        className="w-full max-w-[100px] text-white bg-gradient-to-br from-red-600 to-red-400 hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        onClick={handleCancel}
                    >
                        Cancelar
                    </button>
                    <button
                        className="w-full max-w-[100px] text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        onClick={handleSave}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </FormLayoutEdit>
    );
}