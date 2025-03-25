
import React from "react";
import Layout from "@/components/layout/Layout";
import UserSearch from "@/components/UserSearch";

const UserSearchPage = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Find People</h1>
          <p className="text-muted-foreground mb-8">
            Search for other users by their username or name to view their profile and connect.
          </p>
          
          <UserSearch />
        </div>
      </div>
    </Layout>
  );
};

export default UserSearchPage;
