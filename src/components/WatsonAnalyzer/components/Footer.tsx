
import React from 'react';
import { currentVersion } from '@/data/changelog';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border mt-8">
      <div className="container max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          IBM Watson Natural Language Understanding Analyzer — v{currentVersion}
        </div>
        <div className="text-xs text-muted-foreground">
          Built with React &amp; Tailwind CSS
        </div>
      </div>
    </footer>
  );
};

export default Footer;
