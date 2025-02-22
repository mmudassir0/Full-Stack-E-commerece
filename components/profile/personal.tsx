import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import FormWrapper from "../form/form-wrapper";
import TextField from "../form/input-field";
import SelectField from "../form/select-field";
import CalanderField from "../form/calander-field";
import TextareaField from "../form/textarea-field";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { Mail, PhoneIcon, User } from "lucide-react";
import { UpdateProfileSchema, UpdateProfileValues } from "@/prisma/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfile } from "@/actions/profile";
import { toast } from "sonner";
import { userDataType } from ".";

const Personal = ({ userData }: { userData: userDataType }) => {
  const form = useForm<UpdateProfileValues>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: userData?.profile?.name || "",
      email: userData?.email || "",
      gender: userData?.profile?.gender || "",
      dob: userData?.profile?.birthDate || new Date(),
      phone: userData?.profile?.phone || "",
      bio: userData?.profile?.bio || "",
    },
  });

  const onSubmit = async (data: UpdateProfileValues) => {
    const res = await updateProfile(data);
    if (res?.message) {
      toast(res?.message);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Personal Information</CardTitle>
        <p className="text-muted-foreground">
          Update your personal details and information
        </p>
      </CardHeader>
      <CardContent>
        <FormWrapper form={form} onSubmit={onSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5 ">
            <TextField
              name="name"
              label="Name"
              form={form}
              Icon={User}
              placeholder="Enter Name"
              className="text-gray-600"
            />
            <TextField
              name="email"
              label="Email"
              form={form}
              Icon={Mail}
              placeholder="Enter Email"
              className="text-gray-600"
              disabled={true}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-5 ">
            <SelectField
              name="gender"
              label="Gender"
              form={form}
              Icon={User}
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
              placeholder="Select Gender"
              className=""
            />
            <CalanderField name="dob" label="Birth Date" form={form} />
          </div>
          <div className="grid md:grid-cols-2 gap-5 ">
            <TextField
              name="phone"
              label="Phone"
              form={form}
              Icon={PhoneIcon}
              placeholder="Phone Number"
              className="text-gray-600"
            />
          </div>
          <TextareaField
            name="bio"
            label="Bio"
            className="text-gray-600"
            form={form}
            placeholder="Tell us a little bit about yourself"
          />
          <div className="flex justify-end mt-5 ">
            <Button type="submit" className="px-10 font-bold  ">
              Save Changes
            </Button>
          </div>
        </FormWrapper>
      </CardContent>
    </Card>
  );
};
export default Personal;
