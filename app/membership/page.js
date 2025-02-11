import Membership from "@/components/membership";
import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { fetchProfileAction } from "../actions";
import { redirect } from "next/navigation";
async function MembershipPage() {
  const user = await currentUser();
  const ProfileInfo = await fetchProfileAction(user?.id);
  if (!ProfileInfo) redirect("/onboard");
  return <Membership ProfileInfo={ProfileInfo} />;
}

export default MembershipPage;
