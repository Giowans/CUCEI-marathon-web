import React, { useState, useEffect } from "react";
import {
  Panel,
  Table,
  Icon,
  Modal,
  IconButton,
  Button as SuitButton,
} from "rsuite";
import Swal from "sweetalert2";
import "./Servicios.css";

import emptyImage from "../../assets/images/empty.png";
//API
import axiosApp from "../../api/axiosApp";

//Context
import { useAuth } from "../../context/auth";

//React-bootstrap
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/esm/Col";
import Form from "react-bootstrap/Form";

const { Column, HeaderCell, Cell } = Table;

const renderEmptyComponent = () => {
  return (
    <div style={{ display: "flex", height: "100%", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <img
          src={emptyImage}
          style={{ height: 200, width: 200, maxHeight: "90%" }}
          alt="Vacío :("
        />
        <b>No hay información para desplegar.</b>
      </div>
    </div>
  );
};

const CustomModal = ({
  isOpen,
  selectedStudentData,
  closeModal,
  updateStudentTry,
  ...props
}) => {
  const { evidence, minutes, meters, idTry, status } = selectedStudentData;
  return (
    <Modal show={isOpen} onHide={closeModal}>
      <Modal.Header>
        <Modal.Title>Detalles del intento</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-center align-items-center flex-column">
        <h4
          style={{ letterSpacing: 5 }}
          className="text-center font-weight-light text-dark"
        >
          TIEMPO REQUERIDO
        </h4>
        <p className="text-center">{`${Math.floor(
          minutes / 60
        )} horas con ${Math.floor(minutes % 60)} minutos`}</p>
        <h4
          style={{ letterSpacing: 5 }}
          className="text-center font-weight-light text-dark"
        >
          DISTANCIA RECORRIDA
        </h4>
        <p className="text-center">{`${
          meters / 1000 === 1
            ? `${meters / 1000} Kilometro`
            : `${meters / 1000} Kilometros`
        }`}</p>
        <h4
          style={{ letterSpacing: 5 }}
          className="text-center font-weight-light text-dark"
        >
          EVIDENCIA
        </h4>
        <img src={evidence} width="80%" height="80%" />
      </Modal.Body>
      <Modal.Footer>
        {status === 1 && (
          <SuitButton
            onClick={() => updateStudentTry && updateStudentTry(idTry, 2)}
            appearance="primary"
            color="green"
          >
            Aprovar
          </SuitButton>
        )}
        {status === 1 && (
          <SuitButton
            onClick={() => updateStudentTry && updateStudentTry(idTry, 3)}
            appearance="primary"
            color="red"
          >
            Declinar
          </SuitButton>
        )}
        <SuitButton onClick={closeModal} appearance="subtle">
          Cerrar
        </SuitButton>
      </Modal.Footer>
    </Modal>
  );
};

const ActionsCell = ({
  showModal,
  dataKey,
  updateStudentTry,
  rowData,
  ...props
}) => {
  return (
    <Cell {...props} dataKey={dataKey}>
      <Container className="d-flex flex-row justify-content-center align-items-center">
        <IconButton
          className="ml-3"
          size="sm"
          color="cyan"
          icon={<Icon icon="eye"></Icon>}
          onClick={(e) => {
            e.stopPropagation();
            showModal && showModal(rowData);
          }}
        />
        {rowData.status === 1 && (
          <IconButton
            className="ml-3"
            size="sm"
            color="green"
            icon={<Icon icon="check"></Icon>}
            onClick={(e) => {
              e.stopPropagation();
              updateStudentTry && updateStudentTry(rowData.idTry, 2);
            }}
          />
        )}
        {rowData.status === 1 && (
          <IconButton
            className="ml-3"
            size="sm"
            color="red"
            icon={<Icon icon="close"></Icon>}
            onClick={(e) => {
              e.stopPropagation();
              updateStudentTry && updateStudentTry(rowData.idTry, 3);
            }}
          />
        )}
      </Container>
    </Cell>
  );
};

const Servicios = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [modalData, setModalData] = useState({
    idTry: "",
    evidence: "",
    meters: 0,
    minutes: 0,
    status: 0,
  });
  const [isMpdalOpen, setIsModalOpen] = useState(false);

  const {
    state: { token, id_user },
  } = useAuth();

  const getAlumnos = async (searchFilter) => {
    try {
      setIsDataLoading(true);
      const response = await axiosApp.get("users/getAlumnos", {
        params: {
          filter: searchFilter,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlumnos(response.data);
      setIsDataLoading(false);
    } catch (err) {
      setIsDataLoading(false);
      Swal.fire(
        "Error en el servidor",
        "No pudimos obtener los alumnos desde el servidor",
        "error"
      );
    }
  };

  const updateStudentTry = async (idTry, status) => {
    await Swal.fire({
      icon: "info",
      title: "Confirmación",
      text: "Los cambios serán irreversibles ¿Desea continuar?",
      confirmButtonText: status === 2 ? "Aprovar intento" : "Declinar intento",
      cancelButtonText: "Cancelar",
      confirmButtonColor: status === 2 ? "#28A745" : "#DC3545",
      cancelButtonColor: "black",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.dismiss !== "cancel") {
        await axiosApp.put(
          `users/update-student-try/${idTry}`,
          {
            status: status,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        await getAlumnos("");
        setIsModalOpen(false);
        setModalData({
          idTry: "",
          evidence: "",
          meters: 0,
          minutes: 0,
          status: 0,
        });
      }
    });
  };

  //Efecto solo para traerse los alumnos cuando se renderiza la vista
  useEffect(() => {
    getAlumnos("");
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center flex-column">
      <CustomModal
        isOpen={isMpdalOpen}
        closeModal={() => {
          setIsModalOpen(false);
          setModalData({
            idTry: "",
            evidence: "",
            meters: 0,
            minutes: 0,
            status: 0,
          });
          getAlumnos();
        }}
        updateStudentTry={updateStudentTry}
        selectedStudentData={modalData}
      />
      <h1
        style={{ letterSpacing: 10 }}
        className="text-white text-uppercase text text-light"
      >
        Intentos registrados
      </h1>
      <Panel
        bodyFill
        bordered
        className="module-canvas"
        style={{ width: "100%" }}
        header={
          <div className="custom-module-header">
            <h3 className="text-white">Alumnos</h3>
            <div className="search-block">
              <Form.Control
                type="text"
                placeholder="Buscar..."
                className="mr-sm-2 w-100 input"
                onChange={(e) => {
                  getAlumnos(e.target.value);
                }}
              />
            </div>
          </div>
        }
      >
        <Table
          height={400}
          className="striped-table clickable-table"
          bordered
          loading={isDataLoading}
          onRowClick={(rowData) => {
            setModalData(rowData);
            setIsModalOpen(true);
          }}
          data={alumnos}
          renderEmpty={isDataLoading ? null : renderEmptyComponent}
        >
          <Column fixed width={200} align="center">
            <HeaderCell>Código</HeaderCell>
            <Cell dataKey="code" />
          </Column>
          <Column fixed width={400} align="center">
            <HeaderCell>Nombre completo</HeaderCell>
            <Cell dataKey="name" />
          </Column>
          <Column width={150} align="center">
            <HeaderCell>Carrera</HeaderCell>
            <Cell dataKey="career" />
          </Column>
          <Column width={300} align="center">
            <HeaderCell>Tiempo requerido</HeaderCell>
            <Cell>
              {(rowData) => {
                const minutes = Number(rowData.minutes);
                return minutes
                  ? `${
                      Math.floor(minutes / 60) !== 1
                        ? `${Math.floor(minutes / 60)} horas`
                        : `${Math.floor(minutes / 60)} hora`
                    } ${
                      Math.floor(minutes % 60) > 0
                        ? `con ${Math.floor(minutes % 60)} minutos`
                        : ""
                    }`
                  : "Sin Empezar";
              }}
            </Cell>
          </Column>
          <Column width={150} align="center">
            <HeaderCell>Distancia recorrida</HeaderCell>
            <Cell>
              {(rowData) => {
                const distanceKM = Number(rowData.meters) / 1000;
                return `${distanceKM} KMS`;
              }}
            </Cell>
          </Column>
          <Column width={150} align="center">
            <HeaderCell>Status</HeaderCell>
            <Cell>
              {(rowData) => {
                switch (rowData.status) {
                  case 1:
                    return (
                      <p
                        style={{ letterSpacing: 5 }}
                        className="text-info text-center"
                      >
                        PENDIENTE
                      </p>
                    );
                  case 2:
                    return (
                      <p
                        style={{ letterSpacing: 5 }}
                        className="text-success text-center"
                      >
                        APROBADO
                      </p>
                    );
                  case 3:
                    return (
                      <p
                        style={{ letterSpacing: 5 }}
                        className="text-danger text-center"
                      >
                        RECHAZADO
                      </p>
                    );
                }
              }}
            </Cell>
          </Column>
          <Column width={200} align="center">
            <HeaderCell>Acciones</HeaderCell>
            <ActionsCell
              updateStudentTry={updateStudentTry}
              showModal={(rowData, e) => {
                e.stopPropagation();
                setModalData(rowData);
                setIsModalOpen(true);
              }}
              dataKey="code"
            />
          </Column>
        </Table>
      </Panel>
    </div>
  );
};

export default Servicios;
