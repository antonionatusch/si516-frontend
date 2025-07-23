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
  CBadge,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const fetchPrescriptions = async () => {
    try {
      setLoading(true)
      const res = await axios.get('http://localhost:8080/clinic-histories')
      console.log(res)
      // Extraer las recetas de las historias clínicas
      const extractedPrescriptions = res.data
        .filter((history) => history.treatment && history.treatment.length > 0)
        .map((history) => ({
          id: history.id,
          patientId: history.patientId ?? 'fulanito',
          doctorId: history.doctorId ?? 'fulanito',
          diagnosis: history.diagnosis,
          treatments: history.treatment,
          pickup: history.pickup,
          createdAt: history.createdAt,
        }))

      setPrescriptions(extractedPrescriptions)
    } catch (error) {
      console.error('Error cargando recetas:', error)
      setError('No se pudo cargar la lista de recetas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  console.log(prescriptions)

  const formatDate = (dateString) => {
    console.log(dateString)
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
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

  const handleViewDetails = (prescriptionId) => {
    navigate(`/prescription/details/${prescriptionId}`)
  }

  if (loading) return <div className="text-center">Cargando recetas...</div>
  if (error) return <div className="text-center text-danger">Error: {error}</div>

  console.log('Prescriptions:', prescriptions)

  return (
    <CCard>
      <CCardHeader>
        <strong>Lista de Recetas Médicas</strong>
        <CButton
          color="primary"
          className="float-end"
          onClick={() => navigate('/ClinicHistory/nuevo')}
        >
          Nueva Historia Clínica
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID Receta</CTableHeaderCell>
              <CTableHeaderCell>Fecha</CTableHeaderCell>
              <CTableHeaderCell>Diagnóstico</CTableHeaderCell>
              <CTableHeaderCell>Medicamentos</CTableHeaderCell>
              <CTableHeaderCell>Tipo de Retiro</CTableHeaderCell>
              <CTableHeaderCell>Hora Programada</CTableHeaderCell>
              <CTableHeaderCell>Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {prescriptions.length > 0 ? (
              prescriptions.map((prescription) => (
                <CTableRow key={prescription.id}>
                  <CTableDataCell>{prescription.id}</CTableDataCell>
                  <CTableDataCell>{prescription.createdAt}</CTableDataCell>
                  <CTableDataCell>{prescription.diagnosis}</CTableDataCell>
                  <CTableDataCell>
                    {prescription.treatments.length} medicamento(s)
                    <br />
                    <small className="text-muted">
                      {prescription.treatments
                        .map((t) => t.drug)
                        .slice(0, 2)
                        .join(', ')}
                      {prescription.treatments.length > 2 && '...'}
                    </small>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CBadge color={getPickupTypeColor(prescription.pickupType?.pickupType)}>
                      {getPickupTypeLabel(prescription.pickup?.pickupType)}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    {prescription.pickup?.scheduledTime || 'No programada'}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="info"
                      size="sm"
                      onClick={() => handleViewDetails(prescription.id)}
                    >
                      Ver Detalles
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={7} className="text-center">
                  No hay recetas disponibles
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default PrescriptionList
