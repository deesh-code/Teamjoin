// React for building components and managing state
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFeed, requestToJoinIdea } from "../lib/api";

// Import our UI components from the design system
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Icons from lucide-react library
import { Filter, Users, Search } from "lucide-react";

// Select dropdown component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Filter options for the discover page
const categories = ["All", "AI", "Fintech", "Health", "EdTech", "Marketplace", "Social", "Travel", "Wellness"];

// Discover component - shows all available project ideas that users can join
export default function Discover() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  // State to track which category filter is selected
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // State to track which projects the user has requested to join
  const [requestedProjects, setRequestedProjects] = useState([]);

  const { data: projects, isLoading, isError, error } = useQuery({
    queryKey: ["feed"],
    queryFn: fetchFeed,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const joinMutation = useMutation({
    mutationFn: requestToJoinIdea,
    onSuccess: (data) => {
      setRequestedProjects(previousRequests => [...previousRequests, data.idea_id]);
      queryClient.invalidateQueries(["feed"]);
    },
  });

  // Function that runs when user clicks "Request to Join" on a project
  function handleRequestJoin(projectId) {
    joinMutation.mutate(projectId);
  }

  const filteredProjects = projects?.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="space-y-6 animate-fade-in">Loading ideas...</div>;
  }

  if (isError) {
    return <div className="space-y-6 animate-fade-in text-red-500">Error loading ideas: {error.message}</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Discover Ideas</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search ideas..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Category:</span>
          <div className="flex gap-2">
            {categories.slice(0, 6).map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "secondary"}
                className="cursor-pointer hover:bg-primary/80 transition-colors"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4 ml-auto">
          <Select defaultValue="trending">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="members">Most Members</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects && filteredProjects.map((project, index) => (
          <Card 
            key={project.id} 
            className="card-hover bg-surface-elevated animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{project.title}</h3>
                  <p className="text-text-secondary text-sm mt-1 line-clamp-2">
                    {project.sub_title}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-3">
                {project.tags && project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {project.roles && project.roles.map((role) => (
                  <Badge key={role} className="text-xs bg-brand-secondary/10 text-brand-secondary hover:bg-brand-secondary/20">
                    {role}
                  </Badge>
                ))}
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Users className="h-4 w-4" />
                  <span>{project.members ? project.members.length : 0} members</span>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button 
                    size="sm"
                    className="gradient-brand"
                    disabled={requestedProjects.includes(project.id) || joinMutation.isLoading}
                    onClick={() => handleRequestJoin(project.id)}
                  >
                    {requestedProjects.includes(project.id) ? "Requested" : "Request to Join"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State - Show when no projects match filters */}
      {(!filteredProjects || filteredProjects.length === 0) && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No ideas yet. Be the first to create a TeamBox!</h3>
          <p className="text-text-secondary mb-4">
            Kickstart your startup journey by posting your idea and inviting collaborators.
          </p>
          <Button className="gradient-brand">
            Create TeamBox
          </Button>
        </div>
      )}
    </div>
  );
}