import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import axios from 'axios'

const ClinicHistoryDetail = () => {
  const { id } = useParams()
  const [history, setHistory] = useState(null)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/clinic-histories/${id}`)
        setHistory(res.data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchDetail()
  }, [id])

  if (!history) return <p>Cargando detalle...</p>

  return (
    <CCard>
      <CCardHeader>
        <strong>Detalle del Historial Clínico</strong>
      </CCardHeader>
      <CCardBody>
        <p>
          <strong>ID:</strong> {history.id}
        </p>
        <p>
          <strong>Paciente:</strong> {history.patientId}
        </p>
        <p>
          <strong>Médico:</strong> {history.doctorId}
        </p>
        <p>
          <strong>Motivo:</strong> {history.visitReason}
        </p>
        <p>
          <strong>Fecha:</strong> {new Date(history.createdAt).toLocaleString()}
        </p>
      </CCardBody>
    </CCard>
  )
}

export default ClinicHistoryDetail
