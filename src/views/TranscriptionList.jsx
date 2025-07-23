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
  const [pollingInterval, setPollingInterval] = useState(null)

  const fetchTranscriptions = async () => {
    setLoading(true)
    setError(null)

    try {
      const transcriptionPromises = fileIds.map(async (fileId) => {
        try {
          // First check the status
          const statusResponse = await axios.get(
            `http://25.51.135.130:8001/transcribe/status/${fileId}`,
          )
          const transcriptionStatus = statusResponse.data.state

          if (transcriptionStatus === 'DONE') {
            // Only fetch results if transcription is done
            try {
              const resultResponse = await axios.get(
                `http://25.51.135.130:8001/transcribe/result/${fileId}`,
              )
              return {
                fileId,
                ...resultResponse.data,
                status: 'success',
                transcriptionStatus: 'DONE',
              }
            } catch (resultError) {
              return {
                fileId,
                status: 'error',
                transcriptionStatus: 'DONE',
                error: 'Error al obtener el resultado de la transcripción',
              }
            }
          } else {
            // Return status info for RUNNING, ERROR, etc.
            return {
              fileId,
              status: transcriptionStatus === 'ERROR' ? 'error' : 'running',
              transcriptionStatus,
              error: transcriptionStatus === 'ERROR' ? 'Error en la transcripción' : null,
            }
          }
        } catch (statusError) {
          return {
            fileId,
            status: 'error',
            transcriptionStatus: 'UNKNOWN',
            error: 'Error al verificar el estado de la transcripción',
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

      // Set up polling to refresh transcriptions every 10 seconds
      // Only poll if there are running transcriptions
      const interval = setInterval(() => {
        fetchTranscriptions()
      }, 10000)

      setPollingInterval(interval)

      return () => {
        if (interval) {
          clearInterval(interval)
        }
      }
    } else {
      // Clear transcriptions and polling when no fileIds
      setTranscriptions([])
      if (pollingInterval) {
        clearInterval(pollingInterval)
        setPollingInterval(null)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileIds])

  // Stop polling when all transcriptions are complete or have errors
  useEffect(() => {
    const hasRunningTranscriptions = transcriptions.some((t) => t.status === 'running')

    if (!hasRunningTranscriptions && pollingInterval) {
      clearInterval(pollingInterval)
      setPollingInterval(null)
    }
  }, [transcriptions, pollingInterval])

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
                  ) : transcription.status === 'running' ? (
                    <span className="badge bg-warning">Procesando...</span>
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
