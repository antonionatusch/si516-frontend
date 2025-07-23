import React, { useEffect, useState } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CButton,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const PatientList = () => {
    const [patients, setPatients] = useState([])
    const navigate = useNavigate()

    // Cargar pacientes desde backend
    const fetchPatients = async () => {
        try {
            const res = await axios.get('http://localhost:8080/patients')
            setPatients(res.data)
        } catch (error) {
            console.error('Error cargando pacientes:', error)
            alert('No se pudo cargar la lista de pacientes')
        }
    }

    useEffect(() => {
        fetchPatients()
    }, [])

    // Función para eliminar paciente
    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este paciente?')) {
            try {
                await axios.delete(`http://localhost:8080/patients/${id}`)
                alert('Paciente eliminado')
                fetchPatients() // refrescar lista
            } catch (error) {
                console.error('Error eliminando paciente:', error)
                alert('Error al eliminar paciente')
            }
        }
    }

    return (
        <CCard>
            <CCardHeader>
                <strong>Lista de Pacientes</strong>
                <CButton
                    color="primary"
                    className="float-end"
                    onClick={() => navigate('/Patient/registrar')}
                >
                    Nuevo Paciente
                </CButton>
            </CCardHeader>
            <CCardBody>
                <CTable hover responsive>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>ID</CTableHeaderCell>
                            <CTableHeaderCell>Nombre</CTableHeaderCell>
                            <CTableHeaderCell>Fecha de Nacimiento</CTableHeaderCell>
                            <CTableHeaderCell>Email</CTableHeaderCell>
                            <CTableHeaderCell>Teléfono</CTableHeaderCell>
                            <CTableHeaderCell>Acciones</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {patients.length > 0 ? (
                            patients.map((patient) => (
                                <CTableRow key={patient.id}>
                                    <CTableDataCell>{patient.id}</CTableDataCell>
                                    <CTableDataCell>{patient.name}</CTableDataCell>
                                    <CTableDataCell>
                                        {patient.dob ? patient.dob.slice(0, 10) : ''}
                                    </CTableDataCell>
                                    <CTableDataCell>{patient.email}</CTableDataCell>
                                    <CTableDataCell>{patient.phone}</CTableDataCell>
                                    <CTableDataCell>
                                        <CButton
                                            color="warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => navigate(`/Patient/editar/${patient.id}`)}
                                        >
                                            Editar
                                        </CButton>
                                        <CButton
                                            color="danger"
                                            size="sm"
                                            onClick={() => handleDelete(patient.id)}
                                        >
                                            Eliminar
                                        </CButton>
                                    </CTableDataCell>
                                </CTableRow>
                            ))
                        ) : (
                            <CTableRow>
                                <CTableDataCell colSpan={6} className="text-center">
                                    No hay pacientes registrados
                                </CTableDataCell>
                            </CTableRow>
                        )}
                    </CTableBody>
                </CTable>
            </CCardBody>
        </CCard>
    )
}

export default PatientList
