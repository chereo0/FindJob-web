
import OnBoard from "@/components/on-board";
import {currentUser} from "@clerk/nextjs/server";
import { fetchProfileAction } from "../actions";
import { redirect } from "next/navigation";



async function OnBoardPage(){
    
      const user = await currentUser();
      const profileInfo = await fetchProfileAction(user?.id);

      if (profileInfo?._id) {
        if (profileInfo?.role === "recruiter" && !profileInfo.isPremiumUser)
          redirect("/membership");
        else redirect("/");
      } else return <OnBoard />;
    }
    
    export default OnBoardPage;