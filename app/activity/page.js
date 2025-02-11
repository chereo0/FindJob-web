import {
  fetchJobApplicationsForCandidate,
  fetchJobsForCandidateAction,
} from "@/app/actions";
import { currentUser } from "@clerk/nextjs/server";
import CandidateActivity from "../../components/candidate-activity";

export default async function Activity() {
  const user = await currentUser();
  const jobList = await fetchJobsForCandidateAction();
  const jobApplicants = await fetchJobApplicationsForCandidate(user?.id);
  return <CandidateActivity jobList={jobList} jobApplicants={jobApplicants} />;
}
