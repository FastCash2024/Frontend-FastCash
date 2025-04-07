'use client'
import { useAppContext } from '@/context/AppContext'
import React, { useState, useEffect, useRef } from 'react'

import Loader from '@/components/Loader'
import SelectSimple from '@/components/SelectSimple'

import dynamic from 'next/dynamic';
import { useTheme } from '@/context/ThemeContext';

// import Velocimetro from '@/components/Velocimetro'
import FormAddAccount from '@/components/formModals/FormAddAccount'
import FormAddMasiveAccounts from '@/components/formModals/FormAddMasiveAccounts'
import FormAddPersonalAccount from '@/components/formModals/FormAddPersonalAccount'
import FormAddVerification from '@/components/formModals/FormAddVerification'
import FormAdminAccount from '@/components/formModals/FormAdminAccount'
import FormAddApplication from '@/components/formModals/FormAddApplication'
import FormDistributionCases from '@/components/formModals/FormDistributionCases'
import FormAsignarAsesor from '@/components/formModals/FormAsignarAsesor'
import FormAsignarCuenta from '@/components/formModals/FormAsignarCuenta'
import FormAdminAsesor from '@/components/formModals/FormAdminAsesor'
import FormRestablecimiento from '@/components/formModals/FormRestablecimiento'
import FormRestablecimientoCuenta from '@/components/formModals/FormRestablecimientoCuenta'
import FormSendSMS from "@/components/formModals/FormSendSms"
import FormAttendance from "@/components/formModals/FormAttendance"
import FormTimeEntry from "@/components/formModals/FormTimeEntry"

import { useRouter } from 'next/navigation';

import FormEditAccount from '@/components/formModals/FormEditAccount'
import FormAddAuditor from '@/components/formModals/FormAddAuditor'
import FormUpdateAplication from '@/components/formModals/FormUpdateApplication'
import ModalDeleteApplication from '@/components/modals/ModalDeleteApplication'
import FormAddCobranza from '@/components/formModals/FormAddCobranza'
import FormEditCyB from '@/components/formModals/FormEditCyB'
import FormAddPago from '@/components/formModals/FormAddPago'
import FormAddExtension from '@/components/formModals/FormAddExtension'
import FormAddTipoApp from '@/components/formModals/FormAddTipoApp'
import FormUpdateTipoApp from '@/components/formModals/FormUpdateTipoApp'
import ModalDeleteTipoApp from '@/components/modals/ModalDeleteTipoApp'
import FormAddMulta from '@/components/formModals/FormAddMulta'
import FormUpdateMulta from './formModals/FormUpdateMulta'
import ModalDeleteNewslater from './modals/ModalDeleteNewslater'
import FormAddComision from './formModals/FormAddComision'
import FormUpdateComision from './formModals/FormUpdateComision'
import ModalDeleteComision from './modals/ModalDeleteComision'
import FormDistributtonCasesSegment from './formModals/FormDistributtonCasesSegment'
import FormRestablecimientoAuditors from './formModals/FormRestablecimientoAuditors'
import FormDistributionAuditors from './formModals/FormDistributionMasiveAuditors'
import FormPagado from './formModals/FormPagado'
import FormPagadoExtension from './formModals/FormPagadoExtension'
import FormAsignarCuentaAuditor from './formModals/FormAsignarCuentaAuditor'
import FormAddComisionVerificacion from './formModals/FormAddComisionVerificacion'
import FormUpdateComisionVerification from './formModals/FormUpdateComisionVerification'

