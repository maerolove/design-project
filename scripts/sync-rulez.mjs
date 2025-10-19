#!/usr/bin/env node
/**
 * Sync KolkhozIO/rulez materials into docs/rulez
 *
 * Supports two modes:
 *  - submodule: if .gitmodules declares docs/rulez, will init/update submodule
 *  - vendor (default): clones upstream and copies README, rules, examples
 *
 * Usage:
 *   node scripts/sync-rulez.mjs [--mode=submodule|vendor] [--repo=https://...]
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const projectRoot = process.cwd();
const docsRulezDir = path.join(projectRoot, 'docs', 'rulez');
const defaultRepo = 'https://github.com/KolkhozIO/rulez.git';

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { mode: null, repo: defaultRepo };
  for (const a of args) {
    if (a.startsWith('--mode=')) out.mode = a.split('=')[1];
    else if (a.startsWith('--repo=')) out.repo = a.split('=')[1];
  }
  return out;
}

function hasSubmoduleForRulez() {
  const gitmodules = path.join(projectRoot, '.gitmodules');
  if (!fs.existsSync(gitmodules)) return false;
  const content = fs.readFileSync(gitmodules, 'utf8');
  return /path\s*=\s*docs\/rulez/.test(content);
}

function isGitRepo(dir) {
  try {
    execSync('git rev-parse --is-inside-work-tree', { cwd: dir, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function run(cmd, opts = {}) {
  return execSync(cmd, { stdio: 'inherit', ...opts });
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function rimraf(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    const p = path.join(dir, entry);
    const stat = fs.lstatSync(p);
    if (stat.isDirectory()) {
      rimraf(p);
    } else {
      fs.unlinkSync(p);
    }
  }
  // Do not remove the top-level dir; just empty it
}

function copyRecursive(src, dst) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    ensureDir(dst);
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dst, entry));
    }
  } else {
    ensureDir(path.dirname(dst));
    fs.copyFileSync(src, dst);
  }
}

function updateSubmodule() {
  console.log('Detected .gitmodules entry for docs/rulez. Using submodule mode.');
  ensureDir(path.join(projectRoot, 'docs'));
  // Init and update submodule
  run('git submodule update --init --recursive docs/rulez', { cwd: projectRoot });
  // Try to fast-forward submodule to latest default branch
  try {
    run('git -C docs/rulez fetch --prune --tags', { cwd: projectRoot });
    // Try main then master
    try { run('git -C docs/rulez checkout -q main', { cwd: projectRoot }); } catch {}
    try { run('git -C docs/rulez checkout -q master', { cwd: projectRoot }); } catch {}
    run('git -C docs/rulez pull --ff-only', { cwd: projectRoot });
  } catch (e) {
    console.warn('Warning: could not update submodule to latest. It may be pinned to a specific commit.');
  }
  // Recursively update nested submodules (if any)
  try {
    run('git submodule update --recursive --init --remote docs/rulez', { cwd: projectRoot });
  } catch {}
  console.log('\nSubmodule docs/rulez is up to date. If there are changes, commit the updated submodule pointer.');
}

function updateVendor(repoUrl) {
  console.log('Using vendored mode. Cloning upstream to refresh docs/rulez...');
  ensureDir(docsRulezDir);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rulez-'));
  try {
    run(`git clone --depth=1 ${repoUrl} ${tmp}`);
  } catch (e) {
    console.error('Failed to clone upstream repository:', e.message || e);
    process.exitCode = 1;
    return;
  }

  // Clear current vendor content and copy subset
  rimraf(docsRulezDir);

  const toCopy = [
    { src: path.join(tmp, 'README.md'), dst: path.join(docsRulezDir, 'README.md') },
    { src: path.join(tmp, 'rules'), dst: path.join(docsRulezDir, 'rules') },
    { src: path.join(tmp, 'examples'), dst: path.join(docsRulezDir, 'examples') },
  ];

  for (const { src, dst } of toCopy) {
    if (!fs.existsSync(src)) continue;
    copyRecursive(src, dst);
  }

  console.log('Vendored docs/rulez refreshed from', repoUrl);
}

(function main() {
  const { mode: modeArg, repo } = parseArgs();
  const mode = modeArg || (hasSubmoduleForRulez() ? 'submodule' : 'vendor');

  if (mode === 'submodule') updateSubmodule();
  else updateVendor(repo);
})();
