import { projectService } from "@/services/project-service";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  try {
    const projects = await projectService.list();

    return (
      <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Projects</h1>
        <p style={{ marginBottom: "1rem", color: "#666" }}>
          Showing {projects.data.length} of {projects.meta.total} projects
        </p>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "0.5rem" }}>
                Name
              </th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "0.5rem" }}>
                Status
              </th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "0.5rem" }}>
                Owner
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.data.map((project) => (
              <tr key={project.id}>
                <td style={{ borderBottom: "1px solid #f0f0f0", padding: "0.5rem" }}>
                  {project.name}
                </td>
                <td style={{ borderBottom: "1px solid #f0f0f0", padding: "0.5rem" }}>
                  {project.status}
                </td>
                <td style={{ borderBottom: "1px solid #f0f0f0", padding: "0.5rem" }}>
                  {project.owner_id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return (
      <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Projects</h1>
        <p style={{ color: "#b00020", marginBottom: "0.75rem" }}>
          Failed to load projects from backend.
        </p>
        <pre
          style={{
            background: "#f8f8f8",
            border: "1px solid #eee",
            borderRadius: "6px",
            padding: "0.75rem",
            whiteSpace: "pre-wrap",
          }}
        >
          {message}
        </pre>
      </main>
    );
  }
}