export default function Home() {

    const router = useRouter()
    const { user, users, modal, setModal, loader } = useAppContext()

    const [editItem, setEditItem] = useState(undefined)

    const { theme } = useTheme();

    const [value, setValue] = useState({})

    function handlerSelectClick2(name, i, uuid) {
        if (name === 'Tipo de grupo') {
            setValue({ ...value, [name]: i, ['Codificación de roles']: 'Por favor elige' })
        } else {
            setValue({ ...value, [name]: i })
        }
    }

    const optionsArray = [
        "Por favor elige",
        "Sin contactar",
        "No contactable",
        "Contactado",
        "Propósito de retrasar",
        "Propósito de pagar",
        "Promete a pagar",
        "Pagará pronto"
    ];

    useEffect(() => {
        user === undefined && router.push('/')
    }, [])

    return (
        user?.rol && <div className={` pt-[20px] `}>
            {loader === 'Guardando...' && <Loader>Guardando...</Loader>}
            {modal === 'Guardando...' && <Loader> {modal} </Loader>}
            {modal === 'Administrar cuenta' && <FormAdminAccount />}

            {
                modal === 'Registrar' && <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50' onClick={() => setModal('')}>
                    <div className='relative flex flex-col items-center justify-center bg-gray-200 w-[400px] h-[300px] p-5 space-y-5 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                            onClick={() => setModal('')}
                        >
                            X
                        </button>

                        <h4 className="text-gray-950">Registro de cobro</h4>
                        <div className='relative flex justify-between w-[300px] text-gray-950'>

                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Estado de credito:
                            </label>
                            <SelectSimple arr={optionsArray} name='Estado de reembolso' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                        </div>
                        <div className='relative flex justify-between w-[300px] text-gray-950'>

                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Registro por:
                            </label>
                            <textarea name="" className='text-[10px] p-2 w-[200px] focus:outline-none bg-gray-200 border-[1px] border-gray-300 rounded-[5px]' id=""></textarea>                        </div>


                        <button type="button" class="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => setModal('Registro de cobro')}>Registro de cobro</button>

                    </div>

                </div>
            }
            {
                modal === 'Registrar Usuario' && <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50' onClick={() => setModal('')}>
                    <div className='relative flex flex-col items-center justify-center bg-gray-200 w-[400px] h-[300px] p-5 space-y-5 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                            onClick={() => setModal('')}
                        >
                            X
                        </button>

                        <h4 className="text-gray-950">Registro de Usuario</h4>
                        <div className='relative flex justify-between w-[300px] text-gray-950'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Estado de usuario:
                            </label>
                            <SelectSimple arr={['Activo', 'Inactivo']} name='Estado de usuario' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                        </div>
                        <div className='relative flex justify-between w-[300px] text-gray-950'>

                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Acotación:
                            </label>
                            <textarea name="" className='text-[10px] p-2 w-[200px] focus:outline-none bg-gray-200 border-[1px] border-gray-300 rounded-[5px]' id=""></textarea>                        </div>


                        <button type="button" class="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => setModal('Registrar')}>Registrar</button>

                    </div>
                </div>
            }

            {
                modal === 'Registrar Multa' && <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50' onClick={() => setModal('')}>
                    <div className='relative flex flex-col items-center justify-center bg-gray-200 w-[400px] h-[300px] p-5 space-y-5 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                            onClick={() => setModal('')}
                        > X </button>

                        <h4 className="text-gray-950">Registro de Usuario</h4>

                        <div className='relative flex justify-between w-[300px] text-gray-950'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Cuenta Auditora:
                            </label>
                            <SelectSimple arr={['Activo', 'Inactivo']} name='Cuenta Auditora' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                        </div>

                        <div className='relative flex justify-between w-[300px] text-gray-950'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Id Auditor:
                            </label>
                            <SelectSimple arr={['Activo', 'Inactivo']} name='Id Auditor' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                        </div>
                        <div className='relative flex justify-between w-[300px] text-gray-950'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Tipo de multa:
                            </label>
                            <SelectSimple arr={['Activo', 'Inactivo']} name='Estado de reembolso' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                        </div>
                        <div className='relative flex justify-between w-[300px] text-gray-950'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Valor:
                            </label>
                            <SelectSimple arr={['Activo', 'Inactivo']} name='Estado de reembolso' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`} required />
                        </div>
                        <div className='relative flex justify-between w-[300px] text-gray-950'>

                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-white`}>
                                Acotación:
                            </label>
                            <textarea name="" className='text-[10px] p-2 w-[200px] focus:outline-none bg-gray-200 border-[1px] border-gray-300 rounded-[5px]' id=""></textarea>                        </div>


                        <button type="button" class="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => setModal('Registrar')}>Registrar</button>

                    </div>

                </div>
            }
            {
                modal === 'Registrar Multa' && <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50' onClick={() => setModal('')}>
                    <div className='relative flex flex-col items-center justify-center bg-gray-200 w-[400px] h-[300px] p-5 space-y-5 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                            onClick={() => setModal('')}
                        >
                            X
                        </button>

                        <h4 className="text-gray-950">Registro Multa</h4>
                        <div className='relative flex justify-between w-[300px] text-gray-950'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                                Cuenta Auditora:
                            </label>
                            1323132132
                        </div>

                        <div className='relative flex justify-between w-[300px] text-gray-950'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                                Id Auditor:
                            </label>
                            123132322
                        </div>
                        <div className='relative flex justify-between w-[300px] text-gray-950'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                                Tipo de multa:
                            </label>
                            <SelectSimple arr={['Activo', 'Inactivo']} name='Estado de reembolso' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`} required />
                        </div>
                        <div className='relative flex justify-between w-[300px] text-gray-950'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                                Valor:
                            </label>
                            <SelectSimple arr={['Activo', 'Inactivo']} name='Estado de reembolso' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`} required />
                        </div>
                        <div className='relative flex justify-between w-[300px] text-gray-950'>

                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                                Acotación:
                            </label>
                            <textarea name="" className='text-[10px] p-2 w-[200px] focus:outline-none bg-gray-200 border-[1px] border-gray-300 rounded-[5px]' id=""></textarea>                        </div>


                        <button type="button" class="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => setModal('Registrar')}>Registrar</button>

                    </div>
                </div>
            }
            {
                editItem && modal === 'Editar Usuario' && <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50' onClick={() => setModal('')}>
                    <div className='relative flex flex-col items-center justify-center bg-gray-200 w-[400px] h-[300px] p-5 space-y-5 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                            onClick={() => setModal('')}
                        >
                            X
                        </button>

                        <h4 className="text-gray-950">Editar</h4>
                        <div className='relative flex justify-between w-[300px] text-gray-950'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                                Estado de usuario:
                            </label>
                            <SelectSimple arr={['Activo', 'Inactivo']} name='Estado de reembolso' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`} required />
                        </div>
                        {/* <div className='relative flex justify-between w-[300px] text-gray-950'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                                Rol:
                            </label>
                            <SelectSimple arr={gestionDeRoles?.[user?.rol]} name='Rol' click={handlerSelectClick3} defaultValue={value} uuid='123456789' label='Filtro 4' position='absolute left-0 top-[25px]'  bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`} required />
                        </div> */}
                        <div className='relative flex justify-between w-[300px] text-gray-950'>

                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                                Acotación:
                            </label>
                            <textarea name="" className='text-[10px] p-2 w-[200px] focus:outline-none bg-gray-200 border-[1px] border-gray-300 rounded-[5px]' id=""></textarea>                        </div>


                        <button type="button" class="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => setModal('Registrar')}>Registrar</button>

                    </div>
                </div>
            }
            {
                modal === 'Solicitud a Manager' && <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50' onClick={() => setModal('')}>
                    <div className='relative flex flex-col items-center justify-center bg-gray-200 w-[400px] h-[300px] p-5 space-y-5 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                            onClick={() => setModal('')}
                        >
                            X
                        </button>

                        <h4 className="text-gray-950">Solicitud de Información a Manager</h4>
                        <div className='relative flex justify-between w-[300px] text-gray-950'>

                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                                Categoria:
                            </label>
                            <SelectSimple arr={['Nuemeros telefonicos']} name='Estado de reembolso' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`} required />
                        </div>
                        <div className='relative flex justify-between w-[300px] text-gray-950'>

                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                                Acotación:
                            </label>
                            <textarea name="" className='text-[10px] p-2 w-[200px] focus:outline-none bg-gray-200 border-[1px] border-gray-300 rounded-[5px]' id=""></textarea>                        </div>


                        <button type="button" class="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => setModal('Registro de cobro')}>Solicitar</button>

                    </div>
                </div>
            }
            {
                modal === 'Registrar Auditor' && <div className='fixed flex justify-center items-center top-0 left-0 bg-[#0000007c] h-screen w-screen z-50' onClick={() => setModal('')}>
                    <div className='relative flex flex-col items-center justify-center bg-gray-200 w-[400px] h-[300px] p-5 space-y-5 rounded-[5px]' onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-5 right-5 flex items-center justify-center w-12 h-6 bg-red-500 text-white rounded-[5px] hover:bg-red-600 focus:outline-none"
                            onClick={() => setModal('')}
                        >
                            X
                        </button>

                        <h4 className="text-gray-950">Registro Auditor</h4>
                        <div className='relative flex justify-between w-[300px] text-gray-950'>
                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                                Categoria:
                            </label>
                            <SelectSimple arr={['Con Observación', 'Sin Observacion']} name='Estado de reembolso' click={handlerSelectClick2} defaultValue={value} uuid='123' label='Filtro 1' position='absolute left-0 top-[25px]' bg={`${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`} required />
                        </div>
                        <div className='relative flex justify-between w-[300px] text-gray-950'>

                            <label htmlFor="" className={`mr-5 text-[10px] ${theme === 'light' ? ' text-gray-950' : ' text-gray-950 '} dark:text-black`}>
                                Acotación:
                            </label>
                            <textarea name="" className='text-[10px] p-2 w-[200px] focus:outline-none bg-gray-200 border-[1px] border-gray-300 rounded-[5px]' id=""></textarea>                        </div>


                        <button type="button" class="w-[300px] text-white bg-gradient-to-br from-blue-600 to-blue-400 hover:bg-gradient-to-bl foco-4 focus:outline-none foco-blue-300 dark:foco-blue-800 font-medium rounded-lg text-[10px] px-5 py-1.5 text-center me-2 mb-2" onClick={() => setModal('Registro de cobro')}>Registrar</button>

                    </div>

                </div>
            }
            {
            }
            {modal === 'SMS' && <FormSendSMS />}
            {/* ---------------------------------'COLECCION DE CASOS' --------------------------------- */}

            {modal === 'Asignar Cuenta Cobrador' && <FormAsignarCuenta query='Asesor de Cobranza' cuenta={users} />}
            {modal === 'Registrar Pago' && <FormAddPago />}
            {modal === 'Extension' && <FormAddExtension />}

            {/* Modales para registar Pagos y extensiones */}
            {modal === 'Registro Pago' && <FormPagado />}
            {modal === 'Registro Pago Extension' && <FormPagadoExtension />}


            {modal === 'Registrar Cobor y Blance' && <FormEditCyB />}
            {modal === 'Añadir aplicacion' && <FormAddApplication />}
            {modal === 'Actualizar aplicacion' && <FormUpdateAplication />}
            {modal === 'Eliminar aplicacion' && <ModalDeleteApplication />}
            {modal === 'Registrar Auditoria Tracking' && <FormAddAuditor />}

            {/* ---------------------------------'VERIFICACION DE CREDITOS' --------------------------------- */}


            {modal === 'Restablecer Asesor' && <FormRestablecimiento seccion="verificacion individual" />}
            {modal === 'Restablecer Cuenta' && <FormRestablecimientoCuenta seccion="" />}
            {modal === 'Restablecimiento Masivo' && <FormRestablecimiento seccion="verificacion total" />}
            {modal === 'Realizar Backoup cobro' && <FormRestablecimiento seccion="cobro" />}
            {modal === 'Realizar Backoup verificacion' && <FormRestablecimiento seccion="verificacion" />}
            {modal === 'Restablecimiento Masivo Cuenta' && <FormRestablecimientoCuenta seccion="verificacion total" />}

            {modal === 'Asignar Asesor' && <FormAsignarAsesor />}
            {modal === 'Asignar Cuenta' && <FormAsignarCuenta query="Asesor de Verificación" cuenta="cuentaVerificador" />}
            {modal === 'Asignar Cuenta Auditoria' && <FormAsignarCuentaAuditor />}

            {modal === 'Distribuir Casos' && <FormDistributionCases query='?tipoDeGrupo=Asesor%20de%20Verificación' estadoDeCredito='Dispersado' tipoDeGrupo={user.tipoDeGrupo} />}
            {modal === 'Distribuir Casos Segmento' && <FormDistributtonCasesSegment query='?tipoDeGrupo=Asesor%20de%20Verificación' estadoDeCredito='Dispersado' tipoDeGrupo={user.tipoDeGrupo} />}
            {modal === 'Restablecimiento Masivo Auditoria' && <FormRestablecimientoAuditors seccion="auditoria" />}
            {modal === 'Distribuir Casos Auditoria' && <FormDistributionAuditors query='?tipoDeGrupo=Asesor%20de%20Verificación' estadoDeCredito='Dispersado' tipoDeGrupo={user.tipoDeGrupo} />}
            {modal === 'Registrar Verificacion' && <FormAddVerification />}
            {modal === 'Registrar Cobranza' && <FormAddCobranza />}
            {modal === 'Añadir cuenta masivas' && <FormAddMasiveAccounts />}
            {modal === 'Añadir cuenta' && <FormAddAccount />}
            {modal === 'Añadir cuenta personal' && <FormAddPersonalAccount />}
            {/* ---------------------------------'GESTION DE ACCESOS' --------------------------------- */}

            {modal === 'Administrar cuenta' && <FormAdminAccount />}
            {modal === 'Editar cuenta' && <FormEditAccount />}
            {modal === 'Administrar Asesor' && <FormAdminAsesor />}

            {/* ---------------------------------'GESTION DE ACCESOS' --------------------------------- */}

            {modal === 'Asistencia' && <FormAttendance />}
            {modal === 'Hora de Entrada' && <FormTimeEntry />}
            {/* ---------------------------------'GESTION DE APLICACION' --------------------------------- */}

            {modal === 'Modal Agregar Tipo Aplicaion' && <FormAddTipoApp />}
            {modal === 'Modal Editar Tipo Aplicaion' && <FormUpdateTipoApp />}
            {modal === 'Eliminar tipo aplicacion' && <ModalDeleteTipoApp />}

            {/* ---------------------------------'GESTION DE MULTAS' --------------------------------- */}

            {modal === 'Multar cuenta' && <FormAddMulta />}
            {modal === 'Editar Multar cuenta' && <FormUpdateMulta />}
            {/* ---------------------------------'GESTION DE NEWSLATER' --------------------------------- */}

            {modal === 'Eliminar newslater' && <ModalDeleteNewslater />}
            {/* ---------------------------------'GESTION DE COMISIONES' --------------------------------- */}

            {modal === 'Agregar comision' && <FormAddComision />}
            {modal === 'Agregar comision verificacion' && <FormAddComisionVerificacion />}
            {modal === 'Editar comision verificacion' && <FormUpdateComisionVerification />}
            {modal === 'Editar comision' && <FormUpdateComision />}
            {modal === 'Eliminar comision' && <ModalDeleteComision />}
        </div>
    )
}




