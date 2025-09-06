import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "./components/Layout";
import Index from "./frontend/Index";
import Discover from "./frontend/Discover";
import Profile from "./frontend/Profile";
import TeamManagement from "./frontend/TeamManagement";
import CreateTeamBox from "./frontend/CreateTeamBox";
import IdeaDetail from "./frontend/IdeaDetail";
import NotFound from "./frontend/NotFound";
import Login from "./frontend/Login";
import Signup from "./frontend/Signup";
import OtpVerification from "./frontend/OtpVerification";


const queryClient = new QueryClient();

// TeamJoin - Connect with talented teammates and build together

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/team-management" element={<TeamManagement />} />
            <Route path="/create" element={<CreateTeamBox />} />
            <Route path="/idea/:id" element={<IdeaDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<OtpVerification />} />
         
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;