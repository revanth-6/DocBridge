const { z } = require('zod');

const createLabReportSchema = z.object({
  consultationId: z.string().uuid().optional().nullable(),
  familyMemberId: z.string().uuid().optional().nullable(),
  reportName: z.string().min(1).max(300),
  reportType: z.string().min(1).max(100),
  labName: z.string().max(200).optional(),
  reportDate: z.string().min(1),
  orderedByDoctor: z.string().max(200).optional(),
  results: z.array(z.object({
    test_name: z.string(), value: z.any(), unit: z.string().optional(),
    reference_range: z.string().optional(), status: z.string().optional(),
  })).optional(),
  flaggedValues: z.array(z.any()).optional(),
  overallInterpretation: z.string().optional(),
  overallInterpretationSimplified: z.string().optional(),
  fileUrl: z.string().optional(),
  rawText: z.string().optional(),
  status: z.enum(['pending','preliminary','final','corrected']).optional(),
});
const updateLabReportSchema = createLabReportSchema.partial();
module.exports = { createLabReportSchema, updateLabReportSchema };
