'use client'
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import InputHeight from '@/components/InputHeight'
import InputPass from '@/components/InputPass'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import { useAppContext } from '@/context/AppContext'
import { menuArray } from '@/constants'
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Alert from '@/components/Alert';
import Link from 'next/link';

import ReCAPTCHA from "react-google-recaptcha";
import { postTracking } from '../service/TrackingApi/tracking.service';
import { obtenerFechaMexicoISO } from '@/utils/getDates';



export default function Home() {
  // const { user, userDB, setUserProfile, setUserSuccess, success, setUser, postsIMG, setUserPostsIMG, sound1, sound2, setSound1, setSound2, } = useAppContext()
  const { user, setUser, userDB, setUserDB, theme, setTheme } = useAppContext()
  const [isDisable, setIsDisable] = useState(false)
  const [captcha, setCaptcha] = useState('')
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState(null);



  
  const onSubmitWithReCAPTCHA = async (e) => {
    e.preventDefault();
    console.log("Login");
  
    if (captcha.length < 10 && !window?.location?.href.includes("localhost")) {
      setErrorMessage("Por favor, verifica el captcha");
      return;
    }
  
    try {
      let cuenta = e.target[0].value;
      let password = e.target[1].value;
      const response = await axios.post(
        window?.location?.href.includes("localhost")
          ? "http://localhost:3002/api/authSystem/login"
          : "https://api.fastcash-mx.com/api/authSystem/login",
        {
          cuenta,
          password,
        }
      );
  
      if (response.status === 200) {
        console.log("response.data.user", response.data.user);
        setUser({ rol: response.data.user.tipoDeGrupo });
        setUserDB(response.data.user);
  
        // 🔹 Guardar el JWT en sessionStorage
        sessionStorage.setItem("token", response.data.token);

        const trackingData = {
          descripcionDeExcepcion: "Inicio de sesión exitoso",
          cuentaOperadora: response.data.user.cuenta,
          cuentaPersonal: response.data.user.emailPersonal,
          codigoDeSistema: "Sistema FastCash",
          codigoDeOperacion: "LOGIN_SUCCESS",
          contenidoDeOperacion: `El usuario ${response.data.user.cuenta} inició sesión correctamente.`,
          fechaDeOperacion: obtenerFechaMexicoISO(),
        };
  
        await postTracking(trackingData);
        router.push("/Home");
      }
    } catch (error) {
      const trackingData = {
        descripcionDeExcepcion:
          error.response?.data?.message || "Error desconocido al iniciar sesión",
        cuentaOperadora: e.target[0].value,
        cuentaPersonal: "No disponible",
        codigoDeSistema: "Sistema FastCash",
        codigoDeOperacion: "LOGIN_FAILED",
        contenidoDeOperacion: `El usuario ${e.target[0].value} con la contraseña ${e.target[1].value} intentó ingresar al sistema con las credenciales proporcionadas.`,
        fechaDeOperacion: obtenerFechaMexicoISO(),
      };
      await postTracking(trackingData);
      setErrorMessage(error.response?.data?.message || "Error al iniciar sesión");
    }
  };
  

  function onChange(value) {
    setCaptcha(value);
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.add(savedTheme);
  }, []);

  return (
    <div className='relative w-screen h-screen flex flex-col justify-center items-center p-5  bg-gradient-to-t md:bg-gradient-to-tl from-gray-900 from-50% to-gray-200 to-50%'>
      {errorMessage && <Alert type="error" onClose={() => setErrorMessage(null)}><span className="text-black">{errorMessage}</span></Alert>}
      <img src="bg2.jpg" className='fixed top-0 left-0 h-screen w-screen object-cover' alt="" />
      <div className='fixed top-0 left-0 h-screen w-screen bg-[#131920da] z-20'></div>
      <span className='absolute top-[20px] left-[30px] z-30 text-[60px] bg-gradient-to-r from-blue-400 from-50%  to-orange-400 to-50% bg-clip-text text-transparent'  > Fast Cash</span>
      {/* Botones de navegación arriba del formulario */}
      <div className="absolute top-[120px] z-50 flex space-x-2 text-white">
        <Link href="/" className="hover:underline">
          Cuenta Empresarial
        </Link>
        <span>/</span>
        <Link href="/PersonalAccount" className="hover:underline">
          Cuenta Personal
        </Link>
      </div>
      <form className={`relative w-full max-w-[400px] space-y-3 shadow-2xl  bg-[#39444e80] rounded-[10px] px-5 py-8 z-50`} onSubmit={onSubmitWithReCAPTCHA} >
        {/* <form className={`w-full max-w-[450px] space-y-4 border-[1px] border-white shadow-2xl shadow-white px-5 py-10`} onSubmit={!isDisable ? signInHandler : (e) => e.preventDefault()} > */}
        <img src="user.svg" className='relative right-0 left-0  mx-auto h-[100px] w-[100px] ' alt="" />

        <h5 className="text-[20px] text-center text-gray-50" >Login</h5>
        <div >
          <label htmlFor="email" className="block mb-2 text-[14px] text-left font-medium text-gray-50">User</label>
          <InputHeight type="text" name="user" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-[14px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    " placeholder="User123" />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 text-[14px] text-left  font-medium text-gray-50">Contraseña</label>
          <InputPass type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-[14px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    " />
        </div>

        <div className='w-full flex justify-center'>
          <ReCAPTCHA
            sitekey="6LeTEAArAAAAAMiYFI19mZMvCF_gmO6nH4I4pM8f"
            onChange={onChange}
          />
        </div>
        <Button type="submit" theme="Primary">Iniciar Sesión</Button>
      </form>
    </div>
  )
}
