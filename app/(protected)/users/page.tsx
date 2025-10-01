"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UserEditModal } from "@/components/UserEditModal";
import { AuthService } from "@/lib/AuthService";
import { User } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Ban, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

interface PaginatedUsers {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 300);
  const PAGE_SIZE = 10;

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [actionType, setActionType] = useState<"delete" | "block" | "unblock">(
    "delete"
  );
  const [userIdToAction, setUserIdToAction] = useState<string | null>(null);

  const fetchUsers = async (page: number) => {
    const data: PaginatedUsers = await AuthService.getUsersPaginated(
      page,
      debouncedSearch
    );
    setUsers(data.results);
    setTotalPages(Math.ceil(data.count / PAGE_SIZE));
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, debouncedSearch]);

  const handleUpdate = (user: User) => {
    console.log(user);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (userId: string) => {
    setActionType("delete");
    setUserIdToAction(userId);
    setIsConfirmOpen(true);
  };

  const handleBlockClick = (userId: string) => {
    setActionType("block");
    setUserIdToAction(userId);
    setIsConfirmOpen(true);
  };

  const handleToggleActiveClick = (userId: string, isBlocked: boolean) => {
    setActionType(isBlocked ? "unblock" : "block");
    setUserIdToAction(userId);
    setIsConfirmOpen(true);
  };

  const confirmAction = async () => {
    if (!userIdToAction) return;

    try {
      if (actionType === "delete") {
        await AuthService.deleteUser(userIdToAction);
        toast.success("User deleted successfully.");
      } else if (actionType === "block") {
        await AuthService.blockUser(userIdToAction);
        toast.success("User blocked successfully.");
      } else if (actionType === "unblock") {
        await AuthService.unblockUser(userIdToAction);
        toast.success("User unblocked successfully.");
      }
      fetchUsers(currentPage);
    } catch (error: any) {
      console.error(`${actionType} failed`, error);

      if (error.response?.status === 404) {
        toast.error("User not found (maybe the path not correct).");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to perform this action.");
      } else if (error.response?.status === 401) {
        toast.error("You are not authorized. Please login again.");
      } else {
        toast.error(`Failed to ${actionType} user. Please try again.`);
      }
    } finally {
      setIsConfirmOpen(false);
      setUserIdToAction(null);
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "first_name",
      header: "First Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("first_name")}</span>
      ),
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("last_name")}</span>
      ),
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => (
        <span className="text-blue-600">{row.getValue("username")}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        const isBlocked = !user.is_active;

        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="brand"
              onClick={() => handleUpdate(user)}
            >
              <Edit className="size-4" />
              Update
            </Button>

            <Button
              size="sm"
              variant="delete"
              onClick={() => handleDeleteClick(user.id)}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>

            <Button
              size="sm"
              variant={isBlocked ? "brand" : "block"}
              onClick={() => handleToggleActiveClick(user.id, isBlocked)}
            >
              <Ban className="size-4" />
              {isBlocked ? "Unblock" : "Block"}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6 text-amber-500">
            User Management
          </h1>

          <div className="mb-6 flex justify-between items-center">
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => {
                setCurrentPage(1);
                setSearchQuery(e.target.value);
              }}
              className="w-full max-w-md border-amber-500 focus:border-yellow-600 focus:ring-amber-500 rounded-lg"
            />
            <div className="text-sm text-amber-500">
              Showing {users.length} of {totalPages * PAGE_SIZE} users
            </div>
          </div>

          <div className="mb-6 border rounded-lg overflow-hidden">
            <DataTable columns={columns} data={users} />
          </div>

          <div className="flex items-center justify-between mt-6">
            <Button
              variant="brand"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "brand" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 ${
                      currentPage === page
                        ? "bg-amber-500 text-white hover:bg-amber-600"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="brand"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* User Edit Modal */}
      {selectedUser && (
        <UserEditModal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          onUpdated={() => {
            fetchUsers(currentPage);
            setIsModalOpen(false);
          }}
        />
      )}

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-amber-600">
              {actionType === "delete" ? "Confirm Deletion" : "Confirm Block"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "delete"
                ? "Are you sure you want to delete this user? This action cannot be undone."
                : "Are you sure you want to block this user? They will lose access to the system."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              variant={actionType === "delete" ? "delete" : "block"}
              onClick={confirmAction}
            >
              {actionType === "delete" ? (
                <>
                  <Trash2 className="size-4" />
                  <span>Confirm Delete</span>
                </>
              ) : (
                <>
                  <Ban className="size-4" />
                  <span>Confirm Block</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
