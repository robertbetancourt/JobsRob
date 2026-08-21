export type CompatibilityLevel = 'core' | 'adjacent' | 'ambiguous' | 'likely_incompatible' | 'strong_incompatibility';

export interface RoleClassification {
  family: string;
  compatibility: CompatibilityLevel;
  role_fit: number | null;
  requires_description_analysis: boolean;
}

export function classifyRole(title: string): RoleClassification {
  const t = title.toLowerCase();

  // Strong Incompatibility checks - Unrelated Domains
  if (t.includes('account executive') || t.includes('sales representative') || t.includes('recruiter') || t.includes('marketing manager')) {
    return { family: 'Unrelated Domains', compatibility: 'strong_incompatibility', role_fit: 0, requires_description_analysis: false };
  }

  // Engineering
  if (t.includes('engineer') || t.includes('developer') || t.includes('programmer')) {
    if (t.includes('design') || t.includes('ux') || t.includes('ui') || t.includes('frontend')) {
      return { family: 'Engineering / UI Development', compatibility: 'ambiguous', role_fit: null, requires_description_analysis: true };
    }
    return { family: 'Engineering', compatibility: 'strong_incompatibility', role_fit: 0, requires_description_analysis: false };
  }

  // Product Management
  if (t.includes('product manager') || t.includes('product management') || t.includes('product owner') || t.includes('technical product manager')) {
    return { family: 'Product Management', compatibility: 'likely_incompatible', role_fit: 5, requires_description_analysis: false };
  }

  // UX Research
  if (t.includes('researcher') || t.includes('research')) {
    return { family: 'UX Research', compatibility: 'likely_incompatible', role_fit: 5, requires_description_analysis: false };
  }

  // Design Leadership & Management
  if (t.includes('manager') || t.includes('lead') || t.includes('head') || t.includes('director') || t.includes('vp') || t.includes('president') || t.includes('chief')) {
    if (t.includes('design') || t.includes('ux') || t.includes('ui') || t.includes('creative')) {
      return { family: 'Design Leadership & Management', compatibility: 'ambiguous', role_fit: null, requires_description_analysis: true };
    }
    return { family: 'Unrelated Leadership', compatibility: 'strong_incompatibility', role_fit: 0, requires_description_analysis: false };
  }

  // Design Systems
  if (t.includes('design systems') || t.includes('systems design')) {
    if (t.includes('designer')) {
      return { family: 'Design Systems', compatibility: 'core', role_fit: 20, requires_description_analysis: false };
    }
    return { family: 'Design Systems', compatibility: 'ambiguous', role_fit: null, requires_description_analysis: true };
  }

  // Visual & Brand Design
  if (t.includes('brand designer') || t.includes('graphic designer') || t.includes('marketing designer')) {
    return { family: 'Visual & Brand Design', compatibility: 'likely_incompatible', role_fit: 5, requires_description_analysis: false };
  }
  if (t.includes('visual designer') || t.includes('creative designer') || t.includes('creative director')) {
    return { family: 'Visual & Brand Design', compatibility: 'ambiguous', role_fit: null, requires_description_analysis: true };
  }

  // UX / UI Design
  if (t.includes('ux designer') || t.includes('ui designer') || t.includes('interaction designer') || t.includes('ui/ux') || t.includes('ux/ui')) {
    return { family: 'UX / UI Design', compatibility: 'core', role_fit: 20, requires_description_analysis: false };
  }

  // Product Design
  if (t.includes('product designer') || t.includes('product design')) {
    return { family: 'Product Design', compatibility: 'core', role_fit: 20, requires_description_analysis: false };
  }

  // Ambiguous Design Catch-All (e.g. "Designer", "Digital Designer", "Designer Advocate")
  if (t.includes('design') || t.includes('ux') || t.includes('ui')) {
    return { family: 'Ambiguous Design', compatibility: 'ambiguous', role_fit: null, requires_description_analysis: true };
  }

  // Unrecognized
  return { family: 'Unknown', compatibility: 'ambiguous', role_fit: null, requires_description_analysis: true };
}
