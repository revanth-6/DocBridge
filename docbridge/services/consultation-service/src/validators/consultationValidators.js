const { z } = require('zod');

const createConsultationSchema = z.object({
  familyMemberId: z.string().uuid().optional().nullable(),
  doctorName: z.string().max(200).optional(),
  doctorSpecialty: z.string().max(100).optional(),
  hospitalClinic: z.string().max(200).optional(),
  consultationDate: z.string().min(1, 'Consultation date is required'),
  consultationTime: z.string().optional(),
  chiefComplaint: z.string().optional(),
  diagnosis: z.string().optional(),
  diagnosisSimplified: z.string().optional(),
  doctorNotes: z.string().optional(),
  followUpDate: z.string().optional().nullable(),
  followUpNotes: z.string().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'missed']).optional(),
  isTeleconsultation: z.boolean().optional(),
  attachments: z.array(z.any()).optional(),
});

const updateConsultationSchema = createConsultationSchema.partial();

module.exports = { createConsultationSchema, updateConsultationSchema };
