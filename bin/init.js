#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const skillSource = path.join(__dirname, '..', 'skill.md');
const targetDir = path.join(process.cwd(), '.claude', 'skills');
const targetFile = path.join(targetDir, 'mostly-good-metrics.md');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.copyFileSync(skillSource, targetFile);
console.log('MostlyGoodMetrics skill installed to .claude/skills/mostly-good-metrics.md');
