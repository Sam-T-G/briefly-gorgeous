import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const MAX_SKEW = 4;
const MAX_VEL = 2400;

export function installVelocitySkew(selector: string = ".quote, .transition-paragraph"): void {
  const proxy = { skew: 0 };
  const targets = gsap.utils.toArray<HTMLElement>(selector);
  if (targets.length === 0) return;

  const setSkew = gsap.quickSetter(targets, "skewY", "deg");
  const clamp = gsap.utils.clamp(-MAX_SKEW, MAX_SKEW);

  ScrollTrigger.create({
    onUpdate: (self) => {
      const velocity = self.getVelocity();
      const target = clamp((velocity / MAX_VEL) * MAX_SKEW);
      if (Math.abs(target) > Math.abs(proxy.skew)) {
        proxy.skew = target;
        gsap.to(proxy, {
          skew: 0,
          duration: 0.85,
          ease: "power3.out",
          overwrite: true,
          onUpdate: () => setSkew(proxy.skew)
        });
      }
    }
  });
}
