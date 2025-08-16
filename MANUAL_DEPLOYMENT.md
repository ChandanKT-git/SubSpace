# Manual Deployment Guide for AI Chatbot Application

Since automated deployment to Netlify encountered issues, this guide provides step-by-step instructions to manually deploy your AI Chatbot application to Netlify.

## 1. Prerequisites

- **Netlify Account**: If you don't have one, sign up at [Netlify](https://www.netlify.com/).
- **Git and GitHub/GitLab/Bitbucket Account**: Your project needs to be in a Git repository (e.g., GitHub, GitLab, Bitbucket) for easy deployment with Netlify.
- **Node.js and npm/pnpm**: Ensure you have Node.js (LTS version recommended) and a package manager (npm or pnpm) installed on your local machine.

## 2. Project Setup (Local Machine)

If you don't have the project files locally, you'll need to get them. You can download the entire `chatbot-app` directory.

### 2.1 Install Dependencies

Navigate to the `chatbot-app` directory in your terminal and install the project dependencies:

```bash
cd path/to/your/chatbot-app
pnpm install # or npm install
```

### 2.2 Update Environment Variables

Create a `.env` file in the root of your `chatbot-app` directory (if it doesn't exist) and add your Nhost environment variables. These are crucial for your application to connect to your Nhost backend.

```env
REACT_APP_NHOST_SUBDOMAIN=wsyhhjiocamicltpcfdd
REACT_APP_NHOST_REGION=ap-south-1
REACT_APP_HASURA_GRAPHQL_URL=https://wsyhhjiocamicltpcfdd.hasura.ap-south-1.nhost.run/v1/graphql
REACT_APP_HASURA_GRAPHQL_WS_URL=wss://wsyhhjiocamicltpcfdd.hasura.ap-south-1.run/v1/graphql
```

### 2.3 Build the Application

Build the production-ready version of your React application. This will create an optimized `dist` folder.

```bash
pnpm run build # or npm run build
```

## 3. Deploying to Netlify

There are two primary ways to deploy to Netlify: via Git integration (recommended) or using the Netlify CLI.

### Option A: Deploy via Git (Recommended)

This is the easiest and most common method, as Netlify automatically deploys your site every time you push changes to your Git repository.

1.  **Push to Git Repository**: Ensure your `chatbot-app` project is pushed to a GitHub, GitLab, or Bitbucket repository.

2.  **Connect to Netlify**: 
    *   Log in to your [Netlify account](https://app.netlify.com/).
    *   Click on 



    *   Click on **"Add new site"** -> **"Import an existing project"**.
    *   Connect to your Git provider (GitHub, GitLab, or Bitbucket).
    *   Select the repository where you pushed your `chatbot-app` project.

3.  **Configure Build Settings**: Netlify will auto-detect your project. Ensure the following settings are correct:
    *   **Base directory**: `/` (or the path to your `chatbot-app` if it's a monorepo)
    *   **Build command**: `npm run build` (or `pnpm run build` if you used pnpm)
    *   **Publish directory**: `dist`

4.  **Add Environment Variables**: This is crucial for your deployed application to connect to Nhost. In Netlify, go to **Site settings** -> **Build & deploy** -> **Environment variables**.
    Add the following variables with your actual Nhost values:
    *   `REACT_APP_NHOST_SUBDOMAIN`
    *   `REACT_APP_NHOST_REGION`
    *   `REACT_APP_HASURA_GRAPHQL_URL`
    *   `REACT_APP_HASURA_GRAPHQL_WS_URL`

5.  **Deploy Site**: Click the **"Deploy site"** button. Netlify will now build and deploy your application. Once deployed, you will get a unique URL for your site.

### Option B: Deploy using Netlify CLI

This method is useful for quick deployments or if you prefer command-line tools.

1.  **Install Netlify CLI**: If you haven't already, install the Netlify CLI globally:
    ```bash
    npm install netlify-cli -g
    ```

2.  **Login to Netlify**: Authenticate the CLI with your Netlify account:
    ```bash
    netlify login
    ```

3.  **Deploy from `dist` folder**: Navigate to your `chatbot-app` directory and deploy the `dist` folder:
    ```bash
    cd path/to/your/chatbot-app
    netlify deploy --prod --dir=dist
    ```
    Follow the prompts. This will deploy your site and provide you with a live URL.

## 4. Post-Deployment Steps

### 4.1 Configure CORS in Nhost

For your deployed frontend to communicate with your Nhost backend, you need to add your Netlify site's URL to the allowed CORS origins in Nhost.

1.  Go to your Nhost project in the Nhost Console.
2.  Navigate to **Settings** -> **CORS**.
3.  Add your Netlify site's URL (e.g., `https://your-site-name.netlify.app`) to the list of allowed origins.

### 4.2 Verify Deployment

Open your deployed Netlify URL in a browser and test the application thoroughly:

-   **Sign Up/Sign In**: Ensure authentication works.
-   **Create New Chat**: Verify you can create new chat sessions.
-   **Send Messages**: Test sending messages and receiving AI responses.
-   **Real-time Updates**: Confirm messages appear in real-time.

## 5. Troubleshooting

-   **


If you encounter issues during deployment or while using the deployed application, consider the following:

-   **Build Errors**: Check your local build process (`npm run build` or `pnpm run build`). Ensure all dependencies are installed and there are no syntax errors in your code.
-   **Netlify Build Logs**: If Netlify deployment fails, check the build logs in your Netlify dashboard. They often provide specific error messages.
-   **Environment Variables**: Double-check that all `REACT_APP_` environment variables are correctly set in your Netlify site settings.
-   **CORS Issues**: If you see errors related to CORS (Cross-Origin Resource Sharing) in your browser console, ensure your Netlify domain is added to the allowed origins in your Nhost project settings.
-   **Nhost/Hasura Connectivity**: Verify that your Nhost backend (Hasura GraphQL endpoint) is accessible and running. You can test this by trying to access your Hasura console directly.
-   **n8n Workflow**: Ensure your n8n workflow is active and correctly configured with the right credentials (OpenRouter API key, Hasura Admin Secret) and that the webhook URL in Hasura Actions points to the correct n8n webhook.
-   **Browser Console**: Always check your browser's developer console for any JavaScript errors or network request failures.

## 6. Project Files for Manual Deployment

All the necessary project files are located in the `chatbot-app` directory. You can download this entire directory to your local machine.

-   `chatbot-app/`: Contains the React frontend application.
-   `chatbot-app/database/`: Contains the Hasura schema and permissions configurations.
-   `chatbot-app/n8n/`: Contains the n8n workflow JSON and setup instructions.

---

**Note**: The `dist` folder, which contains the built production files, is generated after running `npm run build` (or `pnpm run build`) locally. This `dist` folder is what you would typically deploy to a static hosting service like Netlify.



