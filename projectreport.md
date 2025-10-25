JOB PORTAL APP
-------------------------------------

Frontend -> Next.js, Tailwind, Shadcn/ui  
database -> MySQL, Drizzle ORM  
Database design -> (schema files in `/drizzle`)  
UI file Figma -> [Figma link]

------------------------------------
Installing Dependencies:
- typescript (for type checking)
- @types/node
- @types/react
- @types/react-dom
- tailwindcss
- postcss
- shadcn/ui (for ui components)
- drizzle-orm (for database querying)
- mysql2 (for database connection)
- drizzle-kit (for database migration)
- argon2 (for password hashing)
- zod (for serverside validation)
- sonner (for toast notifications)



-------------------------------------
Links for tech stacks
-------------------------------------
Next.js: https://nextjs.org  
Tailwind CSS: https://tailwindcss.com  
Shadcn/ui: https://ui.shadcn.com  
Drizzle ORM: https://orm.drizzle.team/docs/get-started/mysql-new 

-------------------------------------- 
Basic Git Setup push and stagging
--------------------------------------

1. Create a repo on GitHub (web) and Copy repo URL (HTTPS or SSH).
2. Initialise local project and push full code (first time)
    - cd /path/to/your/project
    - git init
    - git add . (commit all files)
    - git commit -m "Initial commit"
    - # add remote (use your repo URL)
    - git remote add origin git@github.com:your-username/your-repo.git   # SSH
    - git branch -M main
    - git push -u origin main
3. Daily workflow (after initial push) — the 3 commands
    - git pull origin main --rebase
    - git add .
    - git commit -m "Short message"
    - git push origin main


-------------------------------------
Commands I run
-------------------------------------
>>> npx create-next-app@latest
>>> npx shadcn@latest init
>>> npx shadcn@latest add input label card select button
>>> npm i drizzle-orm mysql2  
>>> npm i -D drizzle-kit tsx 
-  go to mysql workbench and create a new database by hit ⚡ icon
>>> create database next_job_portal;

- installing drizzle orm and mysql and migrate database to mysql workbeanch
>>> npm i drizzle-orm mysql2 
>>> npm i -D drizzle-kit tsx
>>> npx drizzle-kit generate (gen the migration file)
>>> npx drizzle-kit migrate (migrate the migration file to mysql workbench)

- install argon2 for password hashing
>>> npm i argon2 

- install sonner for toast notifications
>>> npx shadcn@latest add sonner 

- install zod for serverside validation
>>> npm i zod



learning resource:
-------------------------------------
1. Nextjs -> https://www.youtube.com/playlist?list=PLwGdqUZWnOp0lwvSBaIzzgV9X0ZiZ-42O
2. MYsql/sql -> https://youtu.be/5bFxbwjN-Gk
3. Drizzle ORM -> https://youtu.be/A2a3jznxvUs
4. Shadcn/ui -> https://youtu.be/7TqsIx_UnFI
5. TypeScript -> https://www.youtube.com/playlist?list=PLwGdqUZWnOp0xfHQFmlL52b_6-QZ0mnk_


Logics pages and components:
-------------------------------------

- auth.actions.tsx -> handling auth actions like register, login, logout, backend logics for fetch and store data in db 
- auth.schema.ts -> serverside validation schema using zod
- zod is doing for register and login as well both for server side validation ho raha h frontend nhi isko use krne ke liye we have to use it in auth.actions.tsx file


