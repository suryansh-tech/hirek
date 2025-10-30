import { cookies, headers } from "next/headers"
import crypto from "crypto";
import { getIPAddress } from "./location";
import { db } from "@/config/db";
import { sessions } from "@/drizzle/schema";
import { SESSION_LIFETIME } from "@/config/constants";

type CreateSessionData = {
    userAgent: string;
    ip: string;
    userId: number;
    token: string;
};

const generateSessionToken = () => {
    return crypto.randomBytes(32).toString("hex").normalize();

    //* generates a 256-bit cryptographically secure token
    //* <Buffer 4f 8a 9b 12 > (raw binary, not readable)
    //* Converts that binary data into a hexadecimal string. ("4f8a9b12d1e9a8c3f5...")
    //* This ensures the string is in a consistent Unicode normalization form (usually NFC)
};

const createUserSession = async ({token, userId, userAgent, ip}: CreateSessionData) => {

    //* before store we need to hash the token
    //* this line phele sha algo le rahi then update m bol raha ki token ko hash karo then digest kro hex m convert karke
    const hashedToken = crypto.createHash("sha-256").update(token).digest("hex");

    const [session] = await db.insert(sessions).values({
        id: hashedToken,
        userId,
        expiresAt: new Date(Date.now() + SESSION_LIFETIME * 1000),
        ip,
        userAgent,
    });

    //* this will return the session to auth.actions file where we call this functions
    return session;
};

export const createSessionAndSetCookie = async (userId: number) => {
    //* 1st we need 3 things to gather info about sess 
    //*1. Generate the Raw Session Token
    const token = generateSessionToken();

    //* 2. ip address
    const ip = await getIPAddress();

    //* 3. Headers - we use next headers to get the user agent(browser details)
    const headerList = await headers();

    //* now all data i needed is there now we store in sessions tables in Db
    await createUserSession({
        token,
        userId: userId,
        userAgent: headerList.get("user-agent") || "",
        ip: ip,
    });

    //* session created now we need to set/stored in cookies -> for autologin or persistent login
    const cookieStore = await cookies();
    cookieStore.set('session', token, {
        secure: true, //* this will ensure that cookie is only sent over https SECURE CHANNEL
        httpOnly: true, //* this will ensure that cookie is not accessible by client side javascript code injects
        maxAge: SESSION_LIFETIME,
    });
};