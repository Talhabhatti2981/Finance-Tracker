<#
Purge .env from git history and push cleaned history to your fork.

Usage: run from repo root in PowerShell as an interactive script:
  powershell -ExecutionPolicy Bypass -File .\scripts\purge_env.ps1 -Branch main

This script will:
 - Create a local backup branch `pre-remove-env-backup`
 - Try to fork the repo using `gh` (if available) and add remote `fork`
 - Ensure `git-filter-repo` is installed (attempt `python -m pip install --user git-filter-repo`)
 - Run the purge: remove `.env` from all commits
 - Run repo cleanup (reflog expire, gc)
 - Force-push cleaned `main` to the `fork` remote

Important: you MUST rotate/revoke the leaked Supabase secret in the Supabase dashboard BEFORE OR IMMEDIATELY AFTER running this.
Also: rewriting history requires force-push and collaborators must re-clone.
#>

param(
  [string]$Branch = 'main'
)

function Run-Command($cmd) {
  Write-Host "=> $cmd"
  $proc = Start-Process -FilePath pwsh -ArgumentList "-NoProfile","-Command","$cmd" -NoNewWindow -PassThru -Wait -RedirectStandardOutput STDOUT -RedirectStandardError STDERR
  return $proc.ExitCode
}

Write-Host "Script started. Repo root: $(Get-Location)" -ForegroundColor Cyan

# 1) Confirm branch
$current = git rev-parse --abbrev-ref HEAD
Write-Host "Current branch: $current"
if ($current -ne $Branch) {
  Write-Host "Checking out branch $Branch"
  git checkout $Branch
}

# 2) Backup
if (-not (git show-ref --verify --quiet refs/heads/pre-remove-env-backup)) {
  git branch pre-remove-env-backup
  Write-Host "Created backup branch 'pre-remove-env-backup'"
} else {
  Write-Host "Backup branch 'pre-remove-env-backup' already exists"
}

# 3) Detect origin URL and owner/repo
$originUrl = git remote get-url origin
Write-Host "Origin URL: $originUrl"

if ($originUrl -match '[:/]([^/]+/[^/.]+)(?:\.git)?$') {
  $ownerRepo = $Matches[1]
  Write-Host "Detected repository: $ownerRepo"
} else {
  Write-Host "Could not parse origin URL. Please ensure origin is set. Aborting." -ForegroundColor Red
  exit 1
}

# 4) Fork using gh if available
if (Get-Command gh -ErrorAction SilentlyContinue) {
  Write-Host "Found GitHub CLI (gh). Attempting to fork and add remote 'fork'..."
  gh repo fork $ownerRepo --remote=true --clone=false | Out-Null
  if ((git remote) -match 'fork') { Write-Host "Remote 'fork' present" } else { Write-Host "Added remote 'fork' via gh" }
} else {
  Write-Host "GitHub CLI 'gh' not found. Please create a fork of $ownerRepo manually and add it as remote named 'fork' before proceeding. Example:" -ForegroundColor Yellow
  Write-Host "  git remote add fork https://github.com/<your-username>/$($ownerRepo.Split('/')[1]).git"
}

# 5) Require confirmation before destructive rewrite
Write-Host "IMPORTANT: This will rewrite git history and force-push. Collaborators must re-clone after."
Write-Host "You MUST rotate the leaked Supabase key in Supabase dashboard before or immediately after this step."
$confirm = Read-Host "Type YES to proceed with purging .env from history and pushing to 'fork'"
if ($confirm -ne 'YES') { Write-Host "Aborted by user"; exit 2 }

# 6) Ensure git-filter-repo is available
$filterRepoAvailable = $false
if (Get-Command python -ErrorAction SilentlyContinue) {
  try {
    python -m git_filter_repo --version > $null 2>&1
    $filterRepoAvailable = $LASTEXITCODE -eq 0
  } catch { $filterRepoAvailable = $false }
  if (-not $filterRepoAvailable) {
    Write-Host "Installing git-filter-repo via pip..."
    python -m pip install --user git-filter-repo
    try { python -m git_filter_repo --version > $null 2>&1; $filterRepoAvailable = $LASTEXITCODE -eq 0 } catch { $filterRepoAvailable = $false }
  }
}

if (-not $filterRepoAvailable) {
  Write-Host "git-filter-repo not available. Please install Python and run: python -m pip install --user git-filter-repo" -ForegroundColor Red
  Write-Host "Alternatively, install Java and use BFG. Aborting." -ForegroundColor Red
  exit 3
}

# 7) Run the purge
Write-Host "Running git-filter-repo to remove .env from all commits..."
python -m git_filter_repo --invert-paths --paths .env
if ($LASTEXITCODE -ne 0) { Write-Host "git-filter-repo failed" -ForegroundColor Red; exit 4 }

# 8) Cleanup
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 9) Push to fork
if ((git remote) -match 'fork') {
  Write-Host "Force-pushing cleaned branch to 'fork'/$Branch"
  git push --force fork $Branch
} else {
  Write-Host "Remote 'fork' not found. Please add your fork as remote 'fork' then run: git push --force fork $Branch" -ForegroundColor Yellow
}

Write-Host "Done. Verify the forks GitHub repo and that .env no longer appears in history. Rotate any leaked keys if you haven't already." -ForegroundColor Green
