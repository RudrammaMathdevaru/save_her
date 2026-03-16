import { HeartHandshake, MapPinned, Shield, Siren } from 'lucide-react';
import AboutStats from './AboutStats';
import WhyChooseSafeHer from './WhyChooseSafeHer';

const aboutCards = [
  {
    id: 1,
    icon: Shield,
    title: 'Personal Safety First',
    description:
      'SafeHer is designed to help women feel safer in daily life through fast emergency support, trusted contacts, and community-based safety tools.',
  },
  {
    id: 2,
    icon: Siren,
    title: 'Instant SOS Support',
    description:
      'With one tap, users can trigger an SOS alert to quickly notify emergency contacts and share important safety information during urgent situations.',
  },
  {
    id: 3,
    icon: MapPinned,
    title: 'Live Location Sharing',
    description:
      'SafeHer helps users share their live location with trusted people, making it easier for family and friends to know where they are when needed.',
  },
  {
    id: 4,
    icon: HeartHandshake,
    title: 'Community Protection',
    description:
      'Users can report incidents, view community posts, and stay aware of unsafe areas, helping build a more informed and supportive environment.',
  },
];

const AboutSection = () => {
  return (
    <section className="w-full bg-gradient-to-b from-white via-[#f8f7ff] to-white py-20 px-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-block rounded-full bg-[#ede9fe] px-4 py-1 text-sm font-semibold text-[#5b21b6]">
            About SafeHer
          </p>

          <h2 className="mt-5 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            A smarter and safer digital space for women
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
            SafeHer is a women safety and emergency response platform built to
            provide quick help, trusted communication, location awareness, and
            community support. Our goal is to make safety tools simple,
            accessible, and effective for everyday use.
          </p>
        </div>

        {/* Main About Layout */}
        <div className="mt-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          {/* Left Content */}
          <div className="rounded-3xl border border-violet-100 bg-white p-6 shadow-lg shadow-violet-100/40 sm:p-8">
            <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Why SafeHer matters
            </h3>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Many women face unsafe situations while traveling, studying,
              working, or even walking in familiar places. SafeHer brings
              emergency response, awareness, and prevention features together in
              one platform so users can react quickly and stay connected to the
              right people.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              The platform is not only about emergency response. It also
              encourages awareness through community reports, incident tracking,
              profile safety options, and trusted contact support. This creates
              a stronger system where prevention and immediate action work
              together.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {aboutCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.id}
                    className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:bg-white hover:shadow-md"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#6C63FF]/10 text-[#6C63FF]">
                      <Icon size={22} />
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900">
                      {card.title}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {card.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Highlight Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6C63FF] via-[#7c73ff] to-[#4f46e5] p-8 text-white shadow-xl">
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-pink-300/10 blur-2xl" />

            <div className="relative z-10">
              <p className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium">
                Our Mission
              </p>

              <h3 className="mt-5 text-2xl font-bold leading-snug sm:text-3xl">
                Empower women with confidence, protection, and immediate support
              </h3>

              <p className="mt-5 text-sm leading-7 text-white/90 sm:text-base">
                SafeHer is built with a simple mission: to use technology for
                real-world safety. From emergency alerts to trusted contacts and
                community-driven awareness, every feature is designed to support
                women when they need it most.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <h4 className="text-lg font-semibold">
                    Quick Emergency Action
                  </h4>
                  <p className="mt-2 text-sm text-white/85">
                    Fast-response tools help users send alerts without confusion
                    or delay.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <h4 className="text-lg font-semibold">Trusted Network</h4>
                  <p className="mt-2 text-sm text-white/85">
                    Connect with emergency contacts who can respond immediately
                    when an alert is triggered.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <h4 className="text-lg font-semibold">Safer Communities</h4>
                  <p className="mt-2 text-sm text-white/85">
                    Shared safety reports help users stay informed about nearby
                    risks and concerns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Extra Sections */}
        <AboutStats />
        <WhyChooseSafeHer />
      </div>
    </section>
  );
};

export default AboutSection;
