import React, { useState, useEffect } from "react";
import Banner from "../../assets/images/marathon_logo.png";
import Swal from "sweetalert2";
import { Notification } from "rsuite";
import Particles from "react-particles-js";
//Context
import { useAuth } from "../../context/auth";
import "./Login.css";

//API
import axios from "../../api/axiosApp";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Col from "react-bootstrap/esm/Col";
import Image from "react-bootstrap/Image";

const Login = (props) => {
  const { history } = props;
  //Usando el Contexto
  const {
    signin,
    state: { token, id_user },
  } = useAuth();

  //Variables de estado
  const [formType, setFormType] = useState("login");
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const loggeoExitoso = async () => {
    try {
      history.push("/servicio");
    } catch (err) {
      console.log(err);
    }
  };

  const loggeoErroneo = () => {
    Swal.fire("Error en el servidor", `Credenciales Inválidas`, "error");
  };

  useEffect(() => {
    /**
     * Si existe el token, entonces el usuario inició sesión
     */
    const tokensito = localStorage.getItem("token");
    if (tokensito) {
      history.push("/servicio");
    }
  }, [token]);

  return (
    <div className="main-container">
      <Particles
        style={{ backgroundColor: "#1E202F" }}
        params={{
          particles: {
            number: {
              value: 6,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: "#15274C",
            },
            shape: {
              type: "triangle",
              stroke: {
                width: 0,
                color: "#000",
              },
              polygon: {
                nb_sides: 6,
              },
              image: {
                src: "img/github.svg",
                width: 100,
                height: 100,
              },
            },
            opacity: {
              value: 0.7,
              random: true,
              anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.3,
                sync: false,
              },
            },
            size: {
              value: 160,
              random: false,
              anim: {
                enable: true,
                speed: 10,
                size_min: 40,
                sync: false,
              },
            },
            line_linked: {
              enable: false,
              distance: 200,
              color: "#ffffff",
              opacity: 1,
              width: 2,
            },
            move: {
              enable: true,
              speed: 8,
              direction: "none",
              random: false,
              straight: false,
              out_mode: "out",
              bounce: false,
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200,
              },
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: {
                enable: false,
                mode: "grab",
              },
              onclick: {
                enable: false,
                mode: "push",
              },
              resize: true,
            },
            modes: {
              grab: {
                distance: 400,
                line_linked: {
                  opacity: 1,
                },
              },
              bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
              push: {
                particles_nb: 4,
              },
              remove: {
                particles_nb: 2,
              },
            },
          },
          retina_detect: true,
        }}
      />
      <div className="banner-container">
        <div>
          <Image src={Banner} width={350} height={190} />
        </div>
      </div>
      <div
        className="login-container"
        style={
          formType === "login"
            ? { left: "30vw" }
            : { left: "30vw", top: "35vh" }
        }
      >
        <h3
          className="text-center text-white text-uppercase text-light"
          style={{ letterSpacing: 12 }}
        >
          {formType === "login" ? "Inicia Sesión" : "Registrate"}
        </h3>
        <Form>
          {formType !== "login" && (
            <Form.Row>
              <Form.Group as={Col} controlId="formBasicEmail">
                <Form.Label className="font-weight-bold text-white">
                  Nombre Completo
                </Form.Label>
                <Form.Control
                  className="input"
                  type="text"
                  placeholder="Ingresa tu nombre"
                  onBlur={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                />
              </Form.Group>
            </Form.Row>
          )}
          <Form.Row>
            <Form.Group as={Col} controlId="formBasicEmail">
              <Form.Label className="font-weight-bold text-white">
                Correo Electrónico
              </Form.Label>
              <Form.Control
                className="input"
                type="email"
                placeholder="Ingresa tu email"
                onBlur={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId="formBasicPassword">
              <Form.Label className="font-weight-bold text-white">
                Contraseña
              </Form.Label>
              <Form.Control
                className="input"
                type="password"
                placeholder="Ingresa tu contraseña"
                onBlur={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
              />
            </Form.Group>
            {formType !== "login" && (
              <Form.Group as={Col} controlId="formBasicPassword">
                <Form.Label className="font-weight-bold text-white">
                  Confirmar contraseña
                </Form.Label>
                <Form.Control
                  className="input"
                  type="password"
                  placeholder="Nuevamente..."
                  onBlur={(e) =>
                    setUserData({
                      ...userData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </Form.Group>
            )}
          </Form.Row>
          <ButtonToolbar className="justify-content-around">
            <Button
              variant="info"
              block
              onClick={() => {
                if (formType === "login") {
                  signin({
                    email: userData.email,
                    password: userData.password,
                    onSuccess: loggeoExitoso,
                    onError: loggeoErroneo,
                  });
                } else {
                  setFormType("login");
                }
              }}
            >
              {formType === "login" ? "Entrar" : "Ya tengo cuenta"}
            </Button>
            <Button
              variant="outline-info"
              block
              onClick={async () => {
                if (formType === "signin") {
                  try {
                    for (const key in userData) {
                      if (!userData[key]) {
                        return Swal.fire(
                          "Campos vacíos",
                          "Todos los campos son requeridos para el registro",
                          "error"
                        );
                      }
                    }
                    if (userData.password === userData.confirmPassword) {
                      await axios.post("/users/signup", {
                        ...userData,
                      });
                      Notification.success({
                        title: "Registro exitoso",
                        description:
                          "¡Ya puedes iniciar sesión! y no olvides checar tu correo ;)",
                        duration: 5000,
                      });
                    } else {
                      Swal.fire(
                        "Contraseñas...",
                        "Las contraseñas no coinciden",
                        "question"
                      );
                    }
                  } catch (err) {
                    Notification.error({
                      title: "Error",
                      description: `Ha ocurrido un error en el servidor: ${err.message}`,
                      duration: 5000,
                    });
                  }
                } else {
                  setFormType("signin");
                }
              }}
            >
              {formType === "login" ? "Quiero registrarme" : "Registrarme"}
            </Button>
          </ButtonToolbar>
        </Form>
      </div>
    </div>
  );
};

export default Login;
