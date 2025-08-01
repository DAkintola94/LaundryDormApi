Information before cloning the application:

The installer don’t need Visual Studio or Visual Studio Code installed to run the application if its set it up with Docker correctly.

Everything the app needs is baked into Docker containers:
.NET SDK/runtime is inside the ASP.NET container
Node.js is in the build stage of the frontend Dockerfile
Nginx serves the frontend (comes with nginx image), no dev server needed
MariaDB image runs the DB and initialize it

# How to run the application:

**Step 1.**

git clone https://github.com/DAkintola94/LaundryDormApi.git

Navigate to the cloned folder root with the CLI. **cd LaundryDormApi** (To the docker-compose.yml file which sits at the root of the application)

**Step 2.**
To run the project, just write: **docker-compose up --build** in the terminal

**Step 3.**

Visit:

- Frontend: http://localhost:3000 (not finalized)
- Backend API: http://localhost:8080/swagger (Swagger) (not finalized)
