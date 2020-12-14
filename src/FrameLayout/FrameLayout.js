import React, {useState, useEffect} from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { FlexboxGrid, Loader } from 'rsuite';
import Navbar from './Navbar/Navbar';
import Drawer from './Drawer/Drawer';
//Vistas
import Login from '../views/Login/Login';
import Servicios from '../views/Servicios/Servicios';


//API
import axios from '../api/axiosApp';

//Contexto
import { useAuth } from '../context/auth';
import './FrameLayout.css'

const FrameLayout = (props) => {

    const {
        state: { token, id_user },
        testToken
    } = useAuth();

    const [isDataLoading, setIsDataLoading] = useState(true);
    const [drawerIsShowed, setDrawerIsShowed] = useState(false);

    useEffect(() => {
      /**
       * Check if token exist. If exist verify with API
       */
      const checkToken = async () => {
        const localToken = localStorage.getItem('token');
        if (localToken) {
          await testToken(localToken);
        }
        setIsDataLoading(false);
      };
  
      checkToken();
    }, []);

      if (isDataLoading) {
        return (
          <FlexboxGrid justify='center' align='middle' className='page-container' style = {{width: '100vw', height: '100vh', backgroundColor: '#E9DB66'}}>
            <Loader style = {{color: 'white'}} content={<b className = 'color-white'>Cargando...</b>} size='lg' />
          </FlexboxGrid>
        );
      }
return (
    <Router>
        { token && <Navbar openDrawer = {() => setDrawerIsShowed(true)} {...props} />}
        { token && <Drawer closeDrawer = {() => setDrawerIsShowed(false)} isShowed = {drawerIsShowed} {...props}/>}
        <div className = {token && 'wrapper-container'}>
          {token && <Route path = '/servicio' component = {Servicios}/>}
          <Route exact = {true} path = '/' component = {Login}/>
          <Route path = '/login' component = {Login}/>
        </div>
    </Router>
    );
}

export default FrameLayout;