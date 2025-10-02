#!/bin/bash

echo "=== Build Performance Monitor ==="
echo "Starting build at: $(date)"

# Start timer
start_time=$(date +%s.%N)

# Run build command
npm run build

# End timer
end_time=$(date +%s.%N)

# Calculate duration
duration=$(echo "$end_time - $start_time" | bc)

echo "Build completed at: $(date)"
echo "Total build time: ${duration} seconds"

# Log to file
echo "$(date), ${duration}" >> build-times.log

echo "Build time logged to build-times.log"
