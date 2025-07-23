import React, { useState } from 'react'
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
    CFormInput,
    CButton,
    CRow,
    CCol,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const ClinicHistorySearch = () => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const navigate = useNavigate()

    const handleSearch = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/clinic-histories/search?patient=${query}`)
            setResults(res.data)
        } catch (error) {
            console.error('Error al buscar:', error)
            alert('No se encontraron resultados o hubo un error.')
        }
    }

    return (
        <CCard>
            <CCardHeader><strong>Buscar Historial por Paciente</strong></CCardHeader>
            <CCardBody>
                <CRow className="mb-3">
                    <CCol sm={10}>
                        <CFormInput
                            type="text"
                            placeholder="Buscar por nombre o ID de paciente"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </CCol>
                    <CCol sm={2}>
                        <CButton color="info" onClick={handleSearch}>Buscar</CButton>
                    </CCol>
                </CRow>

                {results.length > 0 && (
                    <CTable hover responsive>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>ID</CTableHeaderCell>
                                <CTableHeaderCell>Paciente</CTableHeaderCell>
                                <CTableHeaderCell>Médico</CTableHeaderCell>
                                <CTableHeaderCell>Motivo</CTableHeaderCell>
                                <CTableHeaderCell>Diagnóstico</CTableHeaderCell>
                                <CTableHeaderCell>Acciones</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {results.map((h) => (
                                <CTableRow key={h.id}>
                                    <CTableDataCell>{h.id}</CTableDataCell>
                                    <CTableDataCell>{h.patientId}</CTableDataCell>
                                    <CTableDataCell>{h.doctorId}</CTableDataCell>
                                    <CTableDataCell>{h.visitReason}</CTableDataCell>
                                    <CTableDataCell>{h.diagnosis}</CTableDataCell>
                                    <CTableDataCell>
                                        <CButton
                                            color="primary"
                                            size="sm"
                                            onClick={() => navigate(`/clinic-history/${h.id}`)}
                                        >
                                            Ver
                                        </CButton>
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                )}
            </CCardBody>
        </CCard>
    )
}

export default ClinicHistorySearch
