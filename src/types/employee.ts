export interface Colaborador {
  id?: string
  titulo: string
  email: string
  ativoAoCriar: boolean
  departamentoId: string
  cargo: string
  dataAdmissao: string
  nivelHierarquico: 'junior' | 'pleno' | 'senior' | 'gestor'
  gestorResponsavelId: string
  salarioBase: number
  criadoEm?: unknown
}

export interface BasicInfoData {
  titulo: string
  email: string
  ativoAoCriar: boolean
}

export interface ProfessionalInfoData {
  departamentoId: string
  cargo: string
  dataAdmissao: string
  nivelHierarquico: 'junior' | 'pleno' | 'senior' | 'gestor'
  gestorResponsavelId: string
  salarioBase: number
}
