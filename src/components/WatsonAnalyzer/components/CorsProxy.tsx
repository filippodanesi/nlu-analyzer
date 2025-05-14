
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ExternalLink, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CorsProxyProps {
  className?: string;
}

const CorsProxy: React.FC<CorsProxyProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [proxyUrl, setProxyUrl] = useState(() => {
    return sessionStorage.getItem('cors_proxy_url') || "";
  });
  const [proxyStatus, setProxyStatus] = useState<'unknown' | 'working' | 'error'>('unknown');

  // Check if proxy is set when component mounts
  useEffect(() => {
    const storedProxy = sessionStorage.getItem('cors_proxy_url');
    if (storedProxy) {
      setProxyUrl(storedProxy);
      setProxyStatus('unknown');
    }
  }, []);

  const handleSave = () => {
    // Ensure the URL ends with a trailing slash or question mark for proper concatenation
    let formattedUrl = proxyUrl.trim();
    
    // Don't save empty URL (will use defaults based on environment)
    if (formattedUrl === "") {
      sessionStorage.removeItem('cors_proxy_url');
      toast({
        title: "CORS proxy settings cleared",
        description: "Default proxy settings will be used.",
      });
      setIsOpen(false);
      return;
    }
    
    // Format the URL properly depending on the proxy type
    if (formattedUrl.includes("?url=")) {
      // Format for proxies that use ?url= parameter
      if (!formattedUrl.endsWith("=")) {
        formattedUrl = formattedUrl + "=";
      }
    } else if (!formattedUrl.endsWith("?") && !formattedUrl.endsWith("/")) {
      // For other proxies ensure we have a separator
      formattedUrl = formattedUrl + "/";
    }
    
    sessionStorage.setItem('cors_proxy_url', formattedUrl);
    toast({
      title: "CORS proxy settings saved",
      description: "Your CORS proxy settings have been updated.",
    });
    setIsOpen(false);
    
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event('storage'));
  };

  const handleTestProxy = async () => {
    try {
      setProxyStatus('unknown');
      toast({
        title: "Testing CORS proxy",
        description: "Sending a test request...",
      });
      
      // Format the URL as we would in the actual API call
      let testUrl;
      
      if (proxyUrl.includes("?url=")) {
        testUrl = `${proxyUrl}${encodeURIComponent("https://httpbin.org/get")}`;
      } else {
        testUrl = `${proxyUrl}https://httpbin.org/get`;
      }
      
      // Try a simple request through the proxy
      const response = await fetch(testUrl);
      if (response.ok) {
        setProxyStatus('working');
        toast({
          title: "CORS proxy test successful",
          description: "The proxy appears to be working correctly.",
        });
      } else {
        setProxyStatus('error');
        toast({
          title: "CORS proxy test failed",
          description: "The proxy returned an error. Check the console for details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("CORS proxy test error:", error);
      setProxyStatus('error');
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
                <strong>Important:</strong> Anthropic now requires the <code>anthropic-dangerous-direct-browser-access</code> header
                for browser-based API calls. This application adds this header automatically.
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="proxy-url">CORS Proxy URL</Label>
            <Input
              id="proxy-url"
              placeholder="https://corsproxy.io/?"
              value={proxyUrl}
              onChange={(e) => setProxyUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Enter the URL of a CORS proxy service. Leave empty to use default proxies.
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
              Recommended CORS proxy services:
            </p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>
                <a 
                  href="https://corsproxy.io/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center hover:underline"
                >
                  corsproxy.io/?
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://api.allorigins.win/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center hover:underline"
                >
                  api.allorigins.win/raw?url=
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
