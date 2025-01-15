'use client'
import { useAppContext } from '@/context/AppContext.js'
import { useState } from 'react'
export default function FormSendSms() {


    const { user, userDB, setUserProfile, users, alerta, setAlerta, modal, checkedArr, setCheckedArr, setModal, loader, setLoader, setUsers, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, divisas, setDivisas, exchange, setExchange, destinatario, setDestinatario, itemSelected, setItemSelected } = useAppContext()
    const [smsText, setSmsText] = useState('')

    function sendSmsHandler () {
        
    }

    function onChangeHandler(e) {

        const value = e.target.value
        setSmsText(value)
    }

    return (
        <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50' onClick={() => setModal('')}>
            <div className='relative flex flex-col items-center justify-center bg-gray-200 w-[400px] h-[300px] p-5 space-y-5 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
                <button
                    className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                    onClick={() => setModal('')}
                >
                    X
                </button>

                <h4 className="text-gray-950">Enviar SMS</h4>

                <div className='relative flex flex-col w-full'>

                    <label htmlFor="" className="mr-5 text-[10px] pb-2 text-black">
                        Contenido {smsText.length}/50

                    </label>
                    <textarea name="" maxLength={50} value={smsText} className='text-[10px] p-2 w-full focus:outline-none bg-gray-200 border-[1px] border-gray-300 rounded-[5px] text-black' onChange={onChangeHandler} id=""></textarea>
                </div>


                <button type="button" class="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2"
                    onClick={sendSmsHandler}>Enviar SMS</button>

            </div>

        </div>
    )
}