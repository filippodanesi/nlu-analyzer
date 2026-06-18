
import React from 'react';

const STEPS = [
  { n: 1, title: "Analyze", detail: "Watson NLU extracts keywords, entities, concepts, categories and tone." },
  { n: 2, title: "Spot the gaps", detail: "See which of your target keywords are missing from the text." },
  { n: 3, title: "Optimize", detail: "AI rewrites the text to include them — your voice and meaning stay intact." },
];

const Description: React.FC = () => {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-5 border-b border-border">
      <div className="grid gap-4 sm:grid-cols-3">
        {STEPS.map((step) => (
          <div key={step.n} className="flex gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
              {step.n}
            </span>
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">{step.title}</p>
              <p className="text-xs text-muted-foreground">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Description;
