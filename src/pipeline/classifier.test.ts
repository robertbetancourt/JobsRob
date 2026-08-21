import { describe, it, expect } from 'vitest';
import { classifyRole } from './classifier';

describe('Role Taxonomy Classifier', () => {
  it('Product Designer', () => {
    const res = classifyRole('Product Designer');
    expect(res.family).toBe('Product Design');
    expect(res.compatibility).toBe('core');
    expect(res.role_fit).toBe(20);
    expect(res.requires_description_analysis).toBe(false);
  });

  it('Senior Product Designer', () => {
    const res = classifyRole('Senior Product Designer');
    expect(res.family).toBe('Product Design');
    expect(res.compatibility).toBe('core');
    expect(res.role_fit).toBe(20);
    expect(res.requires_description_analysis).toBe(false);
  });

  it('Product Design Lead', () => {
    const res = classifyRole('Product Design Lead');
    expect(res.family).toBe('Design Leadership & Management');
    expect(res.compatibility).toBe('ambiguous');
    expect(res.role_fit).toBeNull();
    expect(res.requires_description_analysis).toBe(true);
  });

  it('Product Design Manager', () => {
    const res = classifyRole('Product Design Manager');
    expect(res.family).toBe('Design Leadership & Management');
    expect(res.compatibility).toBe('ambiguous');
    expect(res.role_fit).toBeNull();
    expect(res.requires_description_analysis).toBe(true);
  });

  it('Product Manager — Design Systems', () => {
    const res = classifyRole('Product Manager — Design Systems');
    expect(res.family).toBe('Product Management');
    expect(res.compatibility).toBe('likely_incompatible');
    expect(res.role_fit).toBe(5);
    expect(res.requires_description_analysis).toBe(false);
  });

  it('Design Systems Designer', () => {
    const res = classifyRole('Design Systems Designer');
    expect(res.family).toBe('Design Systems');
    expect(res.compatibility).toBe('core');
    expect(res.role_fit).toBe(20);
    expect(res.requires_description_analysis).toBe(false);
  });

  it('Design Systems Manager', () => {
    const res = classifyRole('Design Systems Manager');
    expect(res.family).toBe('Design Leadership & Management');
    expect(res.compatibility).toBe('ambiguous');
    expect(res.role_fit).toBeNull();
    expect(res.requires_description_analysis).toBe(true);
  });

  it('Design Engineer', () => {
    const res = classifyRole('Design Engineer');
    expect(res.family).toBe('Engineering / UI Development');
    expect(res.compatibility).toBe('ambiguous');
    expect(res.role_fit).toBeNull();
    expect(res.requires_description_analysis).toBe(true);
  });

  it('UX Engineer', () => {
    const res = classifyRole('UX Engineer');
    expect(res.family).toBe('Engineering / UI Development');
    expect(res.compatibility).toBe('ambiguous');
    expect(res.role_fit).toBeNull();
    expect(res.requires_description_analysis).toBe(true);
  });

  it('UX Researcher', () => {
    const res = classifyRole('UX Researcher');
    expect(res.family).toBe('UX Research');
    expect(res.compatibility).toBe('likely_incompatible');
    expect(res.role_fit).toBe(5);
    expect(res.requires_description_analysis).toBe(false);
  });

  it('Visual Designer', () => {
    const res = classifyRole('Visual Designer');
    expect(res.family).toBe('Visual & Brand Design');
    expect(res.compatibility).toBe('ambiguous');
    expect(res.role_fit).toBeNull();
    expect(res.requires_description_analysis).toBe(true);
  });

  it('Brand Designer', () => {
    const res = classifyRole('Brand Designer');
    expect(res.family).toBe('Visual & Brand Design');
    expect(res.compatibility).toBe('likely_incompatible');
    expect(res.role_fit).toBe(5);
    expect(res.requires_description_analysis).toBe(false);
  });

  it('Creative Director', () => {
    const res = classifyRole('Creative Director');
    expect(res.family).toBe('Design Leadership & Management');
    expect(res.compatibility).toBe('ambiguous');
    expect(res.role_fit).toBeNull();
    expect(res.requires_description_analysis).toBe(true);
  });
});
