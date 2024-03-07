export const parseProject = (project) => {
  return {
    ...project,
    settings: JSON.parse(project.settings),
    metadata: JSON.parse(project.metadata),
    role: project.role ? JSON.parse(project.role) : []
  }
}

export const parseProjects = (projects) => {
  return projects.map((project) => {
    return {
      ...project,
      settings: JSON.parse(project.settings),
      metadata: JSON.parse(project.metadata),
      role: project.role ? JSON.parse(project.role) : []
    }
  })
}
