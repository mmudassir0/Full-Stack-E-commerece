import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import FormWrapper from "../form/form-wrapper";
import { Button } from "../ui/button";
import PasswordField from "../form/password-field";
import { useForm } from "react-hook-form";
import { Lock, Smartphone } from "lucide-react";
import {
  UpdateNewPasswordSchema,
  UpdateNewPasswordValues,
} from "@/prisma/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateNewPassword } from "@/actions/changePassword";
import { toast } from "sonner";
import SwitchField from "../form/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Security = () => {
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secret, setSecret] = useState("");
  const passwordForm = useForm<UpdateNewPasswordValues>({
    resolver: zodResolver(UpdateNewPasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const twoFactorForm = useForm({
    defaultValues: {
      code: "",
      twoFactorEnabled: false,
    },
  });

  const onSubmit = async (data: UpdateNewPasswordValues) => {
    const res = await updateNewPassword(data);
    if (res.success) {
      passwordForm.reset();
    }
    if (res?.message) {
      toast(res?.message);
    }
  };

  const handlePasswordUpdate = async (data) => {
    try {
      // Call your password update API
      const response = await updatePassword(data);
      if (response.success) {
        passwordForm.reset();
        toast.success("Password updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update password");
    }
  };

  const handle2FAToggle = async (enabled) => {
    if (enabled) {
      try {
        // Call your API to generate 2FA secret
        const response = await fetch("/api/2fa/setup", {
          method: "POST",
        });
        const data = await response.json();

        if (data.success) {
          setQrCodeUrl(data.qrCode);
          setSecret(data.secret);
          setShowTwoFactorSetup(true);
        }
      } catch (error) {
        toast.error("Failed to setup 2FA");
      }
    } else {
      try {
        // Call your API to disable 2FA
        const response = await fetch("/api/2fa/disable", {
          method: "POST",
        });
        const data = await response.json();

        if (data.success) {
          toast.success("2FA disabled successfully");
        }
      } catch (error) {
        toast.error("Failed to disable 2FA");
      }
    }
  };

  const handleVerify2FA = async (data) => {
    try {
      const response = await fetch("/api/2fa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: data.code,
          secret: secret,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setShowTwoFactorSetup(false);
        toast.success("2FA enabled successfully");
      } else {
        toast.error("Invalid verification code");
      }
    } catch (error) {
      toast.error("Failed to verify 2FA");
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Security Settings</CardTitle>
        <p className="text-muted-foreground">
          Manage your password and security preferences
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormWrapper
          form={twoFactorForm}
          onSubmit={onSubmit}
          className="space-y-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="font-medium flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Two-factor Authentication
              </h4>
              <p className="text-sm text-slate-500">
                Add an extra layer of security to your account
              </p>
            </div>
            <SwitchField name="twoFactorEnabled" form={twoFactorForm} />
          </div>
          <Alert>
            <AlertTitle>Enhanced Security</AlertTitle>
            <AlertDescription>
              Two-factor authentication adds an extra layer of security to your
              account by requiring both your password and a verification code
              from your mobile device.
            </AlertDescription>
          </Alert>
        </FormWrapper>

        <FormWrapper
          form={passwordForm}
          onSubmit={onSubmit}
          className="space-y-4"
        >
          <div className="space-y-4">
            <h4 className="font-medium text-2xl flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Change Password
            </h4>

            <PasswordField
              name="currentPassword"
              label="Current Password"
              form={passwordForm}
              Icon={Lock}
              placeholder="Enter current password"
              className="text-gray-600"
            />

            <PasswordField
              name="newPassword"
              label="New Password"
              form={passwordForm}
              Icon={Lock}
              placeholder="Enter new password"
              className="text-gray-600"
            />

            <PasswordField
              name="confirmPassword"
              label="Confirm Password"
              form={passwordForm}
              Icon={Lock}
              placeholder="Confirm new password"
              className="text-gray-600"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="px-10 font-bold">
              Update Password
            </Button>
          </div>
        </FormWrapper>
      </CardContent>
    </Card>
  );
};

export default Security;
