
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border mt-8">
      <div className="container max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          IBM Watson Natural Language Understanding Analyzer - v1.1.6
        </div>
        <div className="text-xs text-muted-foreground">
          Built with React & Tailwind CSS
        </div>
      </div>
    </footer>
  );
};

export default Footer;
