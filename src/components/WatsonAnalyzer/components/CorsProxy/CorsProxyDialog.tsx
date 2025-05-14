
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CorsProxyContent } from './CorsProxyContent';

interface CorsProxyDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  proxyUrl: string;
  setProxyUrl: (url: string) => void;
  proxyStatus: 'unknown' | 'working' | 'error';
  currentProxyUrl: string;
  handleSave: () => void;
  handleTestProxy: () => void;
}

export const CorsProxyDialog: React.FC<CorsProxyDialogProps> = ({
  isOpen,
  setIsOpen,
  proxyUrl,
  setProxyUrl,
  proxyStatus,
  currentProxyUrl,
  handleSave,
  handleTestProxy
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>CORS Proxy Configuration</DialogTitle>
        </DialogHeader>
        
        <CorsProxyContent 
          proxyUrl={proxyUrl}
          setProxyUrl={setProxyUrl}
          proxyStatus={proxyStatus}
          currentProxyUrl={currentProxyUrl}
          handleSave={handleSave}
          handleTestProxy={handleTestProxy}
        />
      </DialogContent>
    </Dialog>
  );
};
