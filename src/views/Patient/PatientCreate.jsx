import React, { useState, useEffect } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CForm,
    CFormLabel,
    CFormInput,
    CButton,
} from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const PatientForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        email: '',
        phone: '',
    })

    const navigate = useNavigate()
    const { id } = useParams() // Para editar

    useEffect(() => {
        if (id) {
            // Si hay id, cargar datos para editar
            axios
                .get(`http://localhost:8080/patients/${id}`)
                .then((res) => {
                    const patient = res.data
                    setFormData({
                        name: patient.name || '',
                        dob: patient.dob ? patient.dob.slice(0, 10) : '', // formato yyyy-mm-dd
                        email: patient.email || '',
                        phone: patient.phone || '',
                    })
                })
                .catch((err) => {
                    console.error('Error al cargar paciente:', err)
                    alert('No se pudo cargar la información del paciente')
                })
        }
    }, [id])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (id) {
                // Editar paciente
                await axios.put(`http://localhost:8080/patients/${id}`, formData)
                alert('Paciente actualizado correctamente')
            } else {
                // Crear paciente
                await axios.post('http://localhost:8080/patients', formData)
                alert('Paciente creado correctamente')
            }
            navigate('/Patient/lista')
        } catch (error) {
            console.error('Error al guardar paciente:', error)
            alert('Error al guardar paciente')
        }
    }

    return (
        <CCard>
            <CCardHeader>
                <strong>{id ? 'Editar Paciente' : 'Registrar Paciente'}</strong>
            </CCardHeader>
            <CCardBody>
                <CForm onSubmit={handleSubmit}>
                    <CFormLabel>Nombre</CFormLabel>
                    <CFormInput
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <CFormLabel className="mt-3">Fecha de Nacimiento</CFormLabel>
                    <CFormInput
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                    />

                    <CFormLabel className="mt-3">Email</CFormLabel>
                    <CFormInput
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <CFormLabel className="mt-3">Teléfono</CFormLabel>
                    <CFormInput
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />

                    <CButton color="success" type="submit" className="mt-4">
                        {id ? 'Actualizar' : 'Guardar'}
                    </CButton>
                    <CButton
                        color="secondary"
                        className="mt-4 ms-2"
                        onClick={() => navigate('/Patient/lista')}
                    >
                        Cancelar
                    </CButton>
                </CForm>
            </CCardBody>
        </CCard>
    )
}

export default PatientForm
