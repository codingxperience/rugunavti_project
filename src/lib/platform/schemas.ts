import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z.string().min(3, "Enter your full name."),
  emailOrPhone: z.string().min(5, "Enter an email address or phone number."),
  category: z.string().min(2, "Choose a support category."),
  message: z.string().min(20, "Provide enough detail for the team to help."),
});

export const applicationFormSchema = z.object({
  fullName: z.string().min(3, "Enter the applicant's full name."),
  email: z.string().email("Enter a valid email address."),
  whatsapp: z.string().min(9, "Enter a valid phone or WhatsApp number."),
  nationality: z.string().min(2, "Select a nationality."),
  preferredLevel: z.string().min(2, "Select an award level."),
  preferredIntake: z.string().min(2, "Select an intake."),
  firstChoice: z.string().min(2, "Select a first programme choice."),
  secondChoice: z.string().optional(),
  studyMode: z.string().min(2, "Select a study mode."),
  goals: z.string().min(20, "Tell admissions a little about your goals."),
  previousSchool: z.string().min(2, "Enter your previous school or institution."),
  highestQualification: z.string().min(2, "Select a qualification."),
  yearCompleted: z.string().regex(/^\d{4}$/, "Enter a valid completion year."),
});

export const verificationSchema = z.object({
  code: z.string().min(6, "Enter a verification code."),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type ApplicationFormInput = z.infer<typeof applicationFormSchema>;
export type VerificationInput = z.infer<typeof verificationSchema>;
