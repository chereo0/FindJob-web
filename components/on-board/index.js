'use client'

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { useUser } from "@clerk/nextjs";

import { useEffect, useState } from "react";
import CommonForm from "../common-form";
import { candidateOnboardFormControls,initialCandidateFormData,initialRecruiterFormData,recruiterOnboardFormControls } from "@/utils";
import { createProfileAction } from "@/app/actions";
import { createClient } from "@supabase/supabase-js";

const supabaseClient = createClient ('https://hlrpbuiruqajzyuglwwg.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhscnBidWlydXFhanp5dWdsd3dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwMjA2MTYsImV4cCI6MjA1NDU5NjYxNn0.UQKI6iB87QNoYjyCk_3KCl2QGA19gOXcwoPxuQdKJNI'

);
function OnBoard() {
    const [currentTab, setCurrentTab] = useState("candidate");
    const [recruiterFormData, setRecruiterFormData] = useState(
        initialRecruiterFormData
      );
      const [candidateFormData, setCandidateFormData] = useState(
        initialCandidateFormData
      );
      const [file, setFile] = useState(null)
      const currentAuthUser = useUser();
      const { user } = currentAuthUser;

      function handleFileChange(event) {
        event.preventDefault();
        setFile(event.target.files[0]);
      }
      async function handleUploadPdfToSupabase() {
        const { data, error } = await supabaseClient.storage
          .from("job-board-public")
          .upload(`/public/${file.name}`, file, {
            cacheControl: "3600",
            upsert: false,
          });
        console.log(data, error);
        if (data) {
          setCandidateFormData({
            ...candidateFormData,
            resume: data.path,
          });
        }
      }

      useEffect(() => {
        if (file) handleUploadPdfToSupabase();
      }, [file]);
    
      function handleTabChange(value) {
        setCurrentTab(value);
      }
    function handleTabChange(value) {
        setCurrentTab(value);
      }
      function handleRecuiterFormValid() {
        return (
          recruiterFormData &&
          recruiterFormData.name.trim() !== "" &&
          recruiterFormData.companyName.trim() !== "" &&
          recruiterFormData.companyRole.trim() !== ""
        );
      }
      function handleCandidateFormValid() {
        return Object.keys(candidateFormData).every(
          (key) => candidateFormData[key].trim() !== ""
        );
      }
      async function createProfile(){
        const data= currentTab === 'candidate' ?{
          candidateInfo : candidateFormData,
          role: "candidate",
          isPremiumUser: false,
          userId: user?.id,
          email: user?.primaryEmailAddress?.emailAddress,
        } :
          {
            recruiterInfo: recruiterFormData,
            role: "recruiter",
            isPremiumUser: false,
            userId: user?.id,
            email: user?.primaryEmailAddress?.emailAddress,
          };
          await createProfileAction(data, "/onboard");

      }
console.log(candidateFormData);
    return (      
          <div className="bg-white">
        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <div className="w-full">
            <div className="flex items-baseline justify-between border-b pb-6 pt-24">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                Welcome to onboarding
              </h1>
              <TabsList>
                <TabsTrigger value="candidate">Candidate</TabsTrigger>
                <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
              </TabsList>

            </div>
          </div>
          <TabsContent value="candidate">
            <CommonForm
            action={createProfile}
            formData={candidateFormData}
            setFormData={setCandidateFormData}
            formControls={candidateOnboardFormControls}
            buttonText={'onBoard as candidate'}
            handleFileChange={handleFileChange}
            isBtnDisabled={!handleCandidateFormValid}
/>
            
            
          
          </TabsContent>
          <TabsContent value="recruiter">
            <CommonForm
            formControls={recruiterOnboardFormControls}
            buttonText={'onBoard as recruiter'}
            formData={recruiterFormData}
            setFormData={setRecruiterFormData}
            isBtnDisabled={!handleRecuiterFormValid()}
            action={createProfile}
            
/>
          </TabsContent>

          </Tabs>
</div>
)
}
export  default OnBoard;