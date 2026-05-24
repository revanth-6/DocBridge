const { z } = require('zod');

const createPrescriptionSchema = z.object({
  consultationId: z.string().uuid().optional().nullable(),
  familyMemberId: z.string().uuid().optional().nullable(),
  medicineName: z.string().min(1, 'Medicine name is required').max(200),
  genericName: z.string().max(200).optional(),
  dosage: z.string().min(1, 'Dosage is required').max(100),
  frequency: z.string().min(1, 'Frequency is required').max(100),
  durationDays: z.number().int().positive().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().nullable(),
  instructions: z.string().optional(),
  purpose: z.string().optional(),
  purposeSimplified: z.string().optional(),
  isActive: z.boolean().optional(),
  refillNeeded: z.boolean().optional(),
  refillDate: z.string().optional().nullable(),
  prescribingDoctor: z.string().max(200).optional(),
  pharmacyNotes: z.string().optional(),
  sideEffectWarnings: z.array(z.string()).optional(),
  foodInteractions: z.array(z.string()).optional(),
});

const updatePrescriptionSchema = createPrescriptionSchema.partial();

const createSideEffectSchema = z.object({
  effectDescription: z.string().min(1, 'Description is required'),
  severity: z.enum(['mild', 'moderate', 'severe']),
  onsetDate: z.string().min(1, 'Onset date is required'),
  resolvedDate: z.string().optional().nullable(),
  isResolved: z.boolean().optional(),
  actionTaken: z.string().optional(),
  doctorNotified: z.boolean().optional(),
});

const updateSideEffectSchema = createSideEffectSchema.partial();

module.exports = { createPrescriptionSchema, updatePrescriptionSchema, createSideEffectSchema, updateSideEffectSchema };
