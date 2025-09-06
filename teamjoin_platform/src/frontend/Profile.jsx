// React for building components and managing state
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile, fetchUserIdeas, fetchUserTeams } from "../lib/api";

// Import our UI components from the design system
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Icons from lucide-react library
import { ExternalLink, Github, Linkedin, Globe, Users, Edit } from "lucide-react";

// Profile component - shows user's profile information and project activity
export default function Profile() {
  // State to track which requests the user has withdrawn
  const [withdrawnRequests, setWithdrawnRequests] = useState([]);

  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: ideas } = useQuery({
    queryKey: ["userIdeas"],
    queryFn: fetchUserIdeas,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: teams } = useQuery({
    queryKey: ["userTeams"],
    queryFn: fetchUserTeams,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Function that runs when user clicks "Withdraw" on a pending request
  function handleWithdraw(requestId) {
    // Add this request ID to our withdrawn list
    setWithdrawnRequests(previousWithdrawn => [...previousWithdrawn, requestId]);
    console.log(`User withdrew request ${requestId}!`);
    // You can add API call logic here later
  }

  if (isLoading) {
    return <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">Loading profile...</div>;
  }

  if (isError) {
    return <div className="max-w-4xl mx-auto space-y-6 animate-fade-in text-red-500">Error loading profile: {error.message}</div>;
  }

  const joinedProjects = teams || [];
  const pendingRequests = ideas || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">User Profile</h1>
      </div>

      {/* Profile Section */}
      <Card className="bg-surface-elevated">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.user_data?.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-2xl">
                {profile?.user_data?.name ? profile.user_data.name.slice(0, 2) : "UN"}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">{profile?.user_data?.name || "User Name"}</h2>
              <p className="text-text-secondary mb-4 max-w-md">
                {profile?.user_data?.title || "No title provided."}
              </p>
              
              {/* Social Links */}
              <div className="flex gap-3 justify-center md:justify-start mb-4">
                {profile?.user_data?.social?.github && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profile.user_data.social.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {profile?.user_data?.social?.linkedin && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profile.user_data.social.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {profile?.user_data?.social?.portfolio && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profile.user_data.social.portfolio} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
              
              {/* Skills */}
              {profile?.skills && Object.keys(profile.skills).length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  {Object.keys(profile.skills).map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="flex gap-6 justify-center md:justify-start text-sm">
                <div>
                  <span className="font-semibold">Joined: {joinedProjects.length}</span>
                </div>
                <div>
                  <span className="font-semibold">Pending: {pendingRequests.length}</span>
                </div>
                <div>
                  <span className="font-semibold">Followers: 0</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit profile
              </Button>
              <Button className="gradient-brand">
                + New TeamBox
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Joined Projects */}
      <Card className="bg-surface-elevated">
        <CardHeader>
          <h3 className="text-xl font-semibold">Joined projects</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {joinedProjects.map((project) => (
            <div key={project.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{project.title.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{project.title}</h4>
                  <p className="text-sm text-text-secondary">
                    Role: {project.role || 'Owner'} • Joined: {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pending Requests */}
      <Card className="bg-surface-elevated">
        <CardHeader>
          <h3 className="text-xl font-semibold">Pending requests</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingRequests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{request.title.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{request.title}</h4>
                  <p className="text-sm text-text-secondary">
                    Requested: {request.role || 'Owner'} • {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                disabled={withdrawnRequests.includes(request.id)}
                onClick={() => handleWithdraw(request.id)}
              >
                {withdrawnRequests.includes(request.id) ? "Withdrawn" : "Withdraw"}
              </Button>
            </div>
          ))}
          
          <div className="text-center text-sm text-text-secondary pt-4 border-t">
            You can have up to 3 pending requests. Keep exploring to find your next team.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}