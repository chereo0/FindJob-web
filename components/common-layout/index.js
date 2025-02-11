import { currentUser } from "@clerk/nextjs/server";
import Header from "../header";
import { fetchProfileAction } from "@/app/actions";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

async function CommonLayout ({children,...props }){

    const user=await currentUser();
    const profileInfo = await fetchProfileAction(user?.id)
    return(
        <NextThemesProvider {...props}>
        <div className="mx-auto max-w-7xl p-6 lg:px-8">
            <Header 
            profileInfo={profileInfo}
          user={JSON.parse(JSON.stringify(user))}/>
            
            <main>
            {children}
            </main>
        </div>
        </NextThemesProvider>
    );
}
export default CommonLayout;