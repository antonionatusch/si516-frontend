import React, { useState } from 'react'
import axios from 'axios'
import { CButton, CForm, CFormInput, CFormLabel, CFormSelect } from '@coreui/react'

const DoctorCreate = () => {
  const [doctor, setDoctor] = useState({
    username: '',
    fullName: '',
    officeId: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setDoctor({ ...doctor, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:8080/doctors', doctor)
      alert('Doctor registrado correctamente')
      setDoctor({ username: '', fullName: '', office: '' })
    } catch (err) {
      console.error(err)
      alert('Error al registrar doctor')
    }
  }

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormLabel>Nombre completo</CFormLabel>
      <CFormInput
        type="text"
        name="fullName"
        value={doctor.fullName}
        onChange={handleChange}
        required
      />

      <CFormLabel>Nombre de usuario</CFormLabel>
      <CFormInput
        type="text"
        name="username"
        value={doctor.username}
        onChange={handleChange}
        required
      />

      <CFormLabel>ID de la oficina</CFormLabel>
      <CFormInput type="text" name="officeId" value={doctor.office} onChange={handleChange} />

      <CButton type="submit" color="primary" className="mt-3">
        Guardar
      </CButton>
    </CForm>
  )
}

export default DoctorCreate
