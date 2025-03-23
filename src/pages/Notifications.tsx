
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useNotifications } from "@/components/header/notifications/useNotifications";
import NotificationItem from "@/components/header/notifications/NotificationItem";
import { markNotificationAsRead } from "@/utils/notificationHelpers";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Notification } from "@/components/header/notifications/types";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  // We're using the same hook but passing a larger limit and pagination params
  const { notifications, isLoading, fetchNotifications } = useNotifications(100, (currentPage - 1) * pageSize);

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.is_read) {
      await markNotificationAsRead(notification.id);
      // Refresh the notifications after marking as read
      fetchNotifications();
    }
    
    // Handle navigation based on notification type
    if (notification.type === 'match' && notification.related_entity_id) {
      navigate(`/matches/${notification.related_entity_id}`);
    } 
    else if (notification.type === 'message' && notification.related_entity_id) {
      navigate(`/chat/${notification.related_entity_id}`);
    }
    else if (notification.type === 'view' && notification.related_entity_id) {
      navigate(`/profile/${notification.related_entity_id}`);
    }
    else {
      // Default fallback
      navigate('/dashboard');
    }
  };

  const totalPages = Math.ceil(notifications.length / pageSize);
  const currentNotifications = notifications.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Your notification history
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {currentNotifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    You don't have any notifications yet
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentNotifications.map((notification) => (
                        <TableRow 
                          key={notification.id} 
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <TableCell>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              notification.type === 'match' ? 'bg-red-100 text-red-600' : 
                              notification.type === 'message' ? 'bg-blue-100 text-blue-600' : 
                              'bg-green-100 text-green-600'
                            }`}>
                              {notification.type === 'match' && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                              )}
                              {notification.type === 'message' && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                              )}
                              {notification.type === 'view' && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{notification.message}</TableCell>
                          <TableCell>{new Date(notification.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {notification.is_read ? (
                              <span className="text-muted-foreground">Read</span>
                            ) : (
                              <span className="text-blue-500 font-medium">New</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {totalPages > 1 && (
                  <Pagination className="mt-4">
                    <PaginationContent>
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(currentPage - 1)} 
                          />
                        </PaginationItem>
                      )}
                      
                      {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }
                        
                        if (pageNumber > 0 && pageNumber <= totalPages) {
                          return (
                            <PaginationItem key={i}>
                              <PaginationLink
                                isActive={currentPage === pageNumber}
                                onClick={() => setCurrentPage(pageNumber)}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}
                      
                      {currentPage < totalPages && (
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage(currentPage + 1)}
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NotificationsPage;
