"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChevronDown, CheckCircle2, XCircle, Ban, Pause } from "lucide-react";

type TenantStatus = "active" | "inactive" | "suspended" | "banned";

interface StatusCellProps {
  tenantId: string;
  currentStatus: TenantStatus;
  statusReason?: string | null;
}

const statusConfig = {
  active: {
    label: "Active",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle2,
  },
  inactive: {
    label: "Inactive",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: Pause,
  },
  suspended: {
    label: "Suspended",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Ban,
  },
  banned: {
    label: "Banned",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
  },
};

export function StatusCell({ tenantId, currentStatus, statusReason }: StatusCellProps) {
  const [status, setStatus] = useState<TenantStatus>(currentStatus);
  const [reason, setReason] = useState(statusReason || "");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TenantStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const config = statusConfig[status];
  const Icon = config.icon;

  const handleStatusChange = (newStatus: TenantStatus) => {
    // If changing to suspended or banned, show dialog for reason
    if (newStatus === "suspended" || newStatus === "banned") {
      setPendingStatus(newStatus);
      setIsDialogOpen(true);
    } else {
      updateStatus(newStatus, "");
    }
  };

  const updateStatus = async (newStatus: TenantStatus, newReason: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, reason: newReason }),
      });

      if (response.ok) {
        setStatus(newStatus);
        setReason(newReason);
        setIsDialogOpen(false);
        setPendingStatus(null);
        window.location.reload();
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`${config.color} border hover:opacity-80`}
          >
            <Icon className="w-3 h-3 mr-1" />
            {config.label}
            <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {Object.entries(statusConfig).map(([key, cfg]) => {
            const ItemIcon = cfg.icon;
            return (
              <DropdownMenuItem
                key={key}
                onClick={() => handleStatusChange(key as TenantStatus)}
                disabled={key === status}
              >
                <ItemIcon className="w-4 h-4 mr-2" />
                {cfg.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingStatus === "suspended" ? "Suspend" : "Ban"} Tenant
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for {pendingStatus === "suspended" ? "suspending" : "banning"} this tenant.
              This will be shown to users when they try to access the site.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="e.g., Payment overdue, Terms violation, etc."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setPendingStatus(null);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => pendingStatus && updateStatus(pendingStatus, reason)}
              disabled={isLoading || !reason.trim()}
            >
              {isLoading ? "Updating..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
