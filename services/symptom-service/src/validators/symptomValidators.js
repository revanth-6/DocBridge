const { z } = require('zod');

const createSymptomSchema = z.object({
  familyMemberId: z.string().uuid().optional().nullable(),
  symptomName: z.string().min(1).max(200),
  severity: z.number().int().min(1).max(10),
  onsetDate: z.string().min(1),
  onsetTime: z.string().optional().nullable(),
  durationHours: z.number().int().optional(),
  isOngoing: z.boolean().optional(),
  resolvedDate: z.string().optional().nullable(),
  bodyLocation: z.string().max(100).optional(),
  triggers: z.string().optional(),
  relievedBy: z.string().optional(),
  associatedSymptoms: z.array(z.string()).optional(),
  notes: z.string().optional(),
  relatedConsultationId: z.string().uuid().optional().nullable(),
});
const updateSymptomSchema = createSymptomSchema.partial();
module.exports = { createSymptomSchema, updateSymptomSchema };
