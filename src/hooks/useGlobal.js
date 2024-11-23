import { useContext } from 'react';
import GlobalContext from '../contexts/GlobalContext';
const useGlobal = () => useContext(GlobalContext);

export default useGlobal;