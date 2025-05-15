
import React, { useState, useEffect } from 'react';
import { CorsProxyDialog } from './CorsProxyDialog';
import { CorsProxyButton } from './CorsProxyButton';
import { toast } from "@/hooks/use-toast";
import { getCorsProxyUrl } from '../../utils/corsProxyUtils';

interface CorsProxyProps {
  className?: string;
}

const CorsProxy: React.FC<CorsProxyProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [proxyUrl, setProxyUrl] = useState(() => {
    return sessionStorage.getItem('cors_proxy_url') || "";
  });
  const [proxyStatus, setProxyStatus] = useState<'unknown' | 'working' | 'error'>('unknown');
  const [currentProxyUrl, setCurrentProxyUrl] = useState<string>("");

  // Check if proxy is set when component mounts
  useEffect(() => {
    const storedProxy = sessionStorage.getItem('cors_proxy_url');
    if (storedProxy) {
      setProxyUrl(storedProxy);
    }
    
    // Get and display the current active proxy
    setCurrentProxyUrl(getCorsProxyUrl());
    
    // Test the current proxy automatically when component mounts
    handleTestProxy();
    
    // Add event listener for storage changes
    const handleStorageChange = () => {
      setCurrentProxyUrl(getCorsProxyUrl());
      // Re-test the proxy when it changes
      handleTestProxy();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
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
      setCurrentProxyUrl(getCorsProxyUrl());
      setIsOpen(false);
      
      // Test the default proxy
      setTimeout(() => handleTestProxy(), 500);
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
    setCurrentProxyUrl(formattedUrl);
    setIsOpen(false);
    
    // Test the new proxy after saving
    setTimeout(() => handleTestProxy(), 500);
    
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event('storage'));
  };

  const handleTestProxy = async () => {
    try {
      setProxyStatus('unknown');
      
      // Format the URL as we would in the actual API call
      let testUrl;
      const testProxyUrl = proxyUrl || getCorsProxyUrl();
      
      if (testProxyUrl.includes("?url=")) {
        testUrl = `${testProxyUrl}${encodeURIComponent("https://httpbin.org/get")}`;
      } else {
        testUrl = `${testProxyUrl}https://httpbin.org/get`;
      }
      
      // Add CORS proxy headers if using cors.sh
      const headers: Record<string, string> = {};
      if (testProxyUrl.includes("cors.sh")) {
        headers["x-cors-api-key"] = "live_0df03e15b7f1bdf27d12ee406841eed5866d880e2dec98dd37db703033e23734";
      }
      
      // Try a simple request through the proxy
      const startTime = Date.now();
      const response = await fetch(testUrl, { headers });
      
      if (response.ok) {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        setProxyStatus('working');
        console.log(`CORS proxy test successful in ${responseTime}ms`);
        
        // Only show toast if dialog is open (avoid spam during auto-tests)
        if (isOpen) {
          toast({
            title: "CORS proxy test successful",
            description: `The proxy appears to be working correctly (${responseTime}ms).`,
          });
        }
      } else {
        setProxyStatus('error');
        console.error(`CORS proxy test failed with status: ${response.status}`);
        toast({
          title: "CORS proxy test failed",
          description: `The proxy returned an error: ${response.status} ${response.statusText}`,
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
    <CorsProxyDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      proxyUrl={proxyUrl}
      setProxyUrl={setProxyUrl}
      proxyStatus={proxyStatus}
      currentProxyUrl={currentProxyUrl}
      handleSave={handleSave}
      handleTestProxy={handleTestProxy}
    >
      <CorsProxyButton className={className} proxyStatus={proxyStatus} />
    </CorsProxyDialog>
  );
};

export default CorsProxy;
