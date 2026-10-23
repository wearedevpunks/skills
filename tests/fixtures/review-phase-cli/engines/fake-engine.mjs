// Fake `claude` / `codex` CLI for review.mjs tests. Each sibling shim is named
// `<engine>-<behavior>` and imports this module; the vendored autoreview helper
// reaches it through CLAUDE_BIN / CODEX_BIN and parses its output unchanged.
import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

const [engine, ...rest] = basename(process.argv[1]).split("-");
const behavior = rest.join("-");
const args = process.argv.slice(2);

// Startup probes the helper runs before a review.
if (args[0] === "--version") {
  console.log(engine === "claude" ? "2.1.999 (Claude Code)" : "codex-cli 0.999.0");
  process.exit(0);
}
if (args[0] === "--help") {
  console.log("--safe-mode --setting-sources --strict-mcp-config --disallowedTools --tools");
  process.exit(0);
}
if (args[0] === "login") {
  console.log("Logged in using ChatGPT");
  process.exit(0);
}

const prompt = readFileSync(0, "utf8");
const axis = /FAKE-AXIS: (\w+)/u.exec(prompt)?.[1];

const fail = () => {
  console.error(`fake ${engine}: simulated quota failure`);
  process.exit(3);
};
if (behavior === "fail" || behavior === `fail-${axis}`) fail();
if (behavior === "sleep") {
  setTimeout(() => process.exit(0), 60_000);
} else {
  const findings = behavior === "findings"
    ? [{
      title: "Upload path joins user input",
      body: "src/app.mjs builds a path from unchecked input.",
      priority: "P1",
      confidence: 0.9,
      category: "security",
      code_location: { file_path: "src/app.mjs", line: 1 },
      source_attribution: null,
    }]
    : [];
  const report = JSON.stringify({
    findings,
    overall_correctness: findings.length > 0 ? "patch is incorrect" : "patch is correct",
    overall_explanation: `fake ${engine} ${behavior} review`,
    overall_confidence: 0.8,
    review_completion: behavior === "partial" ? "incomplete" : "complete",
  });
  if (engine === "claude") {
    console.log(report);
  } else {
    // codex exec --json streams events; the report goes to --output-last-message.
    writeFileSync(args[args.indexOf("--output-last-message") + 1], report);
    const input = behavior === "heavy" ? 40_000_000 : 1200;
    console.log(JSON.stringify({ type: "turn.started" }));
    console.log(JSON.stringify({
      type: "turn.completed",
      usage: { input_tokens: input, cached_input_tokens: 0, output_tokens: 300, reasoning_output_tokens: 100 },
    }));
  }
}
