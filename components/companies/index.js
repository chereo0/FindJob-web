'use client'
import CommonCard from "@/components/common-card";
import JobIcon from "@/components/job-icon";
import { Button } from "../ui/button";
import {useRouter} from "next/navigation";

function Companies({fetchAllJobs}) {
    const router=useRouter();
    console.log(fetchAllJobs)
    const createSetOfCompanies=[...new Set(
        fetchAllJobs.filter((jobItem) =>
    jobItem?.companyName && jobItem?.companyName.trim() !==""
        )
            .map((item)=>item.companyName)
    ),
    ];
    function  filterJobsComapny (getCompanyName) {
        sessionStorage.setItem(
            "filterParams",
            JSON.stringify({
                companyName: [getCompanyName],
            })
        );

        router.push("/jobs");
    }
    console.log(createSetOfCompanies);
    return(
        <div className="mx-auto max-w-7xl">
            <div className="flex items-baseline dark:border-white justify-between border-b pb-6 pt-24">
                <h1 className="text-4xl dark:text-white font-bold tracking-tight text-gray-900">
                    Browse Companies
                </h1>
            </div>
            <div className="pt-6 pb-24">
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
                    <div className="lg:col-span-4">
                        <div className="container mx-auto p-0 space-y-8">
                            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
                                {
                                    createSetOfCompanies &&
                                    createSetOfCompanies.length > 0 ?
                                        createSetOfCompanies.map(companyName =>
                                            <CommonCard
                                                icon={<JobIcon />}
                                                title={companyName}
                                                footerContent={
                                                    <Button onClick={()=> filterJobsComapny (companyName)}     className="disabled:opacity-60 flex h-11 items-center justify-center px-5">See jobs</Button>
                                                }
                                            />

                                            )
                                        : <h1>no company found</h1>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
}
export default Companies;