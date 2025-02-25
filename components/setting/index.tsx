"use client";
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Camera, Lock, Mail, PhoneIcon, User } from "lucide-react";
import { motion } from "framer-motion";
import TextField from "../form/input-field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "../ui/tabs";
import FormWrapper from "../form/form-wrapper";
import { useForm } from "react-hook-form";
import SelectField from "../form/select-field";
import CalanderField from "../form/calander-field";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import TextareaField from "../form/textarea-field";
import PasswordField from "../form/password-field";

const Setting = () => {
  const form = useForm();
  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl min-h-screen">
      {/* Profile Header */}

      {/* <div className="flex justify-center mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-300">
            {avatar ? (
              <img
                src={avatar}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={64} className="text-gray-400" />
              </div>
            )}
          </div>
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer"
          >
            <Camera size={20} className="text-white" />
          </label>
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            // onChange={handleAvatarChange}
            className="hidden"
          />
        </motion.div>
      </div> */}
      <div className="flex items-center gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <Avatar className="w-32 h-32">
            <AvatarImage src={"/images/avatar-person.svg"} alt={"profile"} />
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
          <Label className="absolute bottom-0 right-0 rounded-full p-2 bg-gray-800 text-white cursor-pointer">
            <Camera className="w-5 h-5" />
            <Input type="file" className="hidden" />
          </Label>
        </motion.div>
        <div className=" ">
          <h1 className="text-2xl font-bold">Mudassir Abbas</h1>
          <p className="text-muted-foreground">mudassir@mail.com</p>
        </div>
      </div>
      <div>
        <Tabs defaultValue="personal" className="">
          <TabsList className="grid w-full grid-cols-4 mb-5">
            <TabsTrigger value="personal">
              <User className="h-5 w-5 mr-2" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="h-5 w-5 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="preference">Preference</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Personal Information</CardTitle>
                <p className="text-muted-foreground">
                  Update your personal details and information
                </p>
              </CardHeader>
              <CardContent>
                <FormWrapper
                  form={form}
                  onSubmit={onSubmit}
                  className="space-y-5"
                >
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
          </TabsContent>
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Security Settings</CardTitle>
                <p className="text-muted-foreground">
                  Manage your password and security preferences
                </p>
              </CardHeader>
              <CardContent>
                <FormWrapper
                  form={form}
                  onSubmit={onSubmit}
                  className="space-y-8"
                >
                  <PasswordField
                    name="current-password"
                    label="Current Password"
                    form={form}
                    Icon={Lock}
                    placeholder="Current Password"
                    className="text-gray-600"
                  />
                  <PasswordField
                    name="new-password"
                    label="New Password"
                    form={form}
                    Icon={Lock}
                    placeholder="New Password"
                    className="text-gray-600"
                  />{" "}
                  <PasswordField
                    name="confirm-password"
                    label="Confirm Password"
                    form={form}
                    Icon={Lock}
                    placeholder="Confirm Password"
                    className="text-gray-600"
                  />
                  <div className="flex justify-end mt-5 ">
                    <Button type="submit" className="px-10 font-bold  ">
                      Update Password
                    </Button>
                  </div>
                </FormWrapper>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Setting;
{
  /* <FormWrapper form={form} onSubmit={onSubmit}>
<div className="grid md:grid-cols-2 gap-5 mb-5">
  <TextField
    name="name"
    label="Name"
    form={form}
    Icon={User}
    placeholder="Enter Name"
    className="text-black"
  />
  <TextField
    name="email"
    label="Email"
    form={form}
    Icon={Mail}
    placeholder="Enter Email"
    className="text-black"
  />
</div>{" "}
<div className="grid md:grid-cols-2 gap-5">
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
<TextField
  name="email"
  label="Bio"
  form={form}
  Icon={Mail}
  placeholder="Enter Email"
  className="text-black"
/>
</FormWrapper> */
}
