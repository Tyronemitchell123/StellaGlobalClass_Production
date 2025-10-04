
import fs from 'fs/promises';
import path from 'path';

(async () => {
  console.log('Starting build agent...');

  try {
    const projectRoot = process.cwd();
    const reportsDir = path.join(projectRoot, 'reports');

    // 1. Remove the reports directory
    try {
      await fs.rm(reportsDir, { recursive: true, force: true });
      console.log(`Cleaned directory: ${reportsDir}`);
    } catch (error) {
      console.error(`Error cleaning directory ${reportsDir}:`, error);
    }

    // 2. Remove any .log files in the root
    const files = await fs.readdir(projectRoot);
    for (const file of files) {
      if (file.endsWith('.log')) {
        const logFilePath = path.join(projectRoot, file);
        try {
          await fs.unlink(logFilePath);
          console.log(`Removed log file: ${logFilePath}`);
        } catch (error) {
          console.error(`Error removing log file ${logFilePath}:`, error);
        }
      }
    }

    console.log('\nBuild agent finished successfully.');

  } catch (error) {
    console.error('An error occurred while running the build agent:');
    console.error(error);
    process.exit(1);
  }
})();
