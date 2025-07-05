"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, X } from "lucide-react";
import { getMentorById, updateMentor, Mentor, SingleMentorResponse } from "../../apis";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { MentorImageUpload } from "@/components/ui/image-upload";
import { use } from "react";

interface EditMentorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditMentorPage({ params }: EditMentorPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Unwrap the params Promise using React.use()
  const { id } = use(params);
  
  console.log("EditMentorPage rendered with params:", params);
  console.log("Unwrapped ID:", id);
  console.log("Current URL:", window.location.href);
  console.log("=== EDIT PAGE LOADED ===");
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    description: "",
    image: "",
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    fetchMentor();
  }, [id]);

  const fetchMentor = async () => {
    try {
      setFetching(true);
      console.log("Fetching mentor with ID:", id);
      const response = await getMentorById(id);
      console.log("Mentor response:", response);
      
      if (response.success && response.data) {
        const mentor = response.data;
        console.log("Setting form data with mentor:", mentor);
        setFormData({
          name: mentor.name || "",
          role: mentor.role || "",
          description: mentor.description || "",
          image: mentor.image || "",
          tags: mentor.tags || [],
        });
      } else {
        console.error("No mentor data in response:", response);
        toast.error("Mentor not found");
        router.push("/dashboard/webdata/mentor");
      }
    } catch (error) {
      console.error("Error fetching mentor:", error);
      toast.error("Failed to fetch mentor");
      router.push("/dashboard/webdata/mentor");
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.role || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      console.log("Updating mentor with ID:", id);
      console.log("Update data:", formData);
      
      const response = await updateMentor(id, formData);
      console.log("Update response:", response);
      
      toast.success("Mentor updated successfully");
      router.push("/dashboard/webdata/mentor");
    } catch (error) {
      console.error("Error updating mentor:", error);
      toast.error("Failed to update mentor");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  if (fetching) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Link href="/dashboard/webdata/mentor">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Mentors
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Mentor</h1>
        </div>
        <Card className="max-w-2xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/dashboard/webdata/mentor">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Mentors
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Mentor</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Mentor Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter mentor's full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                placeholder="e.g., Senior Software Engineer, Product Manager"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe the mentor's experience, expertise, and what they can help with..."
                rows={4}
                required
              />
            </div>

            <MentorImageUpload
              value={formData.image}
              onChange={(url) => handleInputChange("image", url)}
            />

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag (e.g., JavaScript, React)"
                />
                <Button
                  type="button"
                  onClick={addTag}
                  disabled={!newTag.trim()}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Updating..." : "Update Mentor"}
              </Button>
              <Link href="/dashboard/webdata/mentor" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 