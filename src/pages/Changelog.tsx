import React from 'react';
import Footer from '@/components/WatsonAnalyzer/components/Footer';
import ChangelogHeader from '@/components/Changelog/ChangelogHeader';
import ChangelogContent from '@/components/Changelog/ChangelogContent';
import { versions } from '@/data/changelog';

const Changelog: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ChangelogHeader />
      <ChangelogContent versions={versions} />
      <Footer />
    </div>
  );
};

export default Changelog;
