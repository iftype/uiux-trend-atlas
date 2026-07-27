import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dataPath = resolve(root, "data/open-source-stack.json");
const data = JSON.parse(await readFile(dataPath, "utf8"));
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const headers = {
  accept: "application/vnd.github+json",
  "user-agent": "uiux-trend-atlas/1.0 (+https://github.com/iftype/uiux-trend-atlas)",
  "x-github-api-version": "2022-11-28",
  ...(token ? { authorization: `Bearer ${token}` } : {}),
};

let healthy = 0;
const projects = await Promise.all(data.projects.map(updateProject));

if (healthy === 0) {
  throw new Error("Every GitHub repository metadata request failed. Existing open-source data was left untouched.");
}

const output = {
  ...data,
  verifiedAt: new Date().toISOString().slice(0, 10),
  stats: {
    projects: projects.length,
    healthy,
    archived: projects.filter((project) => project.archived).length,
  },
  projects,
};

await writeFile(dataPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(`Updated ${healthy}/${projects.length} open-source project records.`);

async function updateProject(project) {
  try {
    const [repository, release] = await Promise.all([
      github(`/repos/${project.repo}`),
      github(`/repos/${project.repo}/releases/latest`, true),
    ]);
    healthy += 1;
    return {
      ...project,
      stars: repository.stargazers_count,
      pushedAt: repository.pushed_at?.slice(0, 10) ?? project.pushedAt,
      archived: repository.archived,
      latestRelease: release?.tag_name ?? project.latestRelease,
    };
  } catch (error) {
    console.warn(`Repository metadata failed: ${project.repo} — ${error instanceof Error ? error.message : String(error)}`);
    return project;
  }
}

async function github(path, allowNotFound = false) {
  const response = await fetch(`https://api.github.com${path}`, { headers });
  if (allowNotFound && response.status === 404) return null;
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
