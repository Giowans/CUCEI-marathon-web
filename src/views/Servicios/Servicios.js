import React, {useState, useEffect} from 'react';
import { Panel, Table, Icon, Notification, IconButton } from 'rsuite';
import Swal from 'sweetalert2';
import './Servicios.css';


import emptyImage from '../../assets/images/empty.png';
//API
import axiosApp from '../../api/axiosApp';

//Context
import { useAuth } from '../../context/auth';

//React-bootstrap
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/esm/Col';
import Form from 'react-bootstrap/Form'

const { Column, HeaderCell, Cell } = Table; 

const renderEmptyComponent = () => {
    return (
      <div style={{ display: 'flex', height: '100%', justifyContent: 'center' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <img
            src={emptyImage}
            style={{ height: 200, width: 200, maxHeight: '90%' }}
            alt='Vacío :('
          />
          <b>No hay información para desplegar.</b>
        </div>
      </div>
    );
  };

const TimerCell = ({getAlumnos, dataKey, ...props}) => {

    const {
        state: { token, id_user },
    } = useAuth();

    const { rowData } = props;

    const [countingDown, setCountingDown ] = useState(0)
    const [counter, setCounter ] = useState({
        h: 0,
        m: 0,
        s: 0,
        full_seconds: 0
    });

    const countingSeconds = () => {
        //verificamos si aun existe el tiempo acumulado en el navegador, sino entonces el contador dejo de contar
        const savedTime = localStorage.getItem(`serviceTime-${rowData.code}`)
        if(countingDown && savedTime)
        {
            let secondPlus = Number(savedTime);
            setCounter({
                h: Math.floor(secondPlus / 3600),
                m: Math.floor(secondPlus % 3600 / 60),
                s: Math.floor(secondPlus % 3600 % 60),
                full_seconds: secondPlus
            })
            localStorage.setItem(`serviceTime-${rowData.code}`, secondPlus);
        }
        else
        {
            resetData('desde contador');
        }
    }

    window.onbeforeunload = () =>{
        if(countingDown)
        {
            localStorage.setItem(`serviceTime-${rowData.code}`, counter.full_seconds);
        }
    }

    const updateStudentServiceTIme = async (studentCode) => {
        await Swal.fire({
            icon: 'info',
            title: 'Confirmación',
            text: 'Confirma el código del alumno en el campo para detener el conteo',
            input: 'text',
            inputAttributes: {
                maxLength: 9
            },
            inputPlaceholder: 'Ingresa el código del alumno',
            confirmButtonText: 'Empezar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#F7FF33',
            cancelButtonColor: 'black',
            inputValidator: (value) => {
                return new Promise(resolve => {
                    if(value === studentCode)
                    {
                        resolve();
                    }
                    else
                    {
                        resolve('El código de la fila no coincide con el ingresado')
                    }
                });
            },
            showCancelButton: true
        }).then(async (result) => {
            if(result.dismiss !== 'cancel')
            {
                await axiosApp.put(
                    `users/update-service/${studentCode}`,
                    {
                        serviceTime: counter.full_seconds,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setCountingDown(false);
                localStorage.removeItem(`serviceTime-${studentCode}`);
                Notification.success({
                    title: '¡Hecho!',
                    description: 'Tiempo de servicio del alumno acumulado exitosamente',
                    duration: 4000
                });
                await getAlumnos('');
            }
        });
    }

    const startCounting = async (code) => {
        await Swal.fire({
            icon: 'info',
            title: 'Confirmación',
            text: 'Confirma el código del alumno en el campo para empezar el conteo',
            input: 'text',
            inputAttributes: {
                maxLength: 9
            },
            inputPlaceholder: 'Ingresa el código del alumno',
            confirmButtonText: 'Empezar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#F7FF33',
            cancelButtonColor: 'black',
            inputValidator: (value) => {
                return new Promise(resolve => {
                    if(value === code)
                    {
                        resolve();
                    }
                    else
                    {
                        resolve('El código de la fila no coincide con el ingresado')
                    }
                });
            },
            showCancelButton: true
        }).then(result => {
            if(result.dismiss !== 'cancel')
            {
                localStorage.setItem(`serviceTime-${code}`, 0);
                setCountingDown(true);
            }
        });
    }
    
    const resetData = (flag) => {
        setCounter({
            h: 0,
            m: 0,
            s: 0,
            full_seconds: 0
        });    
    }
    //Efecto que reanuda el contador cada vez que se filtra a los alumnos
    useEffect(() => {
        const firstData = () => {
          const savedTime = localStorage.getItem(`serviceTime-${rowData.code}`)
          if(savedTime)
          {
              setCountingDown(true);
              resetData('lo random :0');
          }
          else
          {
              setCountingDown(false);
              resetData('primer efecto xd');
          }
        }

        firstData();
    }, [rowData])

    //Efecto que realiza el timer relacionado con el timer padre
    useEffect(() => {
        if(countingDown)
        {
            setTimeout(() => {
                    countingSeconds();
            }, 100);
        }
        else
        {
            resetData('desde efecto otro :0');
        }
    }, [countingDown ? counter : countingDown]);

    return (
        <Cell {...props} dataKey = {dataKey}>
            {
                (rowData, rowIndex) => {
                    if(countingDown)
                    {
                        return (
                          <Container className = 'd-flex flex-row justify-content-center align-items-center' >
                            <span>{counter.h >= 10 ? '' : '0'}{counter.h}:{counter.m >= 10 ? '' : '0'}{counter.m}:{counter.s >= 10 ? '' : '0'}{counter.s}</span>
                            <IconButton className = 'ml-3' size = 'sm' color = 'red' icon = {<Icon icon = 'stop'></Icon>} onClick = { () => updateStudentServiceTIme(rowData.code)}/>
                          </Container>
                        )
                    }
                    else
                    {
                        return (
                            <Container className = 'd-flex flex-row justify-content-center align-items-center' >
                              <span>{counter.h >= 10 ? '' : '0'}{counter.h}:{counter.m >= 10 ? '' : '0'}{counter.m}:{counter.s >= 10 ? '' : '0'}{counter.s}</span>
                              <IconButton className = 'ml-3' size = 'sm' color = 'green' icon = {<Icon icon = 'play'></Icon>} onClick = { () => startCounting(rowData.code)}/>
                            </Container>
                          )
                    }
                }
            }
        </Cell>
    );
}
  

const Servicios = () => {

    const [newData, setNewData] = useState({
        code: '',
        name: '',
        career: 'INNI'
    })
    const [allAlumnos, setAllAlumnos ] = useState([])
    const [alumnos, setAlumnos ] = useState([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    const {
        state: { token, id_user },
    } = useAuth();

    const getAlumnos = async (searchFilter) => {
        try {
            setIsDataLoading(true);
            const response = await axiosApp.get(
                'users/getAlumnos',
                {
                    params: {
                        filter: searchFilter,       
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setAlumnos(response.data);
            if(searchFilter === '')
            {
                setAllAlumnos(response.data);
            }
            setIsDataLoading(false);
        } catch (err) {
            setIsDataLoading(false);
            Swal.fire('Error en el servidor', 'No pudimos obtener los alumnos desde el servidor', 'error');
        }
    }
    //Efecto que acumula los tiempos de los servicios activos cuando estos no estan renderizados por el filtro
    useEffect(() => {
        const paralelUpdateServices = () => {
            allAlumnos.map((element) => {
                const savedTime = localStorage.getItem(`serviceTime-${element.code}`);
                if(savedTime)
                {
                    var secondPlus = Number(savedTime) + 1;
                    localStorage.setItem(`serviceTime-${element.code}`, secondPlus);
                }
            })
        }
        
        const interval = setInterval(() => {
                    paralelUpdateServices();
            }, 1000)
        return () => clearInterval(interval)
    });

    //Efecto solo para traerse los alumnos cuando se renderiza la vista
    useEffect(() => {
        getAlumnos('');
    }, [])

    return (
        <>
            <h1>Servicios</h1>
            <Panel
                collapsible 
                shaded
                header = {<h4>Agregar Alumno</h4>}
                bordered
                className = 'p-1 w-100 mb-3'
                style = {{marginLeft: '20px'}}
            >
                <Form>
                    <Form.Row>
                        <Form.Group as = {Col} controlId = 'studentCode'>
                            <Form.Label className = "font-weight-bold">Código</Form.Label>
                            <Form.Control className = 'input' type="text" maxLength = {9} placeholder="Ingresa el código del alumno" onBlur = {(e) => setNewData({...newData, code: e.target.value})}/>
                        </Form.Group>
                        <Form.Group as = {Col} controlId = 'studentName'>
                            <Form.Label className = "font-weight-bold">Nombre Completo</Form.Label>
                            <Form.Control className = 'input' type="text" placeholder="Ingresa el nombre del alumno" onBlur = {(e) => setNewData({...newData, name: e.target.value})}/>
                        </Form.Group>
                        <Form.Group as = {Col} controlId = 'studentName'>
                            <Form.Label className = "font-weight-bold">Carrera</Form.Label>
                            <Form.Control defaultValue = '' className = 'input' as = 'select' placeholder="Carrera del alumno" onChange = {(e) => setNewData({...newData, career: e.target.value})}>
                                <option>INNI</option>
                                <option>INCO</option>
                                <option>INCE</option>
                                <option>INBI</option>
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Button 
                            className = 'primary ml-2 w-25' 
                            block 
                            onClick = {async () => {
                            try
                            {
                                for(let key of Object.keys(newData))
                                {
                                    if(!newData[key])
                                    {
                                        return Swal.fire('Campos vacíos', 'Asegurate de llenar todos los campos del formulario','question');
                                    }
                                }
                                await axiosApp.post(
                                    '/alumnos/add',
                                    {
                                    ...newData
                                    },
                                    {
                                        headers: {
                                            Authorization: `Bearer ${token}`
                                        }
                                    }
                                );
                                Notification.success({
                                    title: 'Registro exitoso',
                                    description: 'Alumno registrado correctamente',
                                    duration: 5000
                                });
                                await getAlumnos('');
                                setNewData({
                                    code: '',
                                    name: '',
                                    career: 'INNI'
                                })
                            }catch(err)
                            {
                                Notification.error({
                                title: 'Error',
                                description: `Ha ocurrido un error en el servidor: ${err.message}`,
                                duration: 5000
                                })
                            }
                        }}>
                            Añadir Alumno
                        </Button>
                        <Button 
                            className = 'ml-2' 
                            variant = 'dark'
                            onClick = {() => setNewData({
                                code: '',
                                name: '',
                                career: 'INNI'
                            })}
                        >
                            Limpiar
                        </Button>
                    </Form.Row>
                </Form>
            </Panel>
            <Panel
            bodyFill
            bordered
            className='module-canvas'
            style={{width: '100%'}}
            header={
                <div className='custom-module-header'>
                <h3 className = 'text-white'>Alumnos</h3>
                <div className='search-block'>
                    <Form.Control 
                        type="text" 
                        placeholder='Buscar...' 
                        className="mr-sm-2 w-100 input"
                        onChange = {(e) => {
                            getAlumnos(e.target.value)
                        }} 
                    />
                </div>
                </div>
            }
            >
                <Table
                    height={400}
                    className='striped-table clickable-table'
                    bordered
                    loading={isDataLoading}
                    data={alumnos}
                    renderEmpty={isDataLoading ? null : renderEmptyComponent}
                >
                    <Column fixed width={200} align = 'center'>
                        <HeaderCell>Código</HeaderCell>
                        <Cell dataKey = 'code'/>
                    </Column>
                    <Column fixed width={400} align = 'center'>
                        <HeaderCell>Nombre completo</HeaderCell>
                        <Cell dataKey = 'name'/>
                    </Column>
                    <Column  width={150} align = 'center'>
                        <HeaderCell>Carrera</HeaderCell>
                        <Cell dataKey = 'career'/>
                    </Column>
                    <Column  width={300} align = 'center'>
                        <HeaderCell>Horas Acumuladas</HeaderCell>
                        <Cell>
                            { rowData => {
                                const seconds = Number(rowData.service_seconds);
                                return seconds ? `${Math.floor(seconds/3600)} horas con ${Math.floor(seconds % 3600 / 60)} minutos y ${Math.floor(seconds % 3600 % 60)} segundos` : 'Sin Empezar';
                            }}
                        </Cell>
                    </Column>
                    <Column  width={300} align = 'center'>
                        <HeaderCell>Temporizador</HeaderCell>
                        <TimerCell 
                            getAlumnos = {getAlumnos} 
                            dataKey = 'code'
                        />
                    </Column>
                </Table>
            </Panel>
        </>
    );
}

export default Servicios;