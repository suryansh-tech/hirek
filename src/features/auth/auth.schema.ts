//! auth schema for serverside validation using zod

import z from "zod";

export const registerUserSchema = z.object({

    //? validating name
    name: z.string().trim().min(2, "Name must be at least 2 characters long").max(255, "Name must be at most 255 characters long"),

    //? validationg username
    userName: z.string().trim().min(3, "Username must be at least 3 characters long").max(255, "Username must be at most 255 characters long").regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, and underscores"),

    //? validating email
    email: z.email("Please enter a valid email address").trim().max(255, "Email must be at most 255 characters long").toLowerCase(),

    //? validating password
    password: z.string().min(8, "Password must be at least 8 characters long").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password can only contain letters, numbers, and special characters"),

    //? role
    role: z.enum(["applicant", "employer"], {
        error: "Role must be either applicant or employer",
    }).default("applicant"),
});

//? z.infer automtically creates a Typescript typr from your zod schema.
//? Automatically infer a TypeScript type from the Zod schema so we can safely type-check
//? registration payloads across the codebase (forms, API handlers, DB inserts) without
//? duplicating the shape definition or risking drift between runtime validation and
//? compile-time types.


export type RegisterUserData = z.infer<typeof registerUserSchema>; // ye ab hum auth.actions m registrationactions ko de degay to zod se ab validation hoga


//* Optional: Create a schema with password confirmation - in server we dont need confPass.

export const registerUserWithConfirmSchema = registerUserSchema.extend({
    confirmPassword: z.string(), //? yahan user dobara password daalega
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords Dont Match", //? agar dono password same nahi toh yeh error aayega
    path: ["confirmPassword"], //? error ko is field pe dikhayega
});

//? is type se aap TypeScript mein safe tareeke se form data ko type kar sakte ho
export type RegisterUserWithConfirmData = z.infer<typeof registerUserWithConfirmSchema>;



//* Login Schema

export const loginUserSchema = z.object({

    //? validating email
    email: z.email("Please enter a valid email address").trim().max(255, "Email must be at most 255 characters long").toLowerCase(),

    //? validating password
    password: z.string().min(8, "Password must be at least 8 characters long"),

});

export type LoginUserData = z.infer<typeof loginUserSchema>; // ye ab hum auth.actions m registrationactions ko de degay to zod se ab validation hoga


