
import { ESLint } from "eslint";
import path from "path";

(async function main() {
  console.log("Starting lint agent...");

  try {
    // 1. Create an instance of ESLint with the configuration from .eslintrc.json
        const eslint = new ESLint({ cache: true });

    // 2. Lint files. This will find all .js files in the project.
    const results = await eslint.lintFiles(["**/*.js"]);

    // 3. Format the results.
    const formatter = await eslint.loadFormatter("stylish");
    const resultText = await formatter.format(results);

    // 4. Output the results.
    if (resultText) {
      console.log("Linting issues found:");
      console.log(resultText);
    } else {
      console.log("No linting issues found. Great job!");
    }

    // 5. Check if there are any errors
    const hasErrors = results.some(result => result.errorCount > 0);
    if (hasErrors) {
      console.error("\nLint agent finished with errors.");
      process.exit(1); // Exit with a non-zero status code to indicate failure
    } else {
      console.log("\nLint agent finished successfully.");
    }

  } catch (error) {
    console.error("An error occurred while running the lint agent:");
    console.error(error);
    process.exit(1);
  }
})();
