import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../../../services/auth'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilMedicalCross, cilBuilding } from '@coreui/icons'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    officeCode: '', // should be officeId that was fetched thanks to looking up the offices collection based on the provided code.
    password: '',
    repeatPassword: '',
  })
  const [offices, setOffices] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingOffices, setLoadingOffices] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch offices on component mount
  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const response = await authAPI.getOffices()
        setOffices(response.data)
      } catch (err) {
        console.error('Error fetching offices:', err)
        setError('Failed to load offices. Please try again.')
      } finally {
        setLoadingOffices(false)
      }
    }

    fetchOffices()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Basic validation
    if (!formData.username || !formData.fullName || !formData.officeCode || !formData.password) {
      setError('All fields are required')
      return
    }

    if (formData.password !== formData.repeatPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    // Find office by code
    const selectedOffice = offices.find((office) => office.code === formData.officeCode)
    if (!selectedOffice) {
      setError('Selected office not found')
      return
    }

    setLoading(true)

    try {
      const registrationData = {
        username: formData.username,
        fullName: formData.fullName,
        officeId: selectedOffice.id, // Use the found office ID
        password: formData.password,
      }

      await authAPI.register(registrationData)
      setSuccess('Doctor registered successfully! You can now login.')
      setFormData({
        username: '',
        fullName: '',
        officeCode: '',
        password: '',
        repeatPassword: '',
      })
    } catch (err) {
      console.error('Registration error:', err)
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.response?.status === 400) {
        setError('Username already exists or invalid data provided')
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your doctor account</p>

                  {error && <CAlert color="danger">{error}</CAlert>}
                  {success && (
                    <CAlert color="success">
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{success}</span>
                        <CButton color="primary" size="sm" onClick={() => navigate('/login')}>
                          Go to Login
                        </CButton>
                      </div>
                    </CAlert>
                  )}

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Username"
                      autoComplete="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilMedicalCross} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Full Name (e.g., Dr. John Doe)"
                      autoComplete="name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilBuilding} />
                    </CInputGroupText>
                    <CFormSelect
                      name="officeCode"
                      value={formData.officeCode}
                      onChange={handleChange}
                      required
                      disabled={loadingOffices}
                    >
                      <option value="">
                        {loadingOffices ? 'Loading offices...' : 'Select Office'}
                      </option>
                      {offices.map((office) => (
                        <option key={office.id} value={office.code}>
                          {office.code}
                        </option>
                      ))}
                    </CFormSelect>
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>

                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      name="repeatPassword"
                      value={formData.repeatPassword}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>

                  <div className="d-grid">
                    <CButton color="success" type="submit" disabled={loading || loadingOffices}>
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
