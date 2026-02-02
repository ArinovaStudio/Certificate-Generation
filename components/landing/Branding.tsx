import Image from "next/image";
import Marquee from "react-fast-marquee";
export default function BrandingSection() {
  // const brands1 = ["amdocs", "nas.io", "microsoft", "netflix", "iit", "nasscom","amdocs", "nas.io", "microsoft", "netflix", "iit", "nasscom","amdocs", "nas.io", "microsoft", "netflix", "iit", "nasscom"];
  // const brands2 = ["amdocs", "nas.io", "microsoft", "netflix", "iit", "nasscom","amdocs", "nas.io", "microsoft", "netflix", "iit", "nasscom","amdocs", "nas.io", "microsoft", "netflix", "iit", "nasscom"];
  return (
    <section className="max-md:max-w-sm! w-full max-lg:max-w-md! lg:max-w-7xl mx-auto space-y-7 px-6 py-12 overflow-hidden!">
        <Marquee autoFill className="w-full!" gradient={true} gradientColor="#fdfdfd" loop={0} speed={30}>
        {Array(10).fill("/eg.png").map((brand,index) => (
          <Image
          key={index}
          src={brand}
          alt={brand}
          height={100}
          width={200}
          className="text-sm font-medium uppercase tracking-wide mr-5"
          />
        ))}
        </Marquee>
        <Marquee autoFill className="w-full!" gradient={true} gradientColor="#fdfdfd" direction="right" loop={0} speed={30}>
        {Array(10).fill("/eg.png").map((brand,index) => (
          <Image
          key={index}
          src={brand}
          alt={brand}
          height={100}
          width={200}
          className="text-sm font-medium uppercase tracking-wide mr-5"
          />
        ))}
        </Marquee>
    </section>
  );
}
