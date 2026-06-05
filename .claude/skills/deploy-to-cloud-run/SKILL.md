---
name: deploy-to-cloud-run
description: Set up GitHub Actions to automatically deploy the React portfolio to Google Cloud Run on every push to main branch
---

# Deploy to Cloud Run

Automatically deploy your portfolio to Google Cloud Run whenever code is pushed to the main branch.

## What This Skill Does

- Creates a GitHub Actions workflow file (`.github/workflows/deploy-to-cloud-run.yml`)
- Builds the React app with Vite
- Creates a Docker image and pushes it to Google Container Registry (GCR)
- Deploys the image to your existing Cloud Run service
- Runs on every push to the `main` branch

## Prerequisites

Before running this skill, ensure you have:

- [ ] Google Cloud project with billing enabled
- [ ] Service account with Cloud Run Admin and GCR permissions
- [ ] Service account key (JSON) downloaded
- [ ] Google Container Registry (GCR) repository created (`gcr.io/PROJECT_ID/portfolio`)
- [ ] Cloud Run service created (`gustavopro-portfolio` or your service name)
- [ ] GitHub repository set up with access to secrets

## Setup Steps

### 1. Configure GitHub Secrets

Before providing the workflow file, ask the user to confirm they have completed the setup steps and added the required secrets to their GitHub repository.

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

- `GCP_PROJECT_ID`: Your GCP project ID
- `GCP_SA_KEY`: Service account JSON key (base64 encoded, full content)
- `GCR_REPOSITORY`: Full GCR path (e.g., `gcr.io/my-project/portfolio`)
- `CLOUD_RUN_SERVICE`: Your Cloud Run service name
- `CLOUD_RUN_REGION`: GCP region (e.g., `us-central1`)

**To encode the service account key:**
```bash
cat ~/path/to/service-account-key.json | base64 -w 0
```

### 2. Create Dockerfile

Ensure a `Dockerfile` exists in the project root:

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g http-server
COPY --from=build /app/dist ./dist
EXPOSE 8080
CMD ["http-server", "dist", "-p", "8080", "--gzip", "-c-1"]
```

### 3. Generate Workflow File

Create the GitHub Actions workflow file at `.github/workflows/deploy-to-cloud-run.yml` with:
- Node 20 build environment
- Detect the package manager used in the repository (npm, yarn, pnpm, or bun) and adjust the workflow and Dockerfile build instructions accordingly (default to npm if undetermined)
- Docker image creation and GCR push
- Cloud Run deployment (use the google-github-actions/deploy-cloudrun action)

### 4. Verify Deployment

After pushing to main:
1. Check GitHub Actions tab for workflow execution
2. Verify Cloud Run service URL is updated
3. Test the deployed application

## Example Prompts

- "Set up Cloud Run deployment workflow for this portfolio"
- "Create the GitHub Actions workflow file for deploying to Cloud Run"
- "Help me configure the deployment pipeline"

## Completion Checklist

- [ ] GitHub secrets configured
- [ ] Dockerfile in project root
- [ ] `.github/workflows/deploy-to-cloud-run.yml` created
- [ ] First deployment successful
- [ ] Cloud Run service shows new image deployed
