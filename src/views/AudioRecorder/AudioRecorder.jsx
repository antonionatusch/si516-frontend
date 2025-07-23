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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMicrophone, cilMediaStop, cilTrash, cilCloudUpload } from '@coreui/icons'
import axios from 'axios'

const MAX_SECONDS = 300 // solo para la barra, 5 min; ajusta o elimina

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [audioUrl, setAudioUrl] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

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

      alert('Audio subido correctamente')
      console.log('Upload response:', response.data)

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

  return (
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
  )
}

export default AudioRecorder

function formatTime(total) {
  const m = String(Math.floor(total / 60)).padStart(2, '0')
  const s = String(total % 60).padStart(2, '0')
  return `${m}:${s}`
}
