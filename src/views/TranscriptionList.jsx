import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CSpinner,
  CAlert,
} from '@coreui/react'
import axios from 'axios'

const TranscriptionList = ({ fileIds = [] }) => {
  const [transcriptions, setTranscriptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTranscriptions = async () => {
    setLoading(true)
    setError(null)

    try {
      const transcriptionPromises = fileIds.map(async (fileId) => {
        try {
          const response = await axios.get(`http://25.51.135.130:8001/transcribe/result/${fileId}`)
          return {
            fileId,
            ...response.data,
            status: 'success',
          }
        } catch (error) {
          return {
            fileId,
            status: 'error',
            error: error.message,
          }
        }
      })

      const results = await Promise.all(transcriptionPromises)
      setTranscriptions(results)
    } catch (error) {
      setError('Error al cargar las transcripciones')
      console.error('Error fetching transcriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (fileIds.length > 0) {
      fetchTranscriptions()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileIds])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleString('es-ES')
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <CCard>
        <CCardBody className="text-center">
          <CSpinner color="primary" />
          <div className="mt-2">Cargando transcripciones...</div>
        </CCardBody>
      </CCard>
    )
  }

  if (error) {
    return (
      <CCard>
        <CCardBody>
          <CAlert color="danger">{error}</CAlert>
        </CCardBody>
      </CCard>
    )
  }

  if (transcriptions.length === 0) {
    return (
      <CCard>
        <CCardHeader>
          <strong>Transcripciones</strong>
        </CCardHeader>
        <CCardBody>
          <CAlert color="info">No hay transcripciones disponibles</CAlert>
        </CCardBody>
      </CCard>
    )
  }

  return (
    <CCard>
      <CCardHeader>
        <strong>Lista de Transcripciones</strong>
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID de Archivo</CTableHeaderCell>
              <CTableHeaderCell>Paciente</CTableHeaderCell>
              <CTableHeaderCell>Fecha de Transcripción</CTableHeaderCell>
              <CTableHeaderCell>Diagnóstico</CTableHeaderCell>
              <CTableHeaderCell>Síntomas</CTableHeaderCell>
              <CTableHeaderCell>Estado</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {transcriptions.map((transcription) => (
              <CTableRow key={transcription.fileId}>
                <CTableDataCell>
                  <small className="text-muted">{transcription.fileId.substring(0, 8)}...</small>
                </CTableDataCell>
                <CTableDataCell>
                  {transcription.status === 'success' && transcription.extracted?.patientName
                    ? transcription.extracted.patientName
                    : 'N/A'}
                </CTableDataCell>
                <CTableDataCell>
                  {transcription.status === 'success'
                    ? formatDate(transcription.transcribedAt)
                    : 'N/A'}
                </CTableDataCell>
                <CTableDataCell>
                  {transcription.status === 'success' && transcription.extracted?.diagnosis
                    ? transcription.extracted.diagnosis
                    : 'N/A'}
                </CTableDataCell>
                <CTableDataCell>
                  {transcription.status === 'success' && transcription.extracted?.symptoms
                    ? Array.isArray(transcription.extracted.symptoms)
                      ? transcription.extracted.symptoms.join(', ')
                      : transcription.extracted.symptoms
                    : 'N/A'}
                </CTableDataCell>
                <CTableDataCell>
                  {transcription.status === 'success' ? (
                    <span className="badge bg-success">Completado</span>
                  ) : (
                    <span className="badge bg-danger">Error</span>
                  )}
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default TranscriptionList
