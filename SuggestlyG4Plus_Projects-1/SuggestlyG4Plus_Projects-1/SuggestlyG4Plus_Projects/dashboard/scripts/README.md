# Dashboard Enhancement Scripts

This directory contains scripts to spawn multiple Claude Code subagents that work in parallel to enhance your dashboard project.

## Quick Start

### Windows
```cmd
parallel-enhancement.bat
```

### Linux/Mac
```bash
chmod +x parallel-enhancement.sh
./parallel-enhancement.sh
```

## What These Scripts Do

The scripts spawn **6 AI agents** that work simultaneously on:

1. **Testing** - Add comprehensive test coverage
2. **UI/UX** - Enhance user interface and experience
3. **Code Quality** - Improve type safety and refactoring
4. **Documentation** - Create comprehensive docs
5. **Performance & Security** - Optimize and secure
6. **Features** - Add new functionality

## Prerequisites

1. **Claude Code CLI** must be installed:
   ```bash
   npm install -g @anthropic-ai/claude-code
   claude auth login
   ```

2. **Git** - For backing up before running

## Usage

1. **Backup your work:**
   ```bash
   git add . && git commit -m "Pre-enhancement backup"
   ```

2. **Run the script:**
   ```bash
   cd scripts
   parallel-enhancement.bat  # Windows
   # or
   ./parallel-enhancement.sh  # Linux/Mac
   ```

3. **Monitor progress:**
   ```bash
   # In another terminal
   tail -f enhancement-logs/*.json
   ```

4. **Review results:**
   ```bash
   type ..\enhancement-results\SUMMARY.md  # Windows
   # or
   cat ../enhancement-results/SUMMARY.md  # Linux/Mac
   ```

## Output

- **Logs**: `enhancement-logs/agent*.json`
- **Summary**: `enhancement-results/SUMMARY.md`
- **Changes**: Check with `git status` and `git diff`

## Cost

- Approximately $3-10 USD for all 6 agents
- Each agent runs up to 15 turns
- Total: ~90 turns across all agents

## Customization

### Run Fewer Agents

Edit the script and comment out agents you don't need:

**Windows (parallel-enhancement.bat):**
```batch
REM echo "✨ Agent 6: Adding new features..."
REM start /B cmd /c "claude -p ..."
```

**Linux/Mac (parallel-enhancement.sh):**
```bash
# echo "✨ Agent 6: Adding new features..."
# (
#   claude -p ...
# ) &
```

### Adjust Complexity

Change `--max-turns` for each agent:
- Simple: `--max-turns 5`
- Medium: `--max-turns 10`
- Complex: `--max-turns 20`

### Add Custom Agent

Copy an agent block and customize:

**Windows:**
```batch
echo "🎯 Agent 7: Custom task..."
start /B cmd /c "claude -p "Your instructions..." --permission-mode acceptEdits --max-turns 15 --output-format json > enhancement-logs/agent7-custom.json 2>&1"
```

**Linux/Mac:**
```bash
echo "🎯 Agent 7: Custom task..."
(
  cd "$(dirname "$0")/.." || exit
  claude -p "Your instructions..." \
    --permission-mode acceptEdits \
    --max-turns 15 \
    --output-format json > enhancement-logs/agent7-custom.json 2>&1
) &
AGENT7_PID=$!
```

## Dashboard-Specific Agents

### Agent 1: Testing
- Tests for analytics components
- Tests for camera grid
- Tests for AI assistant
- Tests for authentication
- Tests for WebSocket connections

### Agent 2: UI/UX
- Enhanced analytics visualizations
- Improved camera grid layout
- Better loading states
- Mobile responsiveness
- Accessibility improvements

### Agent 3: Code Quality
- TypeScript type safety
- Error handling
- Code refactoring
- JSDoc documentation
- Validation utilities

### Agent 4: Documentation
- README enhancements
- Component documentation
- API documentation
- Architecture diagrams
- Deployment guide

### Agent 5: Performance & Security
- Code splitting
- Security headers
- WebSocket optimization
- Caching strategies
- Rate limiting

### Agent 6: New Features
- Analytics export (CSV/PDF)
- Advanced filtering
- Notification system
- User settings page
- Keyboard shortcuts

## Monitoring

### Real-time Progress

**Windows:**
```cmd
type enhancement-logs\agent1-testing.json
```

**Linux/Mac:**
```bash
tail -f enhancement-logs/agent1-testing.json
```

### Check Completion

```bash
# See what changed
git status

# Review changes
git diff

# Read summary
cat enhancement-results/SUMMARY.md
```

## After Completion

1. **Review changes:**
   ```bash
   git diff
   ```

2. **Run tests:**
   ```bash
   npm test
   npm run build
   ```

3. **Test locally:**
   ```bash
   npm run dev
   ```

4. **Commit good changes:**
   ```bash
   git add <files>
   git commit -m "Applied parallel enhancements"
   ```

## Troubleshooting

### Claude CLI Not Found
```bash
npm install -g @anthropic-ai/claude-code
claude auth login
```

### Permission Denied (Linux/Mac)
```bash
chmod +x parallel-enhancement.sh
```

### Agents Not Starting
```bash
# Check authentication
claude auth status

# Check if claude is in PATH
which claude  # Linux/Mac
where claude  # Windows
```

### High Costs
Reduce agents or lower `--max-turns`:
```bash
# Run only 3 agents with 10 turns each
# Comment out agents 4, 5, 6
# Change --max-turns 15 to --max-turns 10
```

## Safety

✅ Agents only edit files (no command execution)
✅ Turn limits prevent runaway costs
✅ Full logging for audit trail
✅ Git-friendly (easy to review/rollback)
✅ Isolated tasks (agents work independently)

## Best Practices

1. **Always backup first** - Commit before running
2. **Review changes** - Don't blindly accept
3. **Test thoroughly** - Run full test suite
4. **Start small** - Try 2-3 agents first
5. **Monitor costs** - Check Claude dashboard

## Support

- **Main Guide**: `../PARALLEL-ENHANCEMENT-GUIDE.md`
- **Setup Info**: `../ENHANCEMENT-SETUP-COMPLETE.md`
- **Claude CLI**: [Claude Code docs](https://docs.anthropic.com/claude/docs)

## License

Same as the main dashboard project.
