import {useEffect} from 'react'

import {fetchCurrencies} from './api/rates';

function App() {
  useEffect(() => {
    fetchCurrencies().then(res => console.log(res))
  }, [])
  return (
    <>
        <div>
          <h1>Get started</h1>
        </div>
       </>
  )
}

export default App
