
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleUpdateProfile = () => {
    navigate("/profile");
  };

  const handleFindMatches = () => {
    navigate("/matches");
  };

  return (
    <Layout className="pt-28 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your match overview.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="rounded-lg" onClick={handleUpdateProfile}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Update Profile
            </Button>
            <Button className="rounded-lg" onClick={handleFindMatches}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Find Matches
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="card-glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M12.5 7C12.5 9.20914 10.7091 11 8.5 11C6.29086 11 4.5 9.20914 4.5 7C4.5 4.79086 6.29086 3 8.5 3C10.7091 3 12.5 4.79086 12.5 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Profile Completion</h3>
                <p className="text-sm text-muted-foreground">Complete your profile</p>
              </div>
            </div>
            <div className="bg-secondary rounded-full h-2 mb-2">
              <div className="bg-blue-500 h-2 rounded-full w-[75%]"></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">75% complete</span>
              <Link to="/profile" className="text-blue-600 font-medium">Complete Now</Link>
            </div>
          </div>
          
          <div className="card-glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">New Messages</h3>
                <p className="text-sm text-muted-foreground">From your connections</p>
              </div>
            </div>
            <div className="text-3xl font-bold mb-2">5</div>
            <Link to="/chat" className="text-blue-600 text-sm font-medium">View Messages</Link>
          </div>
          
          <div className="card-glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.42 4.58C19.9183 4.07659 19.3222 3.67728 18.6658 3.40463C18.0094 3.13198 17.3057 2.99175 16.595 2.992C15.8843 2.99224 15.1808 3.13295 14.5247 3.40603C13.8686 3.67911 13.273 4.07881 12.772 4.583C11.736 5.623 11.256 7.033 11.387 8.433L6 13.83V18H10.18L15.58 12.62C16.98 12.749 18.39 12.271 19.43 11.233C20.9669 9.69319 20.9669 7.23081 19.43 5.691L20.42 4.58ZM9 16H8V15H7V14H8.59L13.409 9.174C13.3975 8.84019 13.4336 8.50753 13.5161 8.18506C13.5986 7.86258 13.7262 7.55419 13.894 7.271L14 7.172C14.1667 7.00323 14.36 6.8641 14.5718 6.75946C14.7836 6.65482 15.0113 6.5862 15.2442 6.5562C15.4771 6.5262 15.7121 6.5352 15.9415 6.58291C16.1708 6.63062 16.3914 6.71645 16.592 6.835L9 14.41V15H10V16H9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">New Matches</h3>
                <p className="text-sm text-muted-foreground">Based on your preferences</p>
              </div>
            </div>
            <div className="text-3xl font-bold mb-2">12</div>
            <Link to="/matches" className="text-blue-600 text-sm font-medium">View Matches</Link>
          </div>
        </div>
        
        <div className="card-glass rounded-xl p-6 mb-12">
          <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { type: "match", name: "Alex", time: "2 hours ago" },
              { type: "message", name: "Taylor", time: "Yesterday" },
              { type: "view", name: "Jamie", time: "2 days ago" },
              { type: "connect", name: "Riley", time: "3 days ago" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  {activity.type === "match" && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 2.99871 7.05 2.99871C5.59096 2.99871 4.19169 3.57831 3.16 4.61C2.12831 5.64169 1.54871 7.04097 1.54871 8.5C1.54871 9.95903 2.12831 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93791 22.4518 9.22249 22.4518 8.5C22.4518 7.77751 22.3095 7.06209 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {activity.type === "message" && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {activity.type === "view" && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {activity.type === "connect" && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 18L18 20L22 16M12 15.5H7.5C6.10444 15.5 5.40665 15.5 4.83886 15.6722C3.56045 16.06 2.56004 17.0605 2.17224 18.3389C2 18.9067 2 19.6044 2 21M14.5 7.5C14.5 9.98528 12.4853 12 10 12C7.51472 12 5.5 9.98528 5.5 7.5C5.5 5.01472 7.51472 3 10 3C12.4853 3 14.5 5.01472 14.5 7.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {activity.type === "match" && `You matched with ${activity.name}`}
                    {activity.type === "message" && `${activity.name} sent you a message`}
                    {activity.type === "view" && `${activity.name} viewed your profile`}
                    {activity.type === "connect" && `${activity.name} requested to connect`}
                  </p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600">
                  View
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card-glass rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Your Top Matches</h2>
            <div className="space-y-4">
              {[
                { name: "Alex J.", match: 92, location: "San Francisco", img: "bg-blue-100" },
                { name: "Taylor M.", match: 87, location: "New York", img: "bg-purple-100" },
                { name: "Jamie C.", match: 89, location: "Chicago", img: "bg-green-100" },
              ].map((profile, index) => (
                <div key={index} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
                  <div className={`w-12 h-12 rounded-full ${profile.img} flex items-center justify-center`}>
                    <span className="text-lg font-light">{profile.name[0]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">{profile.name}</p>
                      <span className="text-sm bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                        {profile.match}% Match
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{profile.location}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link to="/matches" className="text-blue-600 text-sm font-medium">
                View All Matches
              </Link>
            </div>
          </div>
          
          <div className="card-glass rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Latest Messages</h2>
            <div className="space-y-4">
              {[
                { name: "Alex Johnson", message: "Hey, how are you doing today?", time: "2h ago", img: "bg-blue-100" },
                { name: "Taylor Moore", message: "I saw you like hiking too! Which trails do you recommend?", time: "5h ago", img: "bg-purple-100" },
                { name: "Jamie Chen", message: "Thanks for accepting my connection!", time: "1d ago", img: "bg-green-100" },
              ].map((message, index) => (
                <div key={index} className="flex items-start gap-4 py-2 border-b border-border last:border-0">
                  <div className={`w-12 h-12 rounded-full ${message.img} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-lg font-light">{message.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-medium">{message.name}</p>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{message.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link to="/chat" className="text-blue-600 text-sm font-medium">
                Open Chat
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
