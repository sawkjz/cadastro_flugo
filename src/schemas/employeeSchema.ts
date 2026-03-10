import { z } from 'zod'

export const basicInfoSchema = z.object({
  titulo: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome muito longo'),
  email: z.string().email('E-mail inválido'),
  ativoAoCriar: z.boolean(),
})

export const professionalInfoSchema = z.object({
  departamento: z.string().min(1, 'Selecione um departamento'),
})

export type BasicInfoSchema = z.infer<typeof basicInfoSchema>
export type ProfessionalInfoSchema = z.infer<typeof professionalInfoSchema>
