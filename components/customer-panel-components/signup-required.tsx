"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function SignupRequiredModal({ open, onOpenChange, onClose }:any) {
  const router = useRouter();

  const handleSignup = () => {
    router.push("/user-signup");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Create an Account to Continue
          </DialogTitle>
          <DialogDescription className="text-center mt-2">
            To access this feature and enjoy a personalised experience, please
            sign up for a free account. It only takes a moment!
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center mt-6">
          <Button onClick={handleSignup} variant="primary" className="w-full rounded-lg">
            Sign Up Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
