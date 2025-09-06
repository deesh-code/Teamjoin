// React for building components and managing state
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { search } from "../lib/api";

// Import our UI components from the design system
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Search component - allows users to search for ideas and users
export default function Search() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const { data: results, isLoading, isError, error } = useQuery({
    queryKey: ["search", submittedQuery],
    queryFn: () => search(submittedQuery),
    enabled: !!submittedQuery, // only run the query if it's not empty
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedQuery(query);
  };

  const ideas = results?.filter((result) => result.type === "idea") || [];
  const users = results?.filter((result) => result.type === "user") || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Search</h1>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for ideas or users..."
          className="flex-grow"
        />
        <Button type="submit">Search</Button>
      </form>

      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-500">{error.message}</p>}

      {results && (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Ideas</h2>
            {ideas.length > 0 ? (
              <div className="space-y-4">
                {ideas.map((result) => (
                  <Card key={result.data.id}>
                    <CardHeader>
                      <CardTitle>{result.data.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{result.data.sub_title}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p>No ideas found.</p>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Users</h2>
            {users.length > 0 ? (
              <div className="space-y-4">
                {users.map((result) => (
                  <Card key={result.data.uuid}>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={result.data.user_data?.avatar} />
                          <AvatarFallback>{result.data.user_data?.name?.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle>{result.data.user_data?.name}</CardTitle>
                          <p className="text-muted-foreground">{result.data.user?.email}</p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <p>No users found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
