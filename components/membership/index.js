"use client";

import { membershipPlans } from "@/utils";
import CommonCard from "../common-card";
import JobIcon from "../job-icon";
import { Button } from "../ui/button";
import {
  createPriceIdAction,
  createStripePaymentAction,
  updateProfileAction,
} from "@/app/actions";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Toast, ToastProvider } from "@radix-ui/react-toast";

const stripePromise = loadStripe(
  "pk_test_51QX1t5Lv0qAHAdrdu3uYLOABOjPSSjg7vA5Cfj3WquLWB1s7H9Eo6mDNE3yoTs66mw0xiqWDwHWiGQaTO9xA0ZoT004ZtfcAgF"
);

function Membership({ ProfileInfo }) {
  const pathName = useSearchParams();

  async function handlePayment(getCurrentPlan) {
    const stripe = await stripePromise;
    const extractPriceId = await createPriceIdAction({
      amount: Number(getCurrentPlan?.price),
    });
    if (extractPriceId) {
      sessionStorage.setItem("currentPlan", JSON.stringify(getCurrentPlan));
      const result = await createStripePaymentAction({
        lineItems: [
          {
            price: extractPriceId?.id,
            quantity: 1,
          },
        ],
      });
      await stripe.redirectToCheckout({
        sessionId: result?.id,
      });
      console.log(extractPriceId);
    }
  }

  async function updateProfile() {
    const fetchCurrentPlanFromSessionStroage = JSON.parse(
      sessionStorage.getItem("currentPlan")
    );
    const endDate = new Date();
    endDate.setFullYear(
      endDate.getFullYear() +
        (fetchCurrentPlanFromSessionStroage?.type === "basic"
          ? 1
          : fetchCurrentPlanFromSessionStroage?.type === "teams"
          ? 2
          : 5)
    );

    await updateProfileAction(
      {
        ...ProfileInfo,
        isPremiumUser: true,
        memberShipType: fetchCurrentPlanFromSessionStroage?.type,
        memberShipStartDate: new Date().toString(),
        memberShipEndDate: endDate.toString(),
      },
      "/membership"
    );
  }

  useEffect(() => {
    if (pathName.get("status") === "success") {
      updateProfile();
    }
  }, [pathName]);

  console.log(ProfileInfo);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-baseline justify-between border-b pb-6 pt-24">
        <h1 className="text-4xl font-bold tracking-tight text-gray-950">
          {ProfileInfo?.isPremiumUser
            ? "You are a premium user"
            : "Choose Your Best Plan"}
        </h1>
        <div>
          {ProfileInfo?.isPremiumUser ? (
            <Button className="flex h-11 items-center justify-center px-5">
              {
                membershipPlans.find(
                  (planItem) => planItem.type === ProfileInfo?.memberShipType
                ).heading
              }
            </Button>
          ) : null}
        </div>
      </div>
      <div className="py-20 pb-24 pt-6">
        <div className="container mx-auto p-0 space-y-0">
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
            {membershipPlans.map((plan, index) => (
              <CommonCard
                key={plan.heading}
                icon={
                  <div className="flex justify-between">
                    <div>
                      <JobIcon />
                    </div>
                    <h1 className="font-bold text-2xl">{plan.heading}</h1>
                  </div>
                }
                title={`$ ${plan.price} /yr`}
                description={plan.type}
                footerContent={
                  ProfileInfo?.memberShipType === "enterprise" ||
                  (ProfileInfo?.memberShipType === "basic" && index === 0) ||
                  (ProfileInfo?.memberShipType === "teams" &&
                  index >= 0 &&
                  index < 2 ? null : (
                    <Button
                      onClick={() => handlePayment(plan)}
                      className="disabled:opacity-65 dark:bg-[#fffa27] flex h-11 items-center justify-center px-5"
                    >
                      {ProfileInfo?.memberShipType === "basic" ||
                      ProfileInfo?.memberShipType === "teams"
                        ? "Update Plan"
                        : "Get Premium"}
                    </Button>
                  ))
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Membership;
