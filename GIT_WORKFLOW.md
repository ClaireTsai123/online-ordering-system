# Git Workflow Guide

## Creating and Pushing a New Branch to GitHub

### Method 1: Create Branch Locally and Push

```bash
# 1. Make sure you're on the main/master branch and it's up to date
git checkout main  # or 'master' depending on your default branch
git pull origin main

# 2. Create a new branch
git checkout -b feature/docker-setup

# 3. Add your changes
git add .

# 4. Commit your changes
git commit -m "Add Docker containerization for all services"

# 5. Push the new branch to GitHub
git push -u origin feature/docker-setup
```

The `-u` flag sets up tracking so future `git push` and `git pull` commands work without specifying the remote branch.

### Method 2: Create Branch from Current State

```bash
# 1. Create and switch to new branch (keeps your current changes)
git checkout -b feature/docker-setup

# 2. Add and commit changes
git add .
git commit -m "Add Docker containerization for all services"

# 3. Push to GitHub
git push -u origin feature/docker-setup
```

### Method 3: Create Branch on GitHub First

1. Go to your GitHub repository
2. Click the branch dropdown (usually says "main" or "master")
3. Type the new branch name (e.g., `feature/docker-setup`)
4. Click "Create branch: feature/docker-setup from 'main'"
5. Then locally:

```bash
# Fetch the new branch from GitHub
git fetch origin

# Checkout the remote branch
git checkout feature/docker-setup

# Make your changes, then add and commit
git add .
git commit -m "Add Docker containerization for all services"

# Push your changes
git push
```

---

## Complete Workflow Example

Here's a complete example for pushing the Docker changes:

```bash
# 1. Check current status
git status

# 2. Create new branch for Docker setup
git checkout -b feature/docker-containerization

# 3. Stage all changes
git add .

# 4. Commit with descriptive message
git commit -m "Add Docker containerization

- Create Dockerfiles for all backend services
- Add docker-compose.yml for orchestration
- Add Docker-specific application configs
- Add frontend Dockerfile with Nginx
- Add comprehensive Docker documentation"

# 5. Push to GitHub
git push -u origin feature/docker-containerization
```

---

## Useful Git Commands

### Check Current Branch
```bash
git branch
# Shows all local branches, * indicates current branch
```

### List All Branches (Local + Remote)
```bash
git branch -a
```

### Switch Between Branches
```bash
git checkout branch-name
# or with newer Git versions:
git switch branch-name
```

### Delete a Branch
```bash
# Delete local branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name
```

### Rename Current Branch
```bash
git branch -m new-branch-name
```

### View Branch Differences
```bash
# Compare current branch with main
git diff main

# Compare with remote branch
git diff origin/main
```

---

## Creating a Pull Request

After pushing your branch:

1. Go to your GitHub repository
2. You'll see a banner: "feature/docker-setup had recent pushes"
3. Click "Compare & pull request"
4. Fill in the PR description
5. Click "Create pull request"

Or directly visit:
```
https://github.com/YOUR_USERNAME/online-ordering-system/compare/main...feature/docker-setup
```

---

## Best Practices

### Branch Naming Conventions

- `feature/` - New features (e.g., `feature/docker-setup`)
- `bugfix/` or `fix/` - Bug fixes (e.g., `bugfix/login-error`)
- `hotfix/` - Urgent production fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `test/` - Adding tests

### Commit Messages

Use clear, descriptive commit messages:

```bash
# Good
git commit -m "Add Docker containerization for all services"

# Better (multi-line)
git commit -m "Add Docker containerization for all services

- Create Dockerfiles for all backend services
- Add docker-compose.yml for orchestration
- Add Docker-specific application configs
- Add comprehensive Docker documentation"
```

### Before Pushing

1. **Check what you're committing:**
   ```bash
   git status
   git diff
   ```

2. **Make sure tests pass** (if you have them)

3. **Review your changes:**
   ```bash
   git log --oneline -5  # See last 5 commits
   ```

---

## Troubleshooting

### Branch Already Exists on Remote

If the branch already exists on GitHub:

```bash
# Fetch latest changes
git fetch origin

# Pull and merge remote changes
git pull origin feature/docker-setup
```

### Undo Last Commit (Before Push)

```bash
# Keep changes, undo commit
git reset --soft HEAD~1

# Discard changes, undo commit
git reset --hard HEAD~1
```

### Push Rejected

If push is rejected, you may need to pull first:

```bash
git pull origin feature/docker-setup --rebase
git push
```

### Accidentally Committed to Wrong Branch

```bash
# Stash or commit your changes first
git commit -m "WIP: Docker setup"

# Switch to correct branch
git checkout feature/docker-setup

# Cherry-pick the commit
git cherry-pick <commit-hash>

# Or reset the wrong branch
git checkout wrong-branch
git reset --hard HEAD~1
```

---

## Quick Reference

```bash
# Create and switch to new branch
git checkout -b branch-name

# Add all changes
git add .

# Commit
git commit -m "Your message"

# Push new branch
git push -u origin branch-name

# Check status
git status

# View changes
git diff
```

