import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import  NavbarLogo from '../../assets/images/UdeG.png';
import { Avatar, Icon } from 'rsuite';
//Contexto
import { useAuth } from '../../context/auth';
import './Navbar.css'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/esm/Dropdown';
import Container from 'react-bootstrap/Container';

const CustomNavbar = ({...props}) =>{

    const {
        state: { token, id_user, name, email },
        logout
    } = useAuth();

    
    const {
        history,
        openDrawer
    } = props;
    
    return (
        <Navbar sticky = 'top' style = {{backgroundColor: '#E9DB66',minHeight: '60px'}} className = 'pt-0 pb-0'>
            <Navbar.Brand>
            <img
                alt=""
                src={ NavbarLogo }
                width="120"
                height="60"
                className="d-inline-block align-top"
            />{' '}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav" className = "d-flex justify-content-end">
                <Nav className = 'navbar-user'>
                    {token &&
                        <Container onClick = {() => openDrawer()}>
                            <Avatar circle style = {{background: 'black'}}>
                                <Icon icon = 'user'/>
                            </Avatar>
                            <h3 className = 'ml-3'>{name}</h3>
                        </Container>
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default withRouter(CustomNavbar);