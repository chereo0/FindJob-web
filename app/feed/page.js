import Feed from "@/components/feed";
import {currentUser} from "@clerk/nextjs/server";
import {fetchAllFeedPostsAction, fetchProfileAction} from "@/app/actions";
import {redirect} from "next/navigation";

async function FeedPage(){
    const user=await currentUser();
    const profileInfo= await fetchProfileAction(user?.id);
    if (!profileInfo) redirect("/onboard");
    const allFeedPosts = await fetchAllFeedPostsAction();
    return (

<Feed
    user={JSON.parse(JSON.stringify(user))}
    profileInfo={profileInfo}
    allFeedPosts={allFeedPosts}
/>
    )
}
export default FeedPage;