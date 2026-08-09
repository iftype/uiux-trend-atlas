const DIRECTIVES = new Set(["allow", "disallow"]);

export function parseRobots(text) {
  const groups = [];
  let agents = [];
  let rules = [];
  let hasRules = false;

  const flush = () => {
    if (agents.length > 0) groups.push({ agents, rules });
    agents = [];
    rules = [];
    hasRules = false;
  };

  for (const rawLine of text.replace(/^\uFEFF/, "").split(/\r?\n/)) {
    const line = rawLine.split("#", 1)[0].trim();
    if (!line) continue;
    const separator = line.indexOf(":");
    if (separator === -1) continue;

    const directive = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();

    if (directive === "user-agent") {
      if (hasRules) flush();
      if (value) agents.push(value.toLowerCase());
      continue;
    }

    if (!DIRECTIVES.has(directive) || agents.length === 0) continue;
    hasRules = true;
    if (value) rules.push({ directive, pattern: value });
  }

  flush();
  return groups;
}

export function evaluateRobots(text, targetUrl, productToken) {
  const groups = parseRobots(text);
  const token = productToken.toLowerCase();
  const exactGroups = groups.filter((group) => group.agents.includes(token));
  const selectedGroups = exactGroups.length > 0
    ? exactGroups
    : groups.filter((group) => group.agents.includes("*"));
  const path = normalizeForMatch(`${targetUrl.pathname || "/"}${targetUrl.search}`);
  const matches = selectedGroups
    .flatMap((group) => group.rules)
    .filter((rule) => matchesPattern(path, rule.pattern))
    .map((rule) => ({ ...rule, specificity: ruleSpecificity(rule.pattern) }))
    .sort((a, b) => b.specificity - a.specificity || Number(b.directive === "allow") - Number(a.directive === "allow"));

  const match = matches[0] ?? null;
  return {
    allowed: match?.directive !== "disallow",
    matchedRule: match ? `${capitalize(match.directive)}: ${match.pattern}` : null,
  };
}

function matchesPattern(path, pattern) {
  const normalizedPattern = normalizeForMatch(pattern);
  const endAnchored = normalizedPattern.endsWith("$");
  const body = endAnchored ? normalizedPattern.slice(0, -1) : normalizedPattern;
  const expression = body
    .split("*")
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join(".*");
  return new RegExp(`^${expression}${endAnchored ? "$" : ""}`).test(path);
}

function ruleSpecificity(pattern) {
  return Buffer.byteLength(normalizeForMatch(pattern).replace(/\*/g, "").replace(/\$$/, ""), "utf8");
}

function normalizeForMatch(value) {
  return value
    .replace(/%([0-9a-f]{2})/gi, (encoded, hex) => {
      const character = String.fromCharCode(Number.parseInt(hex, 16));
      return /[a-z0-9._~-]/i.test(character) ? character : encoded.toUpperCase();
    })
    .replace(/[^\x00-\x7F]/g, (character) => encodeURIComponent(character));
}

function capitalize(value) {
  return `${value[0].toUpperCase()}${value.slice(1)}`;
}
