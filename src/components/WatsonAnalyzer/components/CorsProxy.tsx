
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CorsProxyProps {
  className?: string;
}

const CorsProxy: React.FC<CorsProxyProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [proxyUrl, setProxyUrl] = useState(() => {
    return sessionStorage.getItem('cors_proxy_url') || "https://cors-anywhere.herokuapp.com/";
  });

  const handleSave = () => {
    sessionStorage.setItem('cors_proxy_url', proxyUrl);
    toast({
      title: "CORS proxy settings saved",
      description: "Your CORS proxy settings have been updated.",
    });
    setIsOpen(false);
  };

  const handleTestProxy = async () => {
    try {
      toast({
        title: "Testing CORS proxy",
        description: "Sending a test request...",
      });
      
      // Try a simple request through the proxy
      const response = await fetch(`${proxyUrl}https://httpbin.org/get`);
      if (response.ok) {
        toast({
          title: "CORS proxy test successful",
          description: "The proxy appears to be working correctly.",
        });
      } else {
        toast({
          title: "CORS proxy test failed",
          description: "The proxy returned an error. Check the console for details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("CORS proxy test error:", error);
      toast({
        title: "CORS proxy test failed",
        description: "Could not connect to the proxy. Check the console for details.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Shield className="mr-2 h-4 w-4" />
          CORS Proxy
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>CORS Proxy Configuration</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-sm text-muted-foreground">
            <p>
              Configure a CORS proxy to enable direct API calls to Anthropic's Claude API from your browser.
              This is typically needed during development or for client-side applications.
            </p>
            
            <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
              <p className="text-amber-800 dark:text-amber-300 text-xs">
                <strong>Note:</strong> For production use, it's recommended to set up a proper backend 
                service or serverless function to handle API calls securely.
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="proxy-url">CORS Proxy URL</Label>
            <Input
              id="proxy-url"
              placeholder="https://cors-anywhere.herokuapp.com/"
              value={proxyUrl}
              onChange={(e) => setProxyUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter the URL of a CORS proxy service (including the trailing slash).
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              Save Settings
            </Button>
            <Button onClick={handleTestProxy} variant="outline" className="flex-1">
              Test Proxy
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground mt-4">
            <p>
              Popular CORS proxy services:
            </p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>
                <a 
                  href="https://cors-anywhere.herokuapp.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center hover:underline"
                >
                  CORS Anywhere
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/Rob--W/cors-anywhere" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center hover:underline"
                >
                  Run your own proxy
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CorsProxy;
