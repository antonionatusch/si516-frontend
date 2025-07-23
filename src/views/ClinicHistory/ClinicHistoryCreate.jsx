import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CRow,
  CCol,
  CFormTextarea,
} from '@coreui/react'
import axios from 'axios'

const ClinicHistoryCreate = () => {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    visitReason: '',
    diagnosis: '',
    symptoms: '',
    treatment: '',
    pickup: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Convertir symptoms a array (como antes)
      const symptomsArray = formData.symptoms.split(',').map((s) => s.trim())

      // Convertir treatment (texto libre separado por comas) a array de objetos con un campo 'description'
      const treatmentArray = formData.treatment
        ? formData.treatment.split(',').map((item) => ({ description: item.trim() }))
        : []

      // Para pickup (por ejemplo, texto plano), lo enviamos como objeto con un campo description
      const pickupObj = formData.pickup ? { description: formData.pickup.trim() } : {}

      await axios.post('http://localhost:8080/clinic-histories', {
        ...formData,
        // symptoms: symptomsArray,
        // treatment: treatmentArray,
        // pickup: pickupObj,
      })

      alert('Historial creado exitosamente')
      setFormData({
        patientId: '',
        doctorId: '',
        visitReason: '',
        diagnosis: '',
        symptoms: '',
        treatment: '',
        pickup: '',
      })
    } catch (err) {
      console.error(err)
      alert('Error al crear historial')
    }
  }

  return (
    <CCard>
      <CCardHeader>
        <strong>Crear Nuevo Historial Clínico</strong>
      </CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel>Paciente (ID)</CFormLabel>
              <CFormInput
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Médico (ID)</CFormLabel>
              <CFormInput
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                required
              />
            </CCol>
          </CRow>

          <CFormLabel>Motivo de la visita</CFormLabel>
          <CFormInput
            name="visitReason"
            value={formData.visitReason}
            onChange={handleChange}
            required
            className="mb-3"
          />

          <CFormLabel>Diagnóstico</CFormLabel>
          <CFormInput
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            required
            className="mb-3"
          />

          <CFormLabel>Síntomas (separados por coma)</CFormLabel>
          <CFormTextarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            rows={2}
            className="mb-3"
          />

          <CFormLabel>Tratamiento (JSON)</CFormLabel>
          <CFormTextarea
            name="treatment"
            value={formData.treatment}
            onChange={handleChange}
            rows={3}
            className="mb-3"
          />

          <CFormLabel>Recogida (pickup) (JSON)</CFormLabel>
          <CFormTextarea
            name="pickup"
            value={formData.pickup}
            onChange={handleChange}
            rows={3}
            className="mb-3"
          />

          <CButton type="submit" color="success">
            Guardar
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default ClinicHistoryCreate
