import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const paths = [
  resolve(root, "public/data/foreign-updates.json"),
  resolve(root, "app/generated/foreign-updates.json"),
];
const forbiddenFields = new Set(["content", "description", "feedText", "html", "summary"]);

for (const path of paths) {
  const data = JSON.parse(await readFile(path, "utf8"));
  assert.equal(data.schemaVersion, 2, `${path}: schemaVersion must be 2`);
  assert.equal(data.collectionPolicy, "metadata-only", `${path}: collectionPolicy must be metadata-only`);
  assert.equal(data.stats.robotsAllowedFeeds <= data.stats.feedSources, true, `${path}: invalid robots stats`);

  const articleRecords = [
    ...data.articles,
    ...data.sources.flatMap((source) => source.articles),
  ];
  for (const article of articleRecords) {
    for (const field of forbiddenFields) {
      assert.equal(Object.hasOwn(article, field), false, `${path}: persisted forbidden field ${field}`);
    }
    assert.match(article.url, /^https?:\/\//, `${path}: article URL must be absolute`);
  }

  for (const source of data.sources) {
    assert.match(source.robots?.status ?? "", /^(allowed|blocked)$/, `${path}: source must include a robots audit status`);
    if (source.robots.status === "blocked") {
      assert.equal(source.articles.length, 0, `${path}: blocked source must not retain articles`);
    }
  }
}

console.log("generated metadata-only policy tests passed");
