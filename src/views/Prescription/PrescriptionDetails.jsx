import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CBadge,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const PrescriptionDetails = () => {
  const [prescription, setPrescription] = useState(null)
  const [doctor, setDoctor] = useState(null)
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()

  const fetchPrescriptionDetails = async () => {
    try {
      setLoading(true)

      // Obtener la historia clínica
      const prescriptionRes = await axios.get(`http://localhost:8080/clinic-histories/${id}`)
      const prescriptionData = prescriptionRes.data
      setPrescription(prescriptionData)

      // Obtener información del doctor
      if (prescriptionData.doctorId) {
        try {
          const doctorRes = await axios.get(
            `http://localhost:8080/doctors/${prescriptionData.doctorId}`,
          )
          setDoctor(doctorRes.data)
        } catch (doctorError) {
          console.error('Error cargando datos del doctor:', doctorError)
          setDoctor({ fullName: 'Doctor no encontrado' })
        }
      }

      // Obtener información del paciente
      if (prescriptionData.patientId) {
        try {
          const patientRes = await axios.get(
            `http://localhost:8080/patients/${prescriptionData.patientId}`,
          )
          setPatient(patientRes.data)
        } catch (patientError) {
          console.error('Error cargando datos del paciente:', patientError)
          setPatient({ name: 'Paciente no encontrado' })
        }
      }
    } catch (error) {
      console.error('Error cargando detalles de receta:', error)
      setError('No se pudo cargar los detalles de la receta')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrescriptionDetails()
  }, [id])
  console.log(prescription)
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleString('es-ES')
    } catch {
      return dateString
    }
  }

  const formatPatientDOB = (dobString) => {
    if (!dobString) return 'N/A'
    return new Date(dobString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getPickupTypeColor = (pickupType) => {
    switch (pickupType) {
      case 'NOW':
        return 'danger'
      case 'SCHEDULED':
        return 'warning'
      case 'LATER':
        return 'info'
      default:
        return 'secondary'
    }
  }

  const getPickupTypeLabel = (pickupType) => {
    switch (pickupType) {
      case 'NOW':
        return 'INMEDIATO'
      case 'SCHEDULED':
        return 'PROGRAMADO'
      case 'LATER':
        return 'MÁS TARDE'
      default:
        return 'NO ESPECIFICADO'
    }
  }

  if (loading) return <div className="text-center">Cargando detalles...</div>
  if (error) return <div className="text-center text-danger">Error: {error}</div>
  if (!prescription) return <div className="text-center">Receta no encontrada</div>

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <CRow>
            <CCol>
              <strong>Detalles de Receta Médica #{prescription.id}</strong>
            </CCol>
            <CCol xs="auto">
              <CButton color="secondary" onClick={() => navigate('/prescription')}>
                Volver a Lista
              </CButton>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md={6}>
              <h5>Información General</h5>
              <p>
                <strong>Fecha de creación:</strong> {formatDate(prescription.createdAt)}
              </p>
              <p>
                <strong>Doctor:</strong> {doctor?.fullName || 'Cargando...'}
              </p>
              <p>
                <strong>Motivo de consulta:</strong> {prescription.visitReason}
              </p>
              <p>
                <strong>Síntomas:</strong>{' '}
                {Array.isArray(prescription.symptoms)
                  ? prescription.symptoms.join(', ')
                  : prescription.symptoms || 'No especificados'}
              </p>
              <p>
                <strong>Diagnóstico:</strong> {prescription.diagnosis}
              </p>
            </CCol>
            <CCol md={6}>
              <h5>Información del Paciente</h5>
              <p>
                <strong>Nombre:</strong> {patient?.name || 'Cargando...'}
              </p>
              {patient?.email && (
                <p>
                  <strong>Email:</strong> {patient.email}
                </p>
              )}
              {patient?.phone && (
                <p>
                  <strong>Teléfono:</strong> {patient.phone}
                </p>
              )}
              {patient?.dob && (
                <p>
                  <strong>Fecha de nacimiento:</strong> {formatPatientDOB(patient.dob)}
                </p>
              )}

              <h6 className="mt-3">Información de Retiro</h6>
              <p>
                <strong>Tipo de retiro:</strong>{' '}
                <CBadge color={getPickupTypeColor(prescription.pickup?.pickupType)}>
                  {getPickupTypeLabel(prescription.pickup?.pickupType)}
                </CBadge>
              </p>
              {prescription.pickup?.scheduledTime && (
                <p>
                  <strong>Hora programada:</strong> {prescription.pickup.scheduledTime}
                </p>
              )}
              {prescription.pickup?.pickupType === 'SCHEDULED' &&
                !prescription.pickup?.scheduledTime && (
                  <p className="text-muted">
                    <em>Retiro programado sin hora específica</em>
                  </p>
                )}
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      <CCard>
        <CCardHeader>
          <strong>Tratamientos Prescritos ({prescription.treatment?.length || 0})</strong>
        </CCardHeader>
        <CCardBody>
          {prescription.treatment && prescription.treatment.length > 0 ? (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Medicamento</CTableHeaderCell>
                  <CTableHeaderCell>Laboratorio</CTableHeaderCell>
                  <CTableHeaderCell>Instrucciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {prescription.treatment.map((treatment, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>
                      <strong>{treatment.drug}</strong>
                    </CTableDataCell>
                    <CTableDataCell>{treatment.lab || 'No especificado'}</CTableDataCell>
                    <CTableDataCell>
                      {treatment.instruction || 'Sin instrucciones especiales'}
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          ) : (
            <div className="text-center text-muted">
              No hay tratamientos prescritos en esta receta
            </div>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default PrescriptionDetails
