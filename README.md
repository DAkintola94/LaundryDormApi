https://laundry-dorm-api.vercel.app/

The frontend is deployed on Vercel, while the backend is hosted on Azure. 

# To run the application in Docker:
Information before cloning the application:

The installer don’t need Visual Studio or Visual Studio Code installed to run the application if its set it up with Docker correctly.
In other word, **Make sure Docker Desktop is installed on your computer**

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
To run the project, write:

- **docker-compose up --build** (in the terminal/CLI)

**Step 3.**

Visit:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api/ (Laundry or Advice, or whatever endpoint you want to hit)
