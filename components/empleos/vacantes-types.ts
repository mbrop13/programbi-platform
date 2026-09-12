export type VacantesFilters = {
  q: string;
  modality: string[];
  seniority: string[];
  employmentType: string[];
  skills: string[];
  sort: "recent" | "salary";
};
