# Personal Blog

A fully custom personal blog built from scratch using HTML5, CSS3, vanilla JavaScript, and Node.js.

### 📝 About the Project

This blog started as a personal initiative to document my projects and my financial journey. But more importantly, it serves as a hands-on learning path to strengthen my frontend fundamentals.

This project represents my attempt to:

- Improve my understanding of JavaScript, HTML5, CSS3, and the HTTP protocol
- Learn how to structure a full-stack application without relying on frameworks
- Strengthen my frontend architecture and system design skills
- Build something simple yet complete, deployed on my own infrastructure

### 🐳 Running with Docker
This project supports a fully containerized setup using Docker.
If you want to explore the code or run the application locally, follow the steps below.

#### 1. Clone the repository
```
https://github.com/adrian-u/personal-blog.git
cd personal-blog
```

#### 2. Configure OAuth2 (Google or GitHub)
To access authenticated sections of the application (such as the Create page or Profile page), you must configure either:
- Google OAuth2
- GitHub OAuth2

You will need to create OAuth credentials on the provider’s console and set the correct environment variables.

#### 3. Create your .env file
At the root of the project (same directory as `docker-compose.yml`), create an `.env` file:

`cp .env.docker.template .env`

Then fill in the missing configuration values:
- OAuth2 client ID / secret
- JWT key
- PostgreSQL
- MinIO configuration

#### 4. Create the MinIO buckets
Node is not configured with MinIO to automatically create the buckets required by the application.

After starting Docker for the first time, open the MinIO console in your browser (default: `http://localhost:9001`) and manually create the following buckets:
- The bucket defined in MINIO_AVATARS_BUCKET
- The bucket defined in MINIO_MARKDOWN_IMG_BUCKET

These buckets are used to store:
- User avatar images
- Markdown images uploaded through the editor