// src/styles/breakpoints.ts
export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
};

export const device = {
  mobile: `(max-width: ${breakpoints.mobile})`,
  tablet: `(max-width: ${breakpoints.tablet})`,
  desktop: `(max-width: ${breakpoints.desktop})`,
};
