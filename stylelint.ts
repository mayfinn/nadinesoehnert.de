import { relative, resolve } from "@std/path";
import stylelint from "stylelint";
import stylelintConfigRecommended from "stylelint-config-standard";
import stylelintOrder from "stylelint-order";
import stylelintConfigIdiomaticOrder from "stylelint-config-idiomatic-order";
import { parseArgs } from "@std/cli";

// parse arguments
const flags = parseArgs(Deno.args, {
  boolean: ["fix"],
  default: { fix: false },
});

// make sure cache file exists
try {
  await Deno.stat(".stylelintcache");
} catch {
  await Deno.writeTextFile(".stylelintcache", "");
}

// run
const { results } = await stylelint.lint({
  config: {
    plugins: [
      stylelintOrder,
    ],
    rules: {
      ...stylelintConfigRecommended.rules,
      ...stylelintConfigIdiomaticOrder.rules,
      "indentation": 2,
      "max-nesting-depth": 3,
      "property-no-vendor-prefix": true,
      "max-empty-lines": 2,
      "function-calc-no-unspaced-operator": true,
      "string-quotes": "double",
      "no-duplicate-selectors": true,
      "color-hex-case": "upper",
      "color-named": "never",
      "selector-max-id": 0,
      "selector-combinator-space-after": "always",
      "declaration-block-trailing-semicolon": "always",
      "declaration-colon-space-before": "never",
      "declaration-colon-space-after": "always",
      "rule-empty-line-before": "always-multi-line",
      "media-feature-range-operator-space-before": "always",
      "media-feature-range-operator-space-after": "always",
      "media-feature-parentheses-space-inside": "never",
      "media-feature-colon-space-before": "never",
      "media-feature-colon-space-after": "always",
    },
  },
  files: "src/**/*.css",
  cacheLocation: ".stylelintcache",
  fix: flags.fix,
});

// process
const issues: string[] = [];
const deprecationWarnings = new Set<string>();

const __dirname = resolve();
results.forEach(({ deprecations, errored, source, warnings }) => {
  if (errored && source) {
    const outputPath = relative(__dirname, source);
    issues.push(outputPath);

    warnings.forEach(({ column, line, text }) => {
      issues.push(` ${line}:${column}  *  ${text}`);
    });
    issues.push("");
  }
  deprecations.forEach(({ text }) => {
    deprecationWarnings.add(text);
  });
});

// output
if (deprecationWarnings.size) {
  console.log("Deprecation warnings:");
  deprecationWarnings.forEach((element) => {
    console.log(` - ${element}`);
  });
  console.log("\n");
}

if (issues.length) {
  console.log(issues.join("\n"));
  Deno.exit(1);
}
