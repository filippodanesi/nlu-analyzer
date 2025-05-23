
// Helper function to get badge variant based on feature type
export const getFeatureTypeVariant = (feature: string) => {
  if (feature.startsWith("FIX")) return "secondary";
  if (feature.startsWith("ENHANCEMENT") || feature.startsWith("ENHANCE")) return "secondary";
  if (feature.startsWith("IMPLEMENT")) return "default";
  if (feature.startsWith("MAJOR")) return "outline";
  if (feature.startsWith("UPDATE")) return "secondary";
  return "default";
};
