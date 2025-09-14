import { breakpoints } from "./breakpoints";

const t = (min: string, max: string) =>
  `(min-width: ${min})${max ? ` and (max-width: calc(${max} - 1px))` : ""}`;
export const breakpointsMQ = {
  mobile: t("0px", breakpoints.tablet),
  mobileUp: t("0px", null),
  tabletSm: t(breakpoints.tabletSm, breakpoints.tablet),
  tabletSmUp: t(breakpoints.tabletSm, null),
  tablet: t(breakpoints.tablet, breakpoints.desktopSm),
  tabletUp: t(breakpoints.tablet, null),
  desktopSm: t(breakpoints.desktopSm, breakpoints.desktopMd),
  desktopSmUp: t(breakpoints.desktopSm, null),
  desktopMd: t(breakpoints.desktopMd, breakpoints.desktopLg),
  desktopMdUp: t(breakpoints.desktopMd, null),
  desktopLg: t(breakpoints.desktopLg, breakpoints.tvSm),
  desktopLgUp: t(breakpoints.desktopLg, null),
  tvSm: t(breakpoints.tvSm, breakpoints.tvMd),
  tvSmUp: t(breakpoints.tvSm, null),
  tvMd: t(breakpoints.tvMd, breakpoints.tvLg),
  tvMdUp: t(breakpoints.tvMd, null),
  tvLg: t(breakpoints.tvLg, null),
};

export const hover = `@media (hover: hover) and (pointer: fine)`;
