import Companies from "@/components/companies";
import {currentUser} from "@clerk/nextjs/server";
import {fetchJobsForCandidateAction, fetchProfileAction} from "@/app/actions";
import {redirect} from "next/navigation";

async function CompaniesPage() {
    const user = await currentUser();
    const profileInfo=await fetchProfileAction(user?.id);
    if(!profileInfo) redirect("/onboard");
    const fetchAllJobs= await fetchJobsForCandidateAction({});
    return(
<Companies fetchAllJobs={fetchAllJobs}/>
    )
    
}
export default CompaniesPage;