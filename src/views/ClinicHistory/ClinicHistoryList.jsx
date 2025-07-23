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
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const ClinicHistoryList = () => {
    const [histories, setHistories] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        axios.get('http://localhost:8080/clinic-histories').then((res) => setHistories(res.data))
    }, [])

    return (
        <CCard>
            <CCardHeader>
                <strong>Lista de Historiales Clínicos</strong>
            </CCardHeader>
            <CCardBody>
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
                        {histories.map((h) => (
                            <CTableRow key={h.id}>
                                <CTableDataCell>{h.id}</CTableDataCell>
                                <CTableDataCell>{h.patientId}</CTableDataCell>
                                <CTableDataCell>{h.doctorId}</CTableDataCell>
                                <CTableDataCell>{h.visitReason}</CTableDataCell>
                                <CTableDataCell>{h.diagnosis}</CTableDataCell>
                                <CTableDataCell>
                                    <CButton color="primary" size="sm" onClick={() => navigate(`/clinic-history/${h.id}`)}>
                                        Ver
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </CCardBody>
        </CCard>
    )
}

export default ClinicHistoryList;
