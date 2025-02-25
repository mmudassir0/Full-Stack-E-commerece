"use client";
import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Camera, Loader2, Lock, User } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "../ui/tabs";

import { Session } from "next-auth";
import Personal from "./personal";
import Security from "./security";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { revalidatePath } from "next/cache";

export type userDataType = {
  profile: {
    id: string;
    name: string | null;
    userId: string;
    phone: string | null;
    profileImageUrl: string | null;
    timezone: string;
    language: string;
    bio: string | null;
    birthDate: Date | null;
    gender: string | null;
  } | null;
  email: string;
} | null;

const Profile = ({
  session,
  userData,
}: {
  session: Session | null;
  userData: userDataType;
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { toast } = useToast();

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   console.log(file, "upload file ");
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setSelectedImage(reader.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setSelectedFile(file);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid image",
      });
    }
  };
  const handleUpload = async () => {
    try {
      if (!selectedFile) {
        toast({
          title: "Error",
          description: "Please select an image first",
        });
        return;
      }
      const MAX_SIZE = 5 * 1024 * 1024;
      if (selectedFile.size > MAX_SIZE) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
        });
        return;
      }

      setIsUploading(true);
      const formData = new FormData();
      formData.append("userId", session?.user?.id || "");
      formData.append("image", selectedFile);
      console.log(formData, "formData");
      const response = await fetch("/api/profile", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image");
      }
      revalidatePath("/profile");
      setSelectedImage(null);
      setSelectedFile(null);

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

      // Update user profile image or handle success
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload image",
      });
      console.error("[Profile Image Upload Error]:", error);
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className="container mx-auto p-6 max-w-7xl min-h-screen">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group"
        >
          <Avatar className="w-32 h-32 ring-2  ring-primary transition-all duration-300 group-hover:ring-4">
            <AvatarImage
              src={
                selectedImage ||
                (userData?.profile?.profileImageUrl as string) ||
                "/images/avatar-person.svg"
              }
              alt={"profile"}
              className="object-cover"
            />
            <AvatarFallback>
              {session?.user?.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Label className="absolute bottom-0 right-0 rounded-full p-2 bg-primary text-primary-foreground cursor-pointer shadow-lg transition-all duration-300 hover:bg-primary/90 hover:scale-110">
            <Camera className="w-5 h-5" />
            <Input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Label>
        </motion.div>
        <div className="flex flex-col items-center md:items-start gap-2 ">
          <h1 className="text-2xl font-bold">{userData?.profile?.name}</h1>
          <p className="text-muted-foreground">{userData?.email}</p>
          {selectedImage && (
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="mt-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Update Profile Picture"
              )}
            </Button>
          )}
        </div>
      </div>
      <div className="bg-card rounded-lg shadow-sm">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4 p-1">
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
          <div className="p-6">
            <TabsContent value="personal">
              <Personal userData={userData} />
            </TabsContent>
            <TabsContent value="security">
              <Security />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
