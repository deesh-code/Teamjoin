// React for building components and managing state
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createIdea } from "../lib/api";

// Import our UI components from the design system
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Icons from lucide-react library
import { Plus, Upload, Globe, BookOpen } from "lucide-react";

// Select dropdown component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// List of available project categories
const categories = ["EdTech", "AI/ML", "FinTech", "Health", "Productivity"];

// Default roles that users can add to their projects
const roles = [
  { name: "Full-stack Developer", count: 1, skills: ["Node/Next"] },
  { name: "Product Designer", count: 1, skills: ["UX/UI"] },
  { name: "Growth Marketer", count: 1, skills: ["SEO/Social"] }
];

// CreateTeamBox component - this lets users create new project ideas
export default function CreateTeamBox() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // State to track which categories are selected
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  // State to track the project roles and their counts
  const [projectRoles, setProjectRoles] = useState(roles);
  
  // State for form inputs with default values
  const [title, setTitle] = useState("AI Study Buddy");
  const [subTitle, setSubTitle] = useState("A personalized learning assistant for college students.");
  const [description, setDescription] = useState("Describe what you're building, the problem, and why now...");
  const [maxMembers, setMaxMembers] = useState("5");
  const [visibility, setVisibility] = useState("public");

  const createIdeaMutation = useMutation({
    mutationFn: createIdea,
    onSuccess: () => {
      queryClient.invalidateQueries(["feed"]);
      navigate("/discover");
    },
  });

  // Function to add/remove categories when user clicks on them
  function toggleCategory(category) {
    setSelectedCategories(previousCategories => 
      // If category is already selected, remove it. Otherwise, add it.
      previousCategories.includes(category) 
        ? previousCategories.filter(c => c !== category)
        : [...previousCategories, category]
    );
  }

  // Function to increase or decrease the count for a specific role
  function updateRoleCount(roleIndex, increment) {
    setProjectRoles(previousRoles => previousRoles.map((role, index) => 
      // Only update the role at the specified index
      index === roleIndex 
        ? { ...role, count: Math.max(0, role.count + (increment ? 1 : -1)) }
        : role
    ));
  }

  function handleSubmit() {
    createIdeaMutation.mutate({
      title,
      sub_title: subTitle,
      full_explained_idea: description,
    });
  }

  return (
    // Main container - centers content and adds fade animation
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Grid layout - 2 columns on large screens, 1 column on small */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left side - Main form takes up 2/3 of the width */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Page header with title and guidelines button */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-foreground">Create TeamBox</h1>
            <Button variant="outline" size="sm">
              <BookOpen className="h-4 w-4 mr-2" />
              Guidelines
            </Button>
          </div>

          {/* Project Details Card */}
          <Card className="bg-card border-border">
            <CardHeader>
              <h3 className="text-xl font-semibold text-foreground">Project details</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Project title input */}
              <div>
                <Label htmlFor="title" className="text-foreground">Title</Label>
                <Input 
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1"
                  placeholder="Enter your project title"
                />
              </div>

              <div>
                <Label htmlFor="sub-title" className="text-foreground">Sub Title</Label>
                <Input 
                  id="sub-title"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  className="mt-1"
                  placeholder="Enter a short subtitle"
                />
              </div>
              
              {/* Project description textarea */}
              <div>
                <Label htmlFor="description" className="text-foreground">Description</Label>
                <Textarea 
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="mt-1"
                  placeholder="Describe your project idea..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tip: Include goals, audience, tech stack, and milestones.
                </p>
              </div>
              
              {/* Category selection - users can click to select multiple */}
              <div>
                <Label className="text-foreground">Category</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {/* Loop through each category and create a clickable badge */}
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      // Change appearance based on whether it's selected
                      variant={selectedCategories.includes(category) ? "default" : "secondary"}
                      className="cursor-pointer hover:bg-primary/80 transition-colors"
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Required Roles */}
          <Card className="bg-surface-elevated">
            <CardHeader>
              <h3 className="text-xl font-semibold">Required roles</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {projectRoles.map((role, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-muted">
                      {role.name === "Full-stack Developer" && "💻"}
                      {role.name === "Product Designer" && "🎨"}
                      {role.name === "Growth Marketer" && "📈"}
                    </div>
                    <div>
                      <h4 className="font-medium">{role.name}</h4>
                      <div className="flex gap-1 mt-1">
                        {role.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateRoleCount(index, false)}
                      disabled={role.count === 0}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-medium">{role.count}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateRoleCount(index, true)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add as many roles as you need.
              </Button>
            </CardContent>
          </Card>

          {/* Max Members */}
          <Card className="bg-surface-elevated">
            <CardHeader>
              <h3 className="text-xl font-semibold">Max members</h3>
            </CardHeader>
            <CardContent>
              <Input 
                type="number"
                value={maxMembers}
                onChange={(e) => setMaxMembers(e.target.value)}
                min="1"
                max="10"
                className="w-24"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Logo/Image Upload */}
          <Card className="bg-surface-elevated">
            <CardHeader>
              <h3 className="font-semibold">Logo / Image</h3>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-1">Upload image</p>
                <p className="text-xs text-text-secondary">PNG, JPG up to 5MB</p>
              </div>
              
              {/* Preview Image */}
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Preview</p>
                <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-text-secondary">No image selected</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visibility */}
          <Card className="bg-surface-elevated">
            <CardHeader>
              <h3 className="font-semibold">Visibility</h3>
            </CardHeader>
            <CardContent>
              <RadioGroup value={visibility} onValueChange={setVisibility}>
                <div className="flex items-center space-x-2 p-3 rounded-lg border">
                  <RadioGroupItem value="public" id="public" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <Label htmlFor="public" className="font-medium">Public</Label>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                      Public projects appear in Discover and can receive requests.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button variant="outline" className="w-full">
              Save draft
            </Button>
            <Button className="w-full gradient-brand" onClick={handleSubmit} disabled={createIdeaMutation.isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              {createIdeaMutation.isLoading ? "Creating..." : "Create TeamBox"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}