
import jest from 'jest';
import path from 'path';

(async () => {
  console.log('Starting test agent...');

  try {
    const watch = process.argv.includes('--watch');
    const coverage = process.argv.includes('--coverage');

    const options = {
      projects: [path.resolve(process.cwd())],
      silent: false,
      watch,
      coverage,
      reporters: ['default'],
      testMatch: ['**/test-*.js'],
    };

    // Jest's runCLI returns a promise that resolves with the results
    const { results } = await jest.runCLI(options, options.projects);

    if (results.numFailedTests > 0 || results.numFailedTestSuites > 0) {
      console.error('\nTest agent finished with errors.');
      process.exit(1);
    } else {
      console.log('\nTest agent finished successfully.');
    }

  } catch (error) {
    console.error('An error occurred while running the test agent:');
    console.error(error);
    process.exit(1);
  }
})();
