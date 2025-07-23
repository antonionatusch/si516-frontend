// src/views/Audio/AudioRecorder.jsx
import React, { useEffect, useRef, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CProgress,
  CProgressBar,
  CSpinner,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMicrophone, cilMediaStop, cilTrash, cilCloudUpload, cilArrowRight } from '@coreui/icons'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import TranscriptionList from '../TranscriptionList'

const MAX_SECONDS = 300 // solo para la barra, 5 min; ajusta o elimina

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [audioUrl, setAudioUrl] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  // New states for transcription modal
  const [showTranscriptionModal, setShowTranscriptionModal] = useState(false)
  const [transcriptionStatus, setTranscriptionStatus] = useState(null) // 'RUNNING', 'DONE', 'ERROR'
  const [currentFileId, setCurrentFileId] = useState(null)
  const [transcriptionResult, setTranscriptionResult] = useState(null)
  const [sessionFileIds, setSessionFileIds] = useState([])
  const [pollingInterval, setPollingInterval] = useState(null)

  const navigate = useNavigate()
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([]) // acumulamos los trozos
  const audioBlobRef = useRef(null) // store the audio blob for upload

  // timer
  useEffect(() => {
    let timer
    if (isRecording) {
      timer = setInterval(() => setSeconds((s) => s + 1), 1000)
    }
    return () => clearInterval(timer)
  }, [isRecording])

  // Cleanup polling interval on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [pollingInterval])

  // Polling function for transcription status
  const pollTranscriptionStatus = async (fileId) => {
    try {
      const response = await axios.get(`http://25.51.135.130:8001/transcribe/status/${fileId}`)
      const status = response.data.state

      setTranscriptionStatus(status)

      if (status === 'DONE') {
        // Stop polling and fetch the result
        if (pollingInterval) {
          clearInterval(pollingInterval)
          setPollingInterval(null)
        }
        await fetchTranscriptionResult(fileId)
      } else if (status === 'ERROR' || status === 'FAILED') {
        // Stop polling on error
        if (pollingInterval) {
          clearInterval(pollingInterval)
          setPollingInterval(null)
        }
        setTranscriptionStatus('ERROR')
      }
    } catch (error) {
      console.error('Error polling transcription status:', error)
      // Continue polling on network errors, might be temporary
    }
  }

  // Fetch transcription result
  const fetchTranscriptionResult = async (fileId) => {
    try {
      const response = await axios.get(`http://25.51.135.130:8001/transcribe/result/${fileId}`)
      setTranscriptionResult(response.data)
    } catch (error) {
      console.error('Error fetching transcription result:', error)
      setTranscriptionStatus('ERROR')
    }
  }

  // Start polling for transcription status
  const startPolling = (fileId) => {
    setCurrentFileId(fileId)
    setTranscriptionStatus('RUNNING')
    setShowTranscriptionModal(true)

    // Initial poll
    pollTranscriptionStatus(fileId)

    // Set up interval polling every 5 seconds
    const interval = setInterval(() => {
      pollTranscriptionStatus(fileId)
    }, 5000)

    setPollingInterval(interval)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        audioBlobRef.current = blob // store the blob for upload
        setAudioUrl(URL.createObjectURL(blob))
        // aquí luego: mandar blob al backend
      }

      mediaRecorder.start()
      setSeconds(0)
      setIsRecording(true)
    } catch (err) {
      console.error(err)
      alert('No se pudo acceder al micrófono')
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop())
    setIsRecording(false)
  }

  const resetRecording = () => {
    setAudioUrl(null)
    setSeconds(0)
    chunksRef.current = []
    audioBlobRef.current = null
  }

  const uploadAudio = async () => {
    if (!audioBlobRef.current) {
      alert('No hay audio para subir')
      return
    }

    setIsUploading(true)
    try {
      // Create FormData for file upload
      const formData = new FormData()

      // Create a File object from the blob
      const audioFile = new File([audioBlobRef.current], `audio-${Date.now()}.webm`, {
        type: 'audio/webm',
      })

      formData.append('file', audioFile)

      // Optional parameters can be added here when available:
      // formData.append('doctorId', doctorId)
      // formData.append('patientId', patientId)

      const response = await axios.post('http://localhost:8080/files/audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      console.log('Upload response:', response.data)

      // Extract fileId from response and start polling
      const fileId = response.data.fileId || response.data.id
      if (fileId) {
        // Add to session file IDs
        setSessionFileIds((prev) => [...prev, fileId])
        // Start polling for transcription status
        startPolling(fileId)
      } else {
        alert('Error: No se recibió el ID del archivo')
      }

      // Optionally reset the recording after successful upload
      // resetRecording()
    } catch (error) {
      console.error('Error al subir audio:', error)
      alert('Error al subir el audio. Por favor, intente nuevamente.')
    } finally {
      setIsUploading(false)
    }
  }

  const progressValue = Math.min((seconds / MAX_SECONDS) * 100, 100)

  // Modal close handler
  const handleCloseModal = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      setPollingInterval(null)
    }
    setShowTranscriptionModal(false)
    setTranscriptionStatus(null)
    setTranscriptionResult(null)
    setCurrentFileId(null)
  }

  // Navigate to clinic history
  const navigateToClinicHistory = () => {
    handleCloseModal()
    navigate('/ClinicHistory/ver')
  }

  return (
    <>
      <CCard>
        <CCardHeader>
          <strong>Grabar Resumen</strong>
        </CCardHeader>
        <CCardBody className="d-flex flex-column align-items-center">
          {/* Botón micrófono + texto */}
          <div
            className={`mic-wrapper ${isRecording ? 'recording' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            <div className="mic-circle">
              <CIcon icon={cilMicrophone} size="xxl" />
            </div>
            <span className="mic-text mt-2">Grabar resumen</span>
          </div>

          {/* Barra estilo WhatsApp (simple: tiempo + botones) */}
          {isRecording && (
            <div className="w-100 mt-4">
              <div className="d-flex align-items-center gap-3 mb-2">
                <CIcon icon={cilTrash} role="button" onClick={resetRecording} title="Descartar" />
                <span>{formatTime(seconds)}</span>
                <CButton
                  color="danger"
                  variant="outline"
                  size="sm"
                  onClick={stopRecording}
                  className="ms-auto"
                >
                  <CIcon icon={cilMediaStop} className="me-1" />
                  Detener
                </CButton>
              </div>
              <CProgress thin>
                <CProgressBar value={progressValue} />
              </CProgress>
            </div>
          )}

          {/* Reproducción simple del resultado */}
          {audioUrl && !isRecording && (
            <div className="w-100 mt-4">
              <audio src={audioUrl} controls className="w-100" />
              <div className="mt-2 d-flex gap-2">
                <CButton color="secondary" size="sm" onClick={resetRecording}>
                  Regrabar
                </CButton>
                <CButton color="primary" size="sm" onClick={uploadAudio} disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <CSpinner size="sm" className="me-1" />
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <CIcon icon={cilCloudUpload} className="me-1" />
                      Enviar Audio
                    </>
                  )}
                </CButton>
              </div>
            </div>
          )}
        </CCardBody>
      </CCard>

      {/* Transcription List */}
      {sessionFileIds.length > 0 && (
        <div className="mt-4">
          <TranscriptionList fileIds={sessionFileIds} />
        </div>
      )}

      {/* Transcription Status Modal */}
      <CModal visible={showTranscriptionModal} onClose={handleCloseModal} size="lg">
        <CModalHeader>
          <CModalTitle>Estado de Transcripción</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {transcriptionStatus === 'RUNNING' && (
            <div className="text-center">
              <CSpinner color="primary" size="lg" />
              <div className="mt-3">
                <h5>Procesando transcripción...</h5>
                <p className="text-muted">
                  Su audio está siendo transcrito. Este proceso puede tomar algunos minutos.
                </p>
              </div>
            </div>
          )}

          {transcriptionStatus === 'DONE' && transcriptionResult && (
            <div>
              <CAlert color="success">
                <strong>¡Transcripción completada!</strong>
              </CAlert>

              {/* Transcription Result Display */}
              <CCard className="mt-3">
                <CCardHeader>
                  <strong>Resultado de la Transcripción</strong>
                </CCardHeader>
                <CCardBody>
                  {transcriptionResult.text && (
                    <div className="mb-3">
                      <h6>Texto Transcrito:</h6>
                      <div className="p-3 bg-light rounded text-black">
                        {transcriptionResult.text}
                      </div>
                    </div>
                  )}

                  {transcriptionResult.extracted && (
                    <div>
                      <h6>Información Extraída:</h6>
                      <div className="row">
                        {transcriptionResult.extracted.patientName && (
                          <div className="col-md-6 mb-2">
                            <strong>Paciente:</strong> {transcriptionResult.extracted.patientName}
                          </div>
                        )}
                        {transcriptionResult.extracted.visitReason && (
                          <div className="col-md-6 mb-2">
                            <strong>Motivo de Consulta:</strong>{' '}
                            {transcriptionResult.extracted.visitReason}
                          </div>
                        )}
                        {transcriptionResult.extracted.diagnosis && (
                          <div className="col-12 mb-2">
                            <strong>Diagnóstico:</strong> {transcriptionResult.extracted.diagnosis}
                          </div>
                        )}
                        {transcriptionResult.extracted.symptoms && (
                          <div className="col-12 mb-2">
                            <strong>Síntomas:</strong>{' '}
                            {Array.isArray(transcriptionResult.extracted.symptoms)
                              ? transcriptionResult.extracted.symptoms.join(', ')
                              : transcriptionResult.extracted.symptoms}
                          </div>
                        )}
                        {transcriptionResult.extracted.treatment &&
                          Array.isArray(transcriptionResult.extracted.treatment) &&
                          transcriptionResult.extracted.treatment.length > 0 && (
                            <div className="col-12 mb-2">
                              <strong>Tratamiento:</strong>
                              <ul className="mb-0">
                                {transcriptionResult.extracted.treatment.map((item, index) => (
                                  <li key={index}>
                                    {item.drug && <strong>{item.drug}</strong>}
                                    {item.instruction && ` - ${item.instruction}`}
                                    {item.lab && ` (${item.lab})`}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                </CCardBody>
              </CCard>

              {/* Navigation Button */}
              <div className="mt-3 text-center">
                <CButton color="success" onClick={navigateToClinicHistory}>
                  <CIcon icon={cilArrowRight} className="me-1" />
                  Ir a Historial Clínico Generado
                </CButton>
              </div>
            </div>
          )}

          {transcriptionStatus === 'ERROR' && (
            <div className="text-center">
              <CAlert color="danger">
                <strong>Error en la transcripción</strong>
                <div>Hubo un problema al procesar su audio. Por favor, intente nuevamente.</div>
              </CAlert>
            </div>
          )}
        </CModalBody>
      </CModal>
    </>
  )
}

export default AudioRecorder

function formatTime(total) {
  const m = String(Math.floor(total / 60)).padStart(2, '0')
  const s = String(total % 60).padStart(2, '0')
  return `${m}:${s}`
}
