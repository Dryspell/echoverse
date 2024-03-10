import useDetailedAction from "@/hooks/useDetailedAction";
import { Button } from "./ui/button";
import { api } from "../../convex/_generated/api";

export default function UpgradeSubscriptionButton() {
  const { mutate: getPaymentUrl, isLoading: paymentUrlLoading } =
    useDetailedAction(api.stripe.getPaymentUrl, {
      onSuccess: (url) => {
        console.log(`Received Stripe Url: ${url}`);
        url && window?.open(url, "_blank");
      },
      onError: (error) => {
        console.error(error);
      },
      onMutate: (params) => {
        console.log(`mutating...`, params);
      },
    });

  const handleUpgradeClick = async () => {
    getPaymentUrl();
  };

  return (
    <Button disabled={paymentUrlLoading} onClick={handleUpgradeClick}>
      {!paymentUrlLoading ? "Upgrade" : "Loading..."}
    </Button>
  );
}
