import { CustomEase } from "gsap/CustomEase";

CustomEase.create("editorial", "M0,0 C0.2,0 0.1,1 1,1");
CustomEase.create("drift", "M0,0 C0.16,0.2 0.06,1 1,1");
CustomEase.create("settle", "M0,0 C0.33,1 0.4,1 1,1");
CustomEase.create("hush", "M0,0 C0.7,0 0.3,1 1,1");

export const EDITORIAL = "editorial";
export const DRIFT = "drift";
export const SETTLE = "settle";
export const HUSH = "hush";
