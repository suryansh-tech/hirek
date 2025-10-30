"use server";

// 👉 Login User Action

import { db } from "@/config/db";
import { users } from "@/drizzle/schema";
import argon2 from "argon2";
import { eq, or } from "drizzle-orm";
import { LoginUserData, loginUserSchema, RegisterUserData, registerUserSchema } from "../auth.schema";
import { createSessionAndSetCookie } from "./use-cases/sessions";

// 👉 Server Actions in Next.js are special functions that run only on the server, not in the user’s browser.

// They let you perform things like database queries, API calls, form submissions, or data mutations directly from your React components — without creating a separate API route.

// You just mark a function with "use server", and Next.js automatically runs it on the server.

//*When you submit a <form> in Next.js using action={yourServerAction}, the framework sends a FormData object to that server function.

// FormData is a built-in Web API type (just like Request, Response, or URLSearchParams).

// It provides methods like .get(), .set(), .append(), and .entries() — which you’re already using here.

export const registrationAction = async (data: RegisterUserData) => {
    try {
        // validating the data with zod schema ye data ko zod schema ko parse de de raha h for validating iss line se he uske pass data ka raha h 
        const {data: validatedData, error} = registerUserSchema.safeParse(data);
        if(error) {
            return {
                status: "ERROR",
                message: error.issues[0].message,
            };
        }; 

        // console.log(formData.get("name"));
        const { name, userName, email, password, role } = validatedData;

        // handling uniqure username and email (already stored in db get and match it with nw one for uniuewnwss)
        const [user] = await db.select().from(users).where(or(eq(users.userName, userName), eq(users.email, email)));
        if(user) {
            if(user.email === email) 
            return {
                status: "ERROR",
                message: "Email already registered!",
            };
            else {
                return {
                    status: "ERROR",
                    message: "Username already registered!",
                };
            }
        }

        // hasing the pass
        const hashPassword = await argon2.hash(password);

        // inserting into db
        const [result] = await db.insert(users).values({ name, userName, email, password: hashPassword, role });
        // by default db m insert query lgane pr kux default value deta h
        // fieldCount: 0,
        // affectedRows: 1,
        //* insertId: 23 (here is your new user ID)
        // info: .....etc

        //* ab new user aayega to uska sessions bhi store krna pages with uski particular db ki insert id se 
        await createSessionAndSetCookie(result.insertId);

        // return success response to client jaha se call hua h
        return {
            status: "SUCCESS",
            message: "Registration Completed successfully",
        }
    } catch (error) {
        // return error response to client jaha se call hua h
        return {
            status: "ERROR",
            message: "Registration Failed! Please try again.",
        }
    }
};


//? Login Action

// no need of this as we import type from authscheema by zod infer 
// type LoginData =  {
//     email: string;
//     password: string;
// }

export const loginUserAction = async (data: LoginUserData) => {
    try {
        // validating the data with zod schema ye data ko zod schema ko parse de de raha h for validating iss line se he uske pass data ka raha h 
        const {data: validatedData, error} = loginUserSchema.safeParse(data); 
        if(error) {
            return {
                status: "ERROR",
                message: error.issues[0].message,
            };
        }; 

        // get the usertype data that came from client 
        const { email, password } = validatedData;

        // get the user with particular email address that is presnt in our db
        // match hote hi users table m se uss user ka complete row ka data mil raha h user m
        const [user] = await db.select().from(users).where(eq(users.email, email));

        // if user not found with that email address
        if(!user) {
            return {
                status: "ERROR",
                message: "Invalid Email or Password!",
            }
        }

        // compare the password that user provided with the hashed password that is stored in db
        const isValidPassword = await argon2.verify(user.password, password);
        // if password not match 
        if(!isValidPassword) 
            return {
                status: "ERROR",
                message: "Invalid Email or Password!",
            }
        
        // if password valid -> creating session for user so that user dont need to fill login form n num of times
        // when we create an session humko ye session id banana padega eak unique id jo user ko identify karega kyyki db m toh bahut user h konsa user ka session kya h uske like eak `id` ho ab hum koi new id create nhi krne wale -> `jab user login karega toh uska sara data milega uss data m uski id num bhi milegi` to bs iss id ko lekr he session create kr denge for that specific user id.
        await createSessionAndSetCookie(user.id);
        
        // if password match
        return {
            status: "SUCCESS",
            message: "Login Successful!",
        }
        
    } catch (error) {
        return {
            status: "ERROR",
            message: "Login Failed! Please try again.",
        } 
    }
}