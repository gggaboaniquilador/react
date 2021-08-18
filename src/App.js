import React, {useEffect, useState} from 'react';
import './App.css';
import axios from 'axios';
import {makeStyles} from '@material-ui/core/styles';
import {Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Modal, Button, TextField} from '@material-ui/core';
import {Edit, Delete} from '@material-ui/icons';
import Avatar from '@material-ui/core/Avatar';
const baseUrl='https://127.0.0.1:8000/api/pet';

const useStyles = makeStyles((theme)=>({
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  iconos:{
    cursor: 'pointer'
  },
  inputMaterial:{
    width: '100%'
  },
  button:{
    margin: '10px'
  },
  div:{
    margin: '5px'
  }
}));

function App() {
const styles = useStyles();
  const [data, setData]=useState([]);
  const [modalInsertar, setModalInsertar]=useState(false);
  const [modalEditar, setModalEditar]=useState(false);
  const [modalEliminar, setModalEliminar]=useState(false);

  const [petSelect, setPetSelected]=useState({
    name: '',
    type: '',
    photoUrls: ''
  })

  const handleChange=e=>{
    const {name, value}=e.target;
    setPetSelected(prevState=>({
      ...prevState,
      [name]: value,
    }))
  }

  const peticionGet=async()=>{
   await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
      console.log(response.data);
    })
  }

  const peticionPost=async()=>{
    console.log(petSelect);
    await axios.post(baseUrl, petSelect)
    .then(response=>{
      peticionGet();
      abrirCerrarModalInsertar();
      })
  }

  const peticionPut=async()=>{
    await axios.put(baseUrl+'/'+petSelect.id, petSelect)
    .then(response=>{
      peticionGet();
      abrirCerrarModalEditar();
    })
  }

  const peticionDelete=async()=>{
    await axios.delete(baseUrl+'/'+petSelect.id)
    .then(response=>{
      peticionGet();
      abrirCerrarModalEliminar();
    })
  }

  const abrirCerrarModalInsertar=()=>{
    return setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    return setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    return setModalEliminar(!modalEliminar);
  }

  const seleccionarPet=(pet, caso)=>{
    setPetSelected(pet);
    (caso==='Editar')?abrirCerrarModalEditar():abrirCerrarModalEliminar();
  }

  useEffect(async()=>{
    await peticionGet();
  },[])

  const bodyInsertar=(
      <div className={styles.modal}>
      <h3>Agregar Mascota</h3>
      <TextField name="name" className={styles.inputMaterial} label="Nombre" onChange={handleChange}/>
      &nbsp;&nbsp;&nbsp;
      <TextField name="type" className={styles.inputMaterial} label="Tipo" onChange={handleChange}/>
      &nbsp;&nbsp;&nbsp;
      <TextField name="photoUrls" className={styles.inputMaterial} label="Imagen" onChange={handleChange}/>
      &nbsp;&nbsp;&nbsp;
      <div align="right">
        <Button onClick={()=>peticionPost()} color="primary">Insertar</Button>
        <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
      </div>
    )

  const bodyEditar=(
      <div className={styles.modal}>
      <h3>Editar Mascota</h3>
      <TextField name="name" className={styles.inputMaterial} label="Nombre" onChange={handleChange} value={petSelect && petSelect.name}/>
      &nbsp;&nbsp;&nbsp;
      <TextField name="type" className={styles.inputMaterial} label="Tipo" onChange={handleChange} value={petSelect && petSelect.type}/>
      &nbsp;&nbsp;&nbsp;
      <TextField name="photoUrls" className={styles.inputMaterial} label="Imagen" onChange={handleChange} value={petSelect && petSelect.photoUrls}/>
      &nbsp;&nbsp;&nbsp;
      <div align="right">
        <Button onClick={()=>peticionPut()} color="primary">Guardar</Button>
        <Button onClick={()=>abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
      </div>
    )

  const bodyEliminar=(
      <div className={styles.modal}>
      <p>¿Esta seguro que desea eliminar la Mascota  <b>{petSelect && petSelect.name}</b>?</p>
      &nbsp;&nbsp;&nbsp;
      <div align="right">
        <Button onClick={()=>peticionDelete()} color="primary">Sí</Button>
        <Button onClick={()=>abrirCerrarModalEliminar()}>No</Button>
      </div>
      </div>
    )

  return (
    <div className="App">
    <div className={styles.div}></div>
    <Button className={styles.Button} variant="outlined" onClick={()=>abrirCerrarModalInsertar()} >Insertar</Button>
    &nbsp;&nbsp;&nbsp;
    <hr></hr>
      <TableContainer>
        <Table>
          <TableHead>
           <TableRow>
            <TableCell> Nombre </TableCell>
            <TableCell> Tipo </TableCell>
            <TableCell> Imagen </TableCell>
            <TableCell> Acciones </TableCell>
           </TableRow>
          </TableHead>


          <TableBody>
            {data.Pet_Data?.map(pet=>(
              <TableRow key={pet.id}>
                <TableCell>{pet.name}</TableCell>
                <TableCell>{pet.type}</TableCell>
                <TableCell><Avatar src={pet.photoUrls} /></TableCell>
                <TableCell>
                <Edit className={styles.iconos} onClick={()=>seleccionarPet(pet,'Editar')}/>
                &nbsp;&nbsp;&nbsp;
                <Delete className={styles.iconos} onClick={()=>seleccionarPet(pet,'Eliminar')}/>
                </TableCell>
              </TableRow>
              ))}
          </TableBody>


        </Table>
      </TableContainer>

      <Modal
      open={modalInsertar}
      onClose={abrirCerrarModalInsertar}>
        {bodyInsertar}
      </Modal>

      <Modal
      open={modalEditar}
      onClose={abrirCerrarModalEditar}>
        {bodyEditar}
      </Modal>

      <Modal
      open={modalEliminar}
      onClose={abrirCerrarModalEliminar}>
        {bodyEliminar}
      </Modal>

    </div>
  );
}

export default App;
