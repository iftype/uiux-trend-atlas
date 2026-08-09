import assert from "node:assert/strict";
import { evaluateRobots, parseRobots } from "./lib/robots.mjs";

const policy = `
User-agent: *
Disallow: /private/
Allow: /private/public$

User-agent: uiux-trend-atlas
Disallow: /feeds/
Allow: /feeds/public/
Disallow: /*?preview=1$
`;

assert.equal(parseRobots(policy).length, 2);
assert.deepEqual(
  evaluateRobots(policy, new URL("https://example.com/feeds/public/latest.xml"), "uiux-trend-atlas"),
  { allowed: true, matchedRule: "Allow: /feeds/public/" },
);
assert.deepEqual(
  evaluateRobots(policy, new URL("https://example.com/feeds/private.xml"), "uiux-trend-atlas"),
  { allowed: false, matchedRule: "Disallow: /feeds/" },
);
assert.deepEqual(
  evaluateRobots(policy, new URL("https://example.com/anything?preview=1"), "uiux-trend-atlas"),
  { allowed: false, matchedRule: "Disallow: /*?preview=1$" },
);
assert.equal(
  evaluateRobots("User-agent: *\nDisallow: /private\nAllow: /private", new URL("https://example.com/private"), "bot").allowed,
  true,
);
assert.equal(
  evaluateRobots("User-agent: OtherBot\nDisallow: /", new URL("https://example.com/"), "bot").allowed,
  true,
);
assert.equal(
  evaluateRobots("User-agent: *\nDisallow: /foo/bar/baz", new URL("https://example.com/foo/bar/%62%61%7A"), "bot").allowed,
  false,
);
assert.equal(
  evaluateRobots("User-agent: *\nDisallow: /한글", new URL("https://example.com/한글"), "bot").allowed,
  false,
);

console.log("robots.txt policy tests passed");
