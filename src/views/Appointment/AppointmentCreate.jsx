import React, { useState } from 'react'
import axios from 'axios'
import { CButton, CForm, CFormInput, CFormLabel } from '@coreui/react'

const AppointmentCreate = () => {
    const [appointment, setAppointment] = useState({
        officeId: '',
        doctorId: '',
        patientId: '',
        appointmentDate: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setAppointment({ ...appointment, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:8080/appointments', appointment)
            alert('Cita registrada correctamente')
            setAppointment({ officeId: '', doctorId: '', patientId: '', appointmentDate: '' })
        } catch (err) {
            console.error(err)
            alert('Error al registrar cita')
        }
    }

    return (
        <CForm onSubmit={handleSubmit}>
            <CFormLabel>Office ID</CFormLabel>
            <CFormInput
                type="text"
                name="officeId"
                value={appointment.officeId}
                onChange={handleChange}
                required
            />

            <CFormLabel>Doctor ID</CFormLabel>
            <CFormInput
                type="text"
                name="doctorId"
                value={appointment.doctorId}
                onChange={handleChange}
                required
            />

            <CFormLabel>Patient ID</CFormLabel>
            <CFormInput
                type="text"
                name="patientId"
                value={appointment.patientId}
                onChange={handleChange}
                required
            />

            <CFormLabel>Fecha y hora de la cita</CFormLabel>
            <CFormInput
                type="datetime-local"
                name="appointmentDate"
                value={appointment.appointmentDate}
                onChange={handleChange}
                required
            />

            <CButton type="submit" color="primary" className="mt-3">Guardar cita</CButton>
        </CForm>
    )
}

export default AppointmentCreate
