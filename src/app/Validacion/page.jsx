'use client'
import React, { useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Input from '@/components/Input'
import InputPass from '@/components/InputPass'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import { useAppContext } from '@/context/AppContext'
import { menuArray } from '@/constants'

import Link from 'next/link';

import ReCAPTCHA from "react-google-recaptcha";



export default function Home() {
  // const { user, userDB, setUserProfile, setUserSuccess, success, setUser, postsIMG, setUserPostsIMG, sound1, sound2, setSound1, setSound2, } = useAppContext()
  const { user, setUser, userDB } = useAppContext()

  const [isDisable, setIsDisable] = useState(false)
  const [captcha, setCaptcha] = useState('')
  const router = useRouter()



  const recaptchaRef = React.useRef();

  const onSubmitWithReCAPTCHA = async (e) => {
    e.preventDefault()
    if (e.target[0].value === 'UserVe001' ||
      e.target[0].value === 'UserCo001' ||
      e.target[0].value === 'UserAu001' ||
      e.target[0].value === 'ManaVe001' ||
      e.target[0].value === 'ManaCo001' ||
      e.target[0].value === 'ManaAu001' ||
      e.target[0].value === 'Admin001' ||
      e.target[0].value === 'RH001' ||
      e.target[0].value === 'SuperAdmin001'
    ) {
      setUser({ rol: e.target[0].value })

      switch (e.target[0].value) {
        case 'UserVe001':
          router.push(`/Home?seccion=${menuArray['Usuario de Verificación'][0].hash}&item=${menuArray['Usuario de Verificación'][0].options[0].subtitle}`)
          break;
        case 'UserCo001':
          setUser({ rol: 'Usuario de Cobranza' })
          router.push(`/Home?seccion=${menuArray['Usuario de Cobranza'][0].hash}&item=${menuArray['Usuario de Cobranza'][0].options[0].subtitle}`)
          break;
        case 'UserAu001':
          setUser({ rol: 'Usuario de Auditoria' })
          router.push(`/Home?seccion=${menuArray['Usuario de Auditoria'][0].hash}&item=${menuArray['Usuario de Auditoria'][0].options[0].subtitle}`)
          break;
        case 'ManaVe001':
          setUser({ rol: 'Manager de Verificación' })
          router.push(`/Home?seccion=${menuArray['Manager de Verificación'][0].hash}&item=${menuArray['Manager de Verificación'][0].options[0].subtitle}`)
          break;
        case 'ManaCo001':
          setUser({ rol: 'Manager de Cobranza' })
          router.push(`/Home?seccion=${menuArray['Manager de Cobranza'][0].hash}&item=${menuArray['Manager de Cobranza'][0].options[0].subtitle}`)
          break;
        case 'ManaAu001':
          setUser({ rol: 'Manager de Auditoria' })
          router.push(`/Home?seccion=${menuArray['Manager de Auditoria'][0].hash}&item=${menuArray['Manager de Auditoria'][0].options[0].subtitle}`)
          break;
        case 'Admin001':
          setUser({ rol: 'Admin' })
          router.push(`/Home?seccion=${menuArray['Admin'][0].hash}&item=${menuArray['Admin'][0].options[0].subtitle}`)
          break;
        case 'RH001':
          setUser({ rol: 'Recursos Humanos' })
          router.push(`/Home?seccion=${menuArray['Recursos Humanos'][0].hash}&item=${menuArray['Recursos Humanos'][0].options[0].subtitle}`)
          break;
        case 'SuperAdmin001':
          setUser({ rol: 'Super Admin' })
          router.push(`/Home?seccion=${menuArray['Super Admin'][0].hash}&item=${menuArray['Super Admin'][0].options[0].subtitle}`)
          break;
        default:
          // console.log(`Sorry, we are out of ${expr}.`);
      }

    } else {

    }

    // captcha.length > 10 && router.push('/Home?seccion=coleccion&item=Casos%20de%20Cobranza')
  }






  // console.log(user)

  const signInHandler = async (e) => {

    router.push('/Home')
    return
    e.preventDefault()

    let email = e.target[0].value
    let password = e.target[1].value

    if (email.length == 0 || password.length == 0) {
      setUserSuccess('Complete')
      return setTimeout(() => { setIsDisable(false) }, 6000)
    }
    // if (email.length < 10 || password.length < 7) {
    //   setUserSuccess('PasswordMin')
    //   return setTimeout(() => { setIsDisable(false) }, 6000)
    // }
    signInWithEmail(email, password, setUserProfile)
  }
  function onChange(value) {
    setCaptcha(value);
  }
  return (
    <div className='relative w-screen h-screen flex flex-col justify-center items-center p-5  bg-gradient-to-t md:bg-gradient-to-tl from-gray-900 from-50% to-gray-200 to-50%'>
      {/* <img src="bg.jpg" className='fixed top-0 left-0 h-screen w-screen object-cover' alt="" /> */}
      {/*  <div className='fixed top-0 left-0 h-screen w-screen bg-[#00000052] z-20'></div> */}
      <span className='absolute top-[20px] left-[30px] z-30 text-[60px] bg-gradient-to-r from-blue-400 from-50%  to-orange-400 to-50% bg-clip-text text-transparent'  > Fast Cash</span>
      <img src="bg2.jpg" className='fixed top-0 left-0 h-screen w-screen object-cover' alt="" />
      <div className='fixed top-0 left-0 h-screen w-screen bg-[#131920da] ] z-20'></div>
      {/* <img src="/bg-top.png" className='absolute top-0 right-0 h-[30vh] z-20' alt="" />
      <img src="/bg-bottom.png" className='absolute bottom-0 left-0 h-[40vh] z-20' alt="" /> */}
      {/* <img src="bg.jpg" className='fixed top-0 left-0 h-[50vh] w-screen object-cover' alt="" />
     <div className='fixed top-0 left-0 h-[50vh] w-screen bg-[#000000b6] z-20'></div> */}
      {/* <div className='absolute bottom-0 bg-gray-900 h-[50%] w-full overflow-hidden'>
     

      </div> */}
      <form className={`relative w-full max-w-[400px] space-y-3 shadow-2xl  bg-[#39444e80] rounded-[10px] px-5 py-8 z-[50]`} onSubmit={onSubmitWithReCAPTCHA} >
        {/* <form className={`w-full max-w-[450px] space-y-4 border-[1px] border-white shadow-2xl shadow-white px-5 py-10`} onSubmit={!isDisable ? signInHandler : (e) => e.preventDefault()} > */}
        <img src="user.svg" className='relative right-0 left-0  mx-auto h-[100px] w-[100px] ' alt="" />

        <h5 className="text-[20px] text-center text-gray-50" >Login</h5>
        <div >
          <label htmlFor="email" className="block mb-2 text-[14px] text-left font-medium text-gray-50">Nombre</label>
          <Input type="text" name="user" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-[14px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    " placeholder="User123" />
        </div>
        <div >
          <label htmlFor="email" className="block mb-2 text-[14px] text-left font-medium text-gray-50">Email</label>
          <Input type="text" name="user" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-[14px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    " placeholder="User123" />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 text-[14px] text-left  font-medium text-gray-50">Contraseña</label>
          <InputPass type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-[14px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    " />
        </div>
        <div >
          <label htmlFor="cod" className="block mb-2 text-[14px] text-left font-medium text-gray-50">Codigo de Validación</label>
          <Input type="text" name="user" id="cod" className="bg-gray-50 border border-gray-300 text-gray-900 text-[14px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    " placeholder="1234" />
        </div>

        <div className="flex items-start">
          <Link href='#' className="ml-auto  text-[14px] text-gray-400 underline cursor-pointer">Solicitar Codigo de validacion</Link>
        </div>
        {/* <div className='w-full flex justify-center'>
          <ReCAPTCHA
            sitekey="6LdcOwwqAAAAAPEqYv1NDkUpgJRRSaEna_ER9YTT"
            onChange={onChange}
          />
        </div> */}
        <Button type="submit" theme="Primary">Iniciar Sesión</Button>
        {/* <div className="text-[14px] text-center font-medium text-gray-50 underline cursor-pointer">Solicitar Codigo de validacion<Link href="#" className="text-gray-400 underline"></Link ></div> */}
      </form>
    </div>
  )
}
