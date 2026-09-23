type TitledProject = { title: string }

const excludedHomepageProjectTitles = new Set(["mira secret"])

export function selectHomepageProjects<T extends TitledProject>(projects: readonly T[]) {
  return projects
    .filter((project) => !excludedHomepageProjectTitles.has(project.title.trim().toLowerCase().replace(/\s+/g, " ")))
    .slice(0, 2)
}
