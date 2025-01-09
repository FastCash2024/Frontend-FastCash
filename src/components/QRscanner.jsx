'use client'

import { QrScanner } from '@yudiel/react-qr-scanner';
import { useAppContext } from '@/context/AppContext.js'
import { getSpecificData } from '@/firebase/database'

const Component = () => {
  const { setRecetaDBP, setWebScann, setFilter, setFilterQR, setUserSpecificData} = useAppContext()

  const handlerQR = async (result) => {
    if (result) {
      console.log(result)
      const data = await getSpecificData(`envio/${result}`, setFilterQR)
      setWebScann(false)
    }
  }

  return (
    <QrScanner
      constraints={{
        facingMode: {exact: 'environment'} 
      }}
      onDecode={(result) => handlerQR(result)}
      onError={(error) => console.log(error?.message)}
    />
  );
}
export default Component