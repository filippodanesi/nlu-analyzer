
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { JinaReaderService } from '../utils/JinaReaderService';
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface UrlInputSectionProps {
  text: string;
  setText: (text: string) => void;
}

const UrlInputSection: React.FC<UrlInputSectionProps> = ({
  text,
  setText
}) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKey, setApiKey] = useState(() => JinaReaderService.getApiKey() || '');

  const handleExtract = async () => {
    if (!url) {
      toast({
        title: "URL required",
        description: "Please enter a URL to extract",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Format the URL properly if it doesn't include http/https
      let formattedUrl = url;
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }

      const response = await JinaReaderService.readUrl(formattedUrl);

      if (response.success) {
        setText(response.text);
        toast({
          title: "Content extracted",
          description: "Clean text has been extracted from the URL via Jina Reader.",
        });
      } else {
        toast({
          title: "Extraction failed",
          description: 'error' in response ? response.error : "Failed to extract the URL",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to extract the URL",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveApiKey = () => {
    if (apiKey.trim()) {
      JinaReaderService.saveApiKey(apiKey);
      toast({ title: "Jina API key saved", description: "Higher rate limits are now enabled." });
    } else {
      JinaReaderService.clearApiKey();
      toast({ title: "Jina API key removed" });
    }
    setShowApiKeyDialog(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={handleExtract}
          disabled={isLoading || !url}
          className="shrink-0"
        >
          {isLoading ? "Extracting..." : "Extract"}
        </Button>
      </div>

      <button
        type="button"
        onClick={() => setShowApiKeyDialog(true)}
        className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
      >
        {JinaReaderService.getApiKey() ? "Jina API key set — edit" : "Add a Jina API key for higher rate limits (optional)"}
      </button>

      {text && (
        <div className="space-y-2">
          <Label htmlFor="extracted-content">Extracted Content</Label>
          <Textarea
            id="extracted-content"
            value={text}
            onChange={handleTextChange}
            className="min-h-[200px] font-mono text-sm"
          />
        </div>
      )}

      <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Jina Reader API Key (optional)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              URL extraction works without a key. Add a free key from{" "}
              <a href="https://jina.ai/reader" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                jina.ai/reader
              </a>{" "}
              for higher rate limits. Leave empty to remove a saved key.
            </p>
            <Input
              type="password"
              placeholder="jina_..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApiKeyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveApiKey}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UrlInputSection;
