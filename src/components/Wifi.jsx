'use client'
import React, { useState, useEffect } from 'react';
import { WifiIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/context/ThemeContext';


const WifiStrength = () => {
    const [wifiStrength, setWifiStrength] = useState('Calculando...');
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
      const updateWifiStrength = () => {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (connection && connection.downlink) {
          const mbps = connection.downlink; // La propiedad downlink ya está en Mbps
          setWifiStrength(`${mbps.toFixed(2)} Mbps (${getWifiLabel(mbps)})`);
        } else {
          setWifiStrength('API no soportada o conexión no disponible');
        }
      };
  
      // Ejecutar al montar el componente
      updateWifiStrength();
  
      // Escuchar cambios en la conexión
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        connection.addEventListener('change', updateWifiStrength);
      }
  
      // Limpiar el evento al desmontar
      return () => {
        if (connection) {
          connection.removeEventListener('change', updateWifiStrength);
        }
      };
    }, []);
  
    const getWifiLabel = (mbps) => {
      if (mbps > 5) return 'Excelente';
      if (mbps > 2) return 'Buena';
      return 'Débil';
    };
  
    return (
      <div className="pr-5  rounded-lg text-white flex items-center">
        <WifiIcon className={`h-6 w-6  mr-5 text-[12px] ${theme === 'light' ? 'stroke-black text-black' : 'stroke-black text-white '}   dark:stroke-white`} />
        <div>
          <p className={`text-[12px] ${theme === 'light' ? 'text-black' : ' text-white '} dark:text-white`}>Intensidad del WiFi:{wifiStrength}</p>
        </div>
      </div>
    );
  };
  
  export default WifiStrength;