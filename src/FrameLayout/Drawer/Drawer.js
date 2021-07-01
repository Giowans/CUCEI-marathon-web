import React from "react";
import { withRouter } from "react-router-dom";
import { Drawer, Avatar, Icon } from "rsuite";
import "./Drawer.css";
import Swal from "sweetalert2";
//Contexto
import { useAuth } from "../../context/auth";
//API
import axiosApp from "../../api/axiosApp";
//Bootstrap
import Button from "react-bootstrap/Button";

const CustomDrawer = ({ ...props }) => {
  const { history } = props;
  const {
    state: { id_user, name, email, token },
    logout,
  } = useAuth();

  const { isShowed, closeDrawer } = props;

  return (
    <>
      <Drawer backdrop="static" show={isShowed} onHide={closeDrawer}>
        <Drawer.Header>
          <Drawer.Title style={{ color: "white" }}>
            Bienvenido/a {name}
          </Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="centered-container">
          <div className="user-info">
            <Avatar className="avatar-image">
              <Icon className="icon-maxised" icon="user-circle"></Icon>
            </Avatar>
            <h3 className="text-white">{name}</h3>
            <h4 className="text-white text-light">{email}</h4>
          </div>
        </Drawer.Body>
        <Drawer.Footer className="centered-container">
          <Button
            onClick={async () => {
              try {
                const response = await axiosApp.get("users/getAlumnos", {
                  params: {
                    filter: "",
                  },
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
                response.data.map((element) => {
                  const savedTime = localStorage.getItem(
                    `serviceTime-${element.code}`
                  );
                  if (savedTime) {
                    localStorage.removeItem(`serviceTime-${element.code}`);
                  }
                });
                logout(() => history.push("/login"));
                closeDrawer();
              } catch (err) {
                Swal.fire(
                  "Error en el servidor",
                  "No pudimos obtener los alumnos desde el servidor",
                  "error"
                );
              }
            }}
            variant="dark"
          >
            Cerrar Sesión
          </Button>
        </Drawer.Footer>
      </Drawer>
    </>
  );
};

export default withRouter(CustomDrawer);
