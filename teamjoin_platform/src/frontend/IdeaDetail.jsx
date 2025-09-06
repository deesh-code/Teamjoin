// React for building components
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchIdeaById, requestToJoinIdea } from "../lib/api";

// Import our UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Router hook to get the ID from the URL
import { useParams } from "react-router-dom";

// IdeaDetail component - shows details for a specific project idea
function IdeaDetail() {
  const queryClient = useQueryClient();
  // Get the project ID from the URL (like /idea/123)
  const { id } = useParams();
  
  // State to track if user has joined this team
  const [hasJoined, setHasJoined] = useState(false);

  const { data: projectData, isLoading, isError, error } = useQuery({
    queryKey: ["idea", id],
    queryFn: () => fetchIdeaById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const joinMutation = useMutation({
    mutationFn: requestToJoinIdea,
    onSuccess: () => {
      setHasJoined(true);
      queryClient.invalidateQueries(["idea", id]);
    },
  });
  
  // Function that runs when user clicks "Join Team"
  function handleJoinTeam() {
    joinMutation.mutate(id);
  }

  if (isLoading) {
    return <div className="space-y-6">Loading idea details...</div>;
  }

  if (isError) {
    return <div className="space-y-6 text-red-500">Error loading idea details: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Page header with title and join button */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Idea Details</h1>
        
        <Button 
          onClick={handleJoinTeam}
          disabled={hasJoined || joinMutation.isLoading}
          variant={hasJoined ? "secondary" : "default"}
          size="lg"
        >
          {hasJoined ? "Joined!" : "Join Team"}
        </Button>
      </div>
      
      {/* Main project card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            {/* Project avatar */}
            <Avatar className="h-16 w-16">
              <AvatarImage src={projectData.image_url || "/placeholder.svg"} />
              <AvatarFallback className="bg-brand-primary text-primary-foreground text-lg">
                {projectData.title.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            
            {/* Project title and creator */}
            <div>
              <CardTitle className="text-2xl text-foreground">
                {projectData.title}
              </CardTitle>
              <p className="text-muted-foreground">
                Created by {projectData.user_id}
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Project description section */}
          <div>
            <h3 className="font-semibold mb-2 text-foreground">Description</h3>
            <p className="text-muted-foreground">
              {projectData.full_explained_idea}
            </p>
          </div>
          
          {/* Required skills section */}
          <div>
            <h3 className="font-semibold mb-2 text-foreground">Required Skills</h3>
            <div className="flex gap-2 flex-wrap">
              {/* Loop through each skill and create a badge */}
              {projectData.tags && projectData.tags.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Team members section */}
          <div>
            <h3 className="font-semibold mb-2 text-foreground">Team Members</h3>
            <div className="flex gap-2">
              {/* Loop through each team member and show their avatar */}
              {projectData.members && projectData.members.map((member, index) => (
                <Avatar key={index} className="h-10 w-10">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-brand-primary text-primary-foreground">
                    {member.user_id.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Success message when user joins */}
      {hasJoined && (
        <Card className="border-success bg-success/5">
          <CardContent className="pt-6">
            <p className="text-success font-medium">
              🎉 You've successfully requested to join this team! The project creator will be in touch soon.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Export the component so other files can use it
export default IdeaDetail;
