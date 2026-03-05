export const shouldEscalate = (report) => {
  return report.severityScore >= 0.75;
};
