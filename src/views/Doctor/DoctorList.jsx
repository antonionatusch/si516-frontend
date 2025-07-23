import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { CButton, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'

const DoctorList = () => {
    const [doctors, setDoctors] = useState([])
    const [offices, setOffices] = useState([])

    const fetchDoctors = async () => {
        try {
            const res = await axios.get('http://localhost:8080/doctors')
            setDoctors(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    const fetchOffices = async () => {
        try {
            const res = await axios.get('http://localhost:8080/offices')
            setOffices(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    const deleteDoctor = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este doctor?')) return
        try {
            await axios.delete(`http://localhost:8080/doctors/${id}`)
            setDoctors(doctors.filter(doc => doc.id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchDoctors()
        fetchOffices()
    }, [])

    return (
        <CTable>
            <CTableHead>
                <CTableRow>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>Nombre</CTableHeaderCell>
                    <CTableHeaderCell>Usuario</CTableHeaderCell>
                    <CTableHeaderCell>Oficina</CTableHeaderCell>
                    <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
                {doctors.map((doctor) => (
                    <CTableRow key={doctor.id}>
                        <CTableDataCell>{doctor.id}</CTableDataCell>
                        <CTableDataCell>{doctor.fullName}</CTableDataCell>
                        <CTableDataCell>{doctor.username}</CTableDataCell>
                        <CTableDataCell>{offices.find(office => office.id === doctor.officeId)?.code || 'Sin oficina'}</CTableDataCell>
                        <CTableDataCell>
                            <CButton color="danger" size="sm" onClick={() => deleteDoctor(doctor.id)}>Eliminar</CButton>
                        </CTableDataCell>
                    </CTableRow>
                ))}
            </CTableBody>
        </CTable>
    )
}

export default DoctorList
