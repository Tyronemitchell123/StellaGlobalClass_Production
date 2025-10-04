"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NetworkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiBase: string;
  setApiBase: (value: string) => void;
  wsUrl: string;
  setWsUrl: (value: string) => void;
  jwt: string;
  setJwt: (value: string) => void;
}

export default function NetworkModal({
  open,
  onOpenChange,
  apiBase,
  setApiBase,
  wsUrl,
  setWsUrl,
  jwt,
  setJwt,
}: NetworkModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Network Settings</DialogTitle>
          <DialogDescription>
            Configure your backend API and WebSocket connections.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-base" className="text-right">
              API Base
            </Label>
            <Input
              id="api-base"
              value={apiBase}
              onChange={(e) => setApiBase(e.target.value)}
              className="col-span-3"
              placeholder="https://your-api.com"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ws-url" className="text-right">
              WebSocket
            </Label>
            <Input
              id="ws-url"
              value={wsUrl}
              onChange={(e) => setWsUrl(e.target.value)}
              className="col-span-3"
              placeholder="wss://your-api.com/stream"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="jwt" className="text-right">
              JWT Token
            </Label>
            <Input
              id="jwt"
              value={jwt}
              onChange={(e) => setJwt(e.target.value)}
              className="col-span-3"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
