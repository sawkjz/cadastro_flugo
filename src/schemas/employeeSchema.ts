import { z } from 'zod'

export const basicInfoSchema = z.object({
  titulo: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome muito longo'),
  email: z.string().email('E-mail invalido'),
  ativoAoCriar: z.boolean(),
})

export const professionalInfoSchema = z.object({
  departamentoId: z.string().min(1, 'Selecione um departamento'),
  cargo: z.string().min(2, 'Cargo deve ter pelo menos 2 caracteres'),
  dataAdmissao: z.string().min(1, 'Informe a data de admissao'),
  nivelHierarquico: z.enum(['junior', 'pleno', 'senior', 'gestor'], {
    errorMap: () => ({ message: 'Selecione um nivel hierarquico' }),
  }),
  gestorResponsavelId: z.string().default(''),
  salarioBase: z.coerce.number().min(0, 'Salario deve ser um valor positivo'),
})

export type BasicInfoSchema = z.infer<typeof basicInfoSchema>
export type ProfessionalInfoSchema = z.infer<typeof professionalInfoSchema>
