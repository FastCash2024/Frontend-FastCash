"use client";
import React, {useState, useEffect} from "react";
import Head from "next/head";
import Script from "next/script";
import InputHeight from "@/components/InputHeight";
import InputPass from "@/components/InputPass";
import {useRouter} from "next/navigation";
import Button from "@/components/Button";
import {useAppContext} from "@/context/AppContext";
import {menuArray} from "@/constants";
import {toast} from "react-hot-toast";
import axios from "axios";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import Alert from "@/components/Alert"; // Importar el componente Alert
import { postTracking } from "@/app/service/TrackingApi/tracking.service";
import { obtenerFechaMexicoISO } from "@/utils/getDates";

export default function Home() {
  const {user, setUser, userDB, setUserDB, theme, setTheme} = useAppContext();
  const [isDisable, setIsDisable] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [errorMessage, setErrorMessage] = useState(null); // Estado para el mensaje de error
  const router = useRouter();
  const recaptchaRef = React.useRef();

  const onSubmitWithReCAPTCHA = async (e) => {
    e.preventDefault();
    try {
        let email = e.target[0].value;
        let password = e.target[1].value;

        const response = await axios.post(
            window?.location?.href.includes("localhost")
                ? "http://localhost:3002/api/authSystem/loginPersonal"
                : "https://api.fastcash-mx.com/api/authSystem/loginPersonal",
            { email, password }
        );

        if (response.status === 200) {
            console.log("Login exitoso:", response.data.user);

            // Guardar datos del usuario
            setUser({ rol: response.data.user.codificacionDeRoles });
            setUserDB(response.data.user);

            // Guardar el JWT en sessionStorage
            sessionStorage.setItem("token", response.data.token);

            const trackingData = {
                descripcionDeExcepcion: "Inicio de sesión exitoso",
                cuentaOperadora: email,
                cuentaPersonal: email,
                codigoDeSistema: "Sistema FastCash",
                codigoDeOperacion: "LOGIN_PERSONAL_SUCCESS",
                contenidoDeOperacion: `El usuario ${email} inició sesión correctamente.`,
                fechaDeOperacion: obtenerFechaMexicoISO()
            };

            await postTracking(trackingData);

            // Redirigir al usuario
            router.push("/Account");
        }
    } catch (error) {
        console.error("Error en login personal:", error);

        const trackingData = {
            descripcionDeExcepcion: error.response?.data?.message || "Error desconocido al iniciar sesión",
            cuentaOperadora: email, 
            cuentaPersonal: email,
            codigoDeSistema: "Sistema FastCash",
            codigoDeOperacion: "LOGIN_PERSONAL_FAILED",
            contenidoDeOperacion: `El usuario ${email} con la contraseña ${password} intentó ingresar con las credenciales proporcionadas.`,
            fechaDeOperacion: obtenerFechaMexicoISO()
        };

        await postTracking(trackingData);

        // Mostrar error
        setErrorMessage(error.response?.data?.message || "Login failed");
        toast.error(error.response?.data?.message || "Login failed");
    }
};


  // console.log(userDB)

  function onChange(value) {
    setCaptcha(value);
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.add(savedTheme);
  }, []);

  return (
    <div className="relative w-screen h-screen flex flex-col justify-center items-center p-5  bg-gradient-to-t md:bg-gradient-to-tl from-gray-900 from-50% to-gray-200 to-50%">
      {errorMessage && (
        <Alert type="error" onClose={() => setErrorMessage(null)}>
          <span className="text-black">{errorMessage}</span>
        </Alert>
      )}

      <img
        src="bg2.jpg"
        className="fixed top-0 left-0 h-screen w-screen object-cover"
        alt=""
      />
      <div className="fixed top-0 left-0 h-screen w-screen bg-[#131920da] z-20"></div>
      <span className="absolute top-[20px] left-[30px] z-30 text-[60px] bg-gradient-to-r from-blue-400 from-50%  to-orange-400 to-50% bg-clip-text text-transparent">
        {" "}
        Fast Cash
      </span>
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

      <form
        className={`relative w-full max-w-[400px] space-y-3 shadow-2xl  bg-[#39444e80] rounded-[10px] px-5 py-8 z-50`}
        onSubmit={onSubmitWithReCAPTCHA}
      >
        {/* <form className={`w-full max-w-[450px] space-y-4 border-[1px] border-white shadow-2xl shadow-white px-5 py-10`} onSubmit={!isDisable ? signInHandler : (e) => e.preventDefault()} > */}
        <img
          src="user.svg"
          className="relative right-0 left-0  mx-auto h-[100px] w-[100px] "
          alt=""
        />

        <h5 className="text-[20px] text-center text-gray-50">Login</h5>
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-[14px] text-left font-medium text-gray-50"
          >
            User
          </label>
          <InputHeight
            type="text"
            name="user"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-[14px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
            placeholder="User123"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-[14px] text-left  font-medium text-gray-50"
          >
            Contraseña
          </label>
          <InputPass
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-[14px] rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5    "
          />
        </div>

        <div className="w-full flex justify-center">
          <ReCAPTCHA
            sitekey="6LdcOwwqAAAAAPEqYv1NDkUpgJRRSaEna_ER9YTT"
            onChange={onChange}
          />
        </div>
        <Button type="submit" theme="Primary">
          Iniciar Sesión
        </Button>
      </form>
    </div>
  );
}
