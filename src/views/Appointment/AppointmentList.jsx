import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    CButton,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'

const AppointmentList = () => {
    const [appointments, setAppointments] = useState([])

    const fetchAppointments = async () => {
        try {
            const res = await axios.get('http://localhost:8080/appointments')
            setAppointments(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    const deleteAppointment = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar esta cita?')) return
        try {
            await axios.delete(`http://localhost:8080/appointments/${id}`)
            setAppointments(appointments.filter(app => app._id.$oid !== id))
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchAppointments()
    }, [])

    return (
        <CTable>
            <CTableHead>
                <CTableRow>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>Fecha</CTableHeaderCell>
                    <CTableHeaderCell>Paciente</CTableHeaderCell>
                    <CTableHeaderCell>Médico</CTableHeaderCell>
                    <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
                {appointments.map((app) => {
                    const id = app._id?.$oid || 'N/A';
                    const date = app.appointmentDate?.$date ? new Date(app.appointmentDate.$date).toLocaleString() : 'Sin fecha';
                    const doctorName = app.doctor?.fullName || 'Sin doctor';
                    const patientName = app.patient?.name || 'Sin paciente';

                    return (
                        <CTableRow key={id}>
                            <CTableDataCell>{id}</CTableDataCell>
                            <CTableDataCell>{date}</CTableDataCell>
                            <CTableDataCell>{patientName}</CTableDataCell>
                            <CTableDataCell>{doctorName}</CTableDataCell>
                            <CTableDataCell>
                                <CButton color="danger" size="sm" onClick={() => deleteAppointment(id)}>Eliminar</CButton>
                            </CTableDataCell>
                        </CTableRow>
                    )
                })}
            </CTableBody>

        </CTable>
    )
}

export default AppointmentList
