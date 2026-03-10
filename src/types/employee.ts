export interface Colaborador {
  id?: string
  titulo: string
  email: string
  ativoAoCriar: boolean
  departamento: string
  criadoEm?: unknown
}

export interface BasicInfoData {
  titulo: string
  email: string
  ativoAoCriar: boolean
}

export interface ProfessionalInfoData {
  departamento: string
}
