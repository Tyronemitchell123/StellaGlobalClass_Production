"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, Server, Zap } from "lucide-react";
import MetricsChart from "./MetricsChart";
import NetworkModal from "./NetworkModal";

interface Metric {
  type: string;
  payload: {
    name: string;
    at: number;
    server?: boolean;
  };
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [networkModalOpen, setNetworkModalOpen] = useState(false);
  const [apiBase, setApiBase] = useState("http://localhost:8000");
  const [wsUrl, setWsUrl] = useState("ws://localhost:8000/stream");
  const [jwt, setJwt] = useState("");
  const [smsPhone, setSmsPhone] = useState("");
  const [smsMessage, setSmsMessage] = useState("");
  const [recommendQuery, setRecommendQuery] = useState("");
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    if (isConnected && wsUrl && jwt) {
      const ws = new WebSocket(`${wsUrl}?token=${jwt}`);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMetrics((prev) => [...prev.slice(-49), data]); // Keep last 50
      };

      ws.onclose = () => setIsConnected(false);
      ws.onerror = () => setIsConnected(false);

      return () => ws.close();
    }
  }, [isConnected, wsUrl, jwt]);

  const handleConnect = () => {
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  const handleHeartbeat = async () => {
    if (!apiBase || !jwt) return;
    try {
      const response = await fetch(`${apiBase}/heartbeat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ at: Date.now() }),
      });
      if (!response.ok) throw new Error("Heartbeat failed");
    } catch (error) {
      console.error("Heartbeat error:", error);
    }
  };

  const handleSendSms = async () => {
    if (!apiBase || !jwt || !smsPhone || !smsMessage) return;
    try {
      const response = await fetch(`${apiBase}/send-sms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ to: smsPhone, message: smsMessage }),
      });
      if (!response.ok) throw new Error("SMS send failed");
      alert("SMS sent!");
      setSmsMessage("");
    } catch (error) {
      console.error("SMS error:", error);
      alert("Failed to send SMS");
    }
  };

  const handleGetRecommendations = async () => {
    if (!apiBase || !recommendQuery) return;
    try {
      const response = await fetch(`${apiBase}/recommend?q=${encodeURIComponent(recommendQuery)}`);
      if (!response.ok) throw new Error("Recommendations fetch failed");
      const data = await response.json();
      setRecommendations(data.suggestions);
    } catch (error) {
      console.error("Recommendations error:", error);
      alert("Failed to get recommendations");
    }
  };

  const recentMetrics = metrics.slice(-10).reverse();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Button
              onClick={() => setNetworkModalOpen(true)}
              variant="outline"
            >
              Network Settings
            </Button>
            {isConnected ? (
              <Button onClick={handleDisconnect} variant="destructive">
                Disconnect
              </Button>
            ) : (
              <Button onClick={handleConnect} disabled={!jwt}>
                Connect Secure Channel
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connection Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Badge variant={isConnected ? "default" : "secondary"}>
                  {isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Metrics</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Feeds</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connected Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Metrics Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <MetricsChart data={metrics} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{metric.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {metric.payload.name} {metric.payload.server ? "(server)" : ""}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(metric.payload.at).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                {recentMetrics.length === 0 && (
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Manual Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={handleHeartbeat} disabled={!isConnected}>
                  Send Heartbeat
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="sms-phone">Phone Number</Label>
                    <Input
                      id="sms-phone"
                      value={smsPhone}
                      onChange={(e) => setSmsPhone(e.target.value)}
                      placeholder="+1234567890"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="sms-message">Message</Label>
                    <Input
                      id="sms-message"
                      value={smsMessage}
                      onChange={(e) => setSmsMessage(e.target.value)}
                      placeholder="Enter SMS message"
                    />
                  </div>
                </div>
                <Button onClick={handleSendSms} disabled={!jwt || !smsPhone || !smsMessage}>
                  Send SMS
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="recommend-query">Recommendation Query</Label>
                    <Input
                      id="recommend-query"
                      value={recommendQuery}
                      onChange={(e) => setRecommendQuery(e.target.value)}
                      placeholder="e.g., movie, book, hobby"
                    />
                  </div>
                  <div>
                    <Label>&nbsp;</Label>
                    <Button onClick={handleGetRecommendations} disabled={!recommendQuery}>
                      Get Recommendations
                    </Button>
                  </div>
                </div>
                {recommendations.length > 0 && (
                  <div>
                    <Label>Recommendations:</Label>
                    <ul className="list-disc list-inside">
                      {recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <NetworkModal
          open={networkModalOpen}
          onOpenChange={setNetworkModalOpen}
          apiBase={apiBase}
          setApiBase={setApiBase}
          wsUrl={wsUrl}
          setWsUrl={setWsUrl}
          jwt={jwt}
          setJwt={setJwt}
        />
      </div>
    </div>
  );
}
