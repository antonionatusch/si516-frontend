import React from 'react'
//Views
const ClinicHistoryList = React.lazy(() => import('./views/ClinicHistory/ClinicHistoryList'))
const ClinicHistoryCreate = React.lazy(() => import('./views/ClinicHistory/ClinicHistoryCreate'))
const ClinicHistoryDetail = React.lazy(() => import('./views/ClinicHistory/ClinicHistoryDetail'))
const ClinicHistorySearch = React.lazy(() => import('./views/ClinicHistory/ClinicHistorySearch'))
//patients
const PatientCreate = React.lazy(() => import('./views/Patient/PatientCreate'))
const PatientList = React.lazy(() => import('./views/Patient/PatientList'))

//doctores
const DoctorCreate = React.lazy(() => import('./views/Doctor/DoctorCreate'))
const DoctorList = React.lazy(() => import('./views/Doctor/DoctorList'))

// Prescription
const PrescriptionList = React.lazy(() => import('./views/Prescription/PrescriptionList'))
const PrescriptionDetails = React.lazy(() => import('./views/Prescription/PrescriptionDetails'))

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Appointments
const AppointmentList = React.lazy(() => import('./views/Appointment/AppointmentList'))
const AppointmentCreate = React.lazy(() => import('./views/Appointment/AppointmentCreate'))

// Transcripcion
const AudioRecorder = React.lazy(() => import('./views/AudioRecorder/AudioRecorder')) // ajusta la ruta real
const TranscriptionList = React.lazy(() => import('./views/TranscriptionList')) // ajusta la ruta real

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  // Historial Clínico

  { path: '/ClinicHistory/ver', name: 'Ver Historiales', element: ClinicHistoryList },
  { path: '/ClinicHistory/nuevo', name: 'Crear Nuevo', element: ClinicHistoryCreate },
  {
    path: '/ClinicHistory/detalle/:id',
    name: 'Detalle de Historial',
    element: ClinicHistoryDetail,
  },
  { path: '/ClinicHistory/buscar', name: 'Buscar por Paciente', element: ClinicHistorySearch },

  //Paciente
  { path: '/Patient/registrar', name: 'Registrar Paciente', element: PatientCreate },
  { path: '/Patient/lista', name: 'Lista de Paciente', element: PatientList },

  //Doctor
  { path: '/Doctores/registrar', name: 'Registrar Doctor', element: DoctorCreate },
  { path: '/Doctores/lista', name: 'Lista de Doctor', element: DoctorList },

  // Prescription
  { path: '/prescription', name: 'Lista de Recetas', element: PrescriptionList },
  { path: '/prescription/details/:id', name: 'Detalles de Receta', element: PrescriptionDetails },

  //Citas
  { path: '/Appointments/nueva', name: 'Registrar Cita', element: AppointmentCreate },
  { path: '/Appointments/lista', name: 'Lista de Citas', element: AppointmentList },

  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
  { path: '/audio/grabar', name: 'Grabar Resumen', element: AudioRecorder },
  { path: '/transcripcion', name: 'Inspeccionar Transcripcion', element: TranscriptionList },
]

export default routes
