import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalendar,
  cilEnvelopeOpen,
  cilNotes,
  cilPeople,
  cilSettings,
  cilUser,
  cilDescription,
  cilStar,
  cilChatBubble,
  cilMicrophone,
  cilMedicalCross,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: 'SaludConecta',
  },
  {
    component: CNavGroup,
    name: 'Historial Clínico',
    to: '/ClinicHistory',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Ver Historiales',
        to: '/ClinicHistory/ver',
      },
      {
        component: CNavItem,
        name: 'Crear Nuevo',
        to: '/ClinicHistory/nuevo',
      },
      {
        component: CNavItem,
        name: 'Buscar por Paciente',
        to: '/ClinicHistory/buscar',
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Pacientes',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Lista de Pacientes',
        to: '/Patient/lista',
      },
      {
        component: CNavItem,
        name: 'Registrar Paciente',
        to: '/Patient/registrar',
      },
    ],
  },

  //  Doctores
  {
    component: CNavGroup,
    name: 'Doctores',
    icon: <CIcon icon={cilMedicalCross} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Lista de Doctores',
        to: '/Doctores/lista',
      },
      {
        component: CNavItem,
        name: 'Registrar Doctor',
        to: '/Doctores/registrar',
      },
    ],
  },

  // Citas
  {
    component: CNavGroup,
    name: 'Citas',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Ver Citas',
        to: '/Appointments/lista',
      },
      {
        component: CNavItem,
        name: 'Nueva Cita',
        to: '/Appointments/nueva',
      },
    ],
  },

  // 💬 Chat Médico
  {
    component: CNavItem,
    name: 'Chat Médico',
    to: '/chatbot',
    icon: <CIcon icon={cilChatBubble} customClassName="nav-icon" />,
  },

  // 🗣️ Transcripción de Audio
  {
    component: CNavGroup,
    name: 'Audio',
    icon: <CIcon icon={cilMicrophone} customClassName="nav-icon" />,
    items: [{ component: CNavItem, name: 'Grabar Resumen', to: '/audio/grabar' }],
  },
  {
    component: CNavItem,
    name: 'Mensajes',
    to: '/mensajes',
    icon: <CIcon icon={cilEnvelopeOpen} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Notificaciones',
    to: '/notificaciones',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Perfil',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Mi Perfil',
        to: '/perfil/ver',
      },
      {
        component: CNavItem,
        name: 'Cambiar Contraseña',
        to: '/perfil/cambiar-clave',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Ajustes',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Configuración General',
        to: '/ajustes/general',
      },
      {
        component: CNavItem,
        name: 'Preferencias de Cuenta',
        to: '/ajustes/preferencias',
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'Acceso',
  },
  {
    component: CNavItem,
    name: 'Login',
    to: '/login',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Register',
    to: '/register',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
]

export default _nav
