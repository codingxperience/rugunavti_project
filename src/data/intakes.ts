export const intakeScheduleHref = "/admissions#dates";

export const shortCourseIntakes = ["January", "April", "July", "October"] as const;
export const formalMainIntakes = ["January", "July / August"] as const;
export const formalLimitedIntake = "May";
export const rollingOnlineIntake = "Rolling enrolment";
export const noIntakePreference = "Admissions to advise";

export const shortCourseIntakeSummary = `${shortCourseIntakes.join(", ")}. ${rollingOnlineIntake} for selected online self-paced courses.`;
export const formalIntakeSummary = `${formalMainIntakes.join(" and ")} (main intakes), plus ${formalLimitedIntake} (limited mid-year intake).`;
export const formalAccreditationNote = "Formal programmes are planned to begin once accredited.";

export function getIntakePreferences(level?: string, studyMode?: string) {
  if (level === "Short Course") {
    return [
      noIntakePreference,
      ...shortCourseIntakes,
      ...(studyMode === "Online" ? [rollingOnlineIntake] : []),
    ];
  }

  if (level === "Certificate" || level === "Diploma" || level === "Bachelor's") {
    return [noIntakePreference, ...formalMainIntakes, formalLimitedIntake];
  }

  return [noIntakePreference];
}
