'use client'

import { useAppContext } from '@/context/AppContext';
import { useSearchParams } from 'next/navigation';

export default function FormLayoutEdit({ children }) {
    const { setModal } = useAppContext();
    const searchParams = useSearchParams();
    const seccion = searchParams.get('seccion');
    const item = searchParams.get('item');

    return (
        <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-40' onClick={() => setModal('')}>
            <div className='relative flex flex-col items-center justify-center bg-gray-200 w-full max-w-[800px] py-8 px-10 space-y-3 rounded-[5px]' onClick={(e) => e.stopPropagation()}> {/* Ajusta el ancho del modal */}
                <button
                    className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                    onClick={() => setModal('')}
                >
                    X
                </button>
                {children}
            </div>
        </div>
    );
}