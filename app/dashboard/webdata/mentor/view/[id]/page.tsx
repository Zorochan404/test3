"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Trash2, Calendar, Clock } from "lucide-react";
import { getMentorById, deleteMentor, Mentor, SingleMentorResponse } from "../../apis";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { use } from "react";

interface ViewMentorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ViewMentorPage({ params }: ViewMentorPageProps) {
  const router = useRouter();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Unwrap the params Promise using React.use()
  const { id } = use(params);
  
  console.log("ViewMentorPage rendered with params:", params);
  console.log("Unwrapped ID:", id);
  console.log("Current URL:", window.location.href);
  console.log("=== VIEW PAGE LOADED ===");

  useEffect(() => {
    fetchMentor();
  }, [id]);

  const fetchMentor = async () => {
    try {
      setLoading(true);
      const response = await getMentorById(id);
      if (response.success && response.data) {
        setMentor(response.data);
      }
    } catch (error) {
      console.error("Error fetching mentor:", error);
      toast.error("Failed to fetch mentor");
      router.push("/dashboard/webdata/mentor");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!mentor?._id) return;
    
    try {
      await deleteMentor(mentor._id);
      toast.success("Mentor deleted successfully");
      router.push("/dashboard/webdata/mentor");
    } catch (error) {
      console.error("Error deleting mentor:", error);
      toast.error("Failed to delete mentor");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Link href="/dashboard/webdata/mentor">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Mentors
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Mentor Details</h1>
        </div>
        <Card className="max-w-4xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Link href="/dashboard/webdata/mentor">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Mentors
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Mentor Not Found</h1>
        </div>
        <Card className="max-w-4xl">
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">The mentor you're looking for doesn't exist or has been removed.</p>
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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Mentor Details</h1>
          <div className="flex gap-2">
            <Link href={`/dashboard/webdata/mentor/edit/${id}`}>
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{mentor.name}</CardTitle>
              <p className="text-gray-600 text-lg">{mentor.role}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{mentor.description}</p>
                </div>
                
                {mentor.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Expertise & Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {mentor.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          {(mentor.createdAt || mentor.updatedAt) && (
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mentor.createdAt && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Created: {formatDate(mentor.createdAt)}</span>
                    </div>
                  )}
                  {mentor.updatedAt && mentor.updatedAt !== mentor.createdAt && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Last updated: {formatDate(mentor.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Image and Quick Info */}
        <div className="space-y-6">
          {mentor.image && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Image</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={mentor.image}
                  alt={mentor.name}
                  className="w-full h-64 object-cover rounded-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{mentor.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium">{mentor.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Skills</p>
                  <p className="font-medium">{mentor.tags.length} skills listed</p>
                </div>
                {mentor._id && (
                  <div>
                    <p className="text-sm text-gray-500">ID</p>
                    <p className="font-mono text-xs bg-gray-100 p-2 rounded">
                      {mentor._id}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Mentor</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{mentor.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 