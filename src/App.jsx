import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Mail,
  FileDown,
  ArrowRight,
  Code2,
  Server,
  Cloud,
  Database,
  Palette,
  Cpu,
  Layers
} from 'lucide-react';

const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' }
];

function useSectionSpy(sectionIds, options) {
  const [active, setActive] = useState(sectionIds[0] || null);
  const observer = useRef(null);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return;

    observer.current?.disconnect?.();
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-45% 0px -45% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
        ...(options || {})
      }
    );

    sections.forEach((sec) => observer.current.observe(sec));
    return () => observer.current && observer.current.disconnect();
  }, [sectionIds, options]);

  return active;
}

function useAnimateOnScroll() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-animate]'));
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-inview');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useGlobalStyles() {
  useEffect(() => {
    const style = document.createElement('style');
    style.setAttribute('data-app-styles', 'true');
    style.innerHTML = `
      :root { --accent: #00e5ff; --bg: #0b0f16; --card: #111827; }
      html { scroll-behavior: smooth; }
      body { background: var(--bg); }
      .glass { background: rgba(17, 24, 39, 0.6); backdrop-filter: blur(12px); }
      .text-gradient { background: linear-gradient(90deg, #8b5cf6 0%, var(--accent) 50%, #22c55e 100%);
        -webkit-background-clip: text; background-clip: text; color: transparent; }
      .btn-gradient { background-image: linear-gradient(135deg, var(--accent), #7c3aed); }
      .btn-gradient:hover { filter: brightness(1.1); }
      .glow-ring { box-shadow: 0 0 0 1px rgba(255,255,255,0.05), 0 0 30px rgba(0,229,255,0.2) inset, 0 0 30px rgba(0,229,255,0.2); }
      .animated-gradient {
        background: radial-gradient(1200px 600px at 80% -10%, rgba(124, 58, 237, 0.25), transparent 60%),
                    radial-gradient(800px 400px at -10% 20%, rgba(34, 197, 94, 0.2), transparent 60%),
                    radial-gradient(1000px 500px at 50% 120%, rgba(0, 229, 255, 0.18), transparent 60%),
                    linear-gradient(180deg, #0b0f16 0%, #0e1420 100%);
        position: relative;
      }
      .animated-gradient:after {
        content: '';
        position: absolute; inset: -2px;
        background: conic-gradient(from 180deg at 50% 50%, rgba(0,229,255,0.15), rgba(124,58,237,0.15), rgba(34,197,94,0.15), rgba(0,229,255,0.15));
        filter: blur(60px); opacity: 0.5; pointer-events: none;
      }
      .animate-on-scroll { opacity: 0; transform: translateY(16px); transition: opacity .8s ease, transform .8s ease; }
      .animate-on-scroll[data-delay='1'] { transition-delay: .1s; }
      .animate-on-scroll[data-delay='2'] { transition-delay: .2s; }
      .animate-on-scroll[data-delay='3'] { transition-delay: .3s; }
      .animate-on-scroll[data-delay='4'] { transition-delay: .4s; }
      .is-inview { opacity: 1; transform: translateY(0); }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);
}

function Navbar({ active, onNav }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-4 rounded-2xl glass ring-1 ring-white/10">
          <nav className="flex items-center justify-between px-5 py-4">
            <a href="#home" onClick={(e) => onNav(e, 'home')} className="group inline-flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center group-hover:ring-white/20 transition">
                <Layers className="h-5 w-5 text-cyan-300" />
              </div>
              <span className="font-semibold tracking-tight text-white">deepak kumar</span>
            </a>
            <ul className="hidden md:flex items-center gap-1">
              {SECTIONS.map((s) => (
                <li key={`nav-${s.id}`}>
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => onNav(e, s.id)}
                    className={`relative px-3 py-2 text-sm text-white/80 hover:text-white transition ${
                      active === s.id ? 'text-white' : ''
                    }`}
                  >
                    <span>{s.label}</span>
                    <span
                      className={`absolute left-1/2 -bottom-1 h-0.5 w-0 -translate-x-1/2 bg-[var(--accent)] transition-all duration-300 ${
                        active === s.id ? 'w-6' : 'w-0'
                      }`}
                    />
                  </a>
                </li>
              ))}
            </ul>
            <div className="md:hidden" />
          </nav>
        </div>
      </div>
    </header>
  );
}

function Hero({ onCTAClick }) {
  return (
    <section id="home" className="relative min-h-[100svh] pt-28 overflow-hidden">
      <div className="absolute inset-0 animated-gradient" />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="animate-on-scroll text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white" data-animate data-delay="1">
              <span className="text-gradient">deepak kumar</span> | Creative Frontend Developer
            </h1>
            <p className="animate-on-scroll mt-5 text-lg text-white/70 max-w-2xl" data-animate data-delay="2">
              I design and build beautiful, responsive, and performant web experiences. I bring ideas to life with
              clean code, delightful interactions, and accessibility at the core.
            </p>
            <div className="animate-on-scroll mt-8 flex flex-wrap items-center gap-4" data-animate data-delay="3">
              <button
                onClick={onCTAClick}
                className="group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-black shadow-[0_8px_30px_rgba(0,229,255,0.35)] btn-gradient"
              >
                View My Work
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition"
              >
                Contact Me
                <Mail className="h-4 w-4" />
              </a>
            </div>
            <div className="animate-on-scroll mt-12 flex items-center gap-6 text-white/70" data-animate data-delay="4">
              <div className="flex -space-x-2">
                {[1,2,3,4].map((i) => (
                  <img key={`av-${i}`} alt="avatar" src={`https://i.pravatar.cc/60?img=${i+20}`} className="h-8 w-8 rounded-full ring-2 ring-white/10" />
                ))}
              </div>
              <p className="text-sm">Trusted by teams and startups to craft premium web UIs</p>
            </div>
          </div>
          <div className="relative">
            <div className="animate-on-scroll relative mx-auto h-80 w-80 sm:h-96 sm:w-96 rounded-[2rem] bg-white/5 ring-1 ring-white/10 glow-ring overflow-hidden" data-animate data-delay="2">
              <img
                alt="profile"
                src="https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=1280&auto=format&fit=crop"
                className="h-full w-full object-cover transition-transform duration-[4000ms] ease-out hover:scale-110"
              />
            </div>
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.15),transparent_60%)]" />
          </div>
        </div>
        <div className="absolute left-1/2 bottom-6 -translate-x-1/2 text-white/60 animate-bounce">
          <ChevronIcon />
        </div>
      </div>
    </section>
  );
}

function About() {
  const downloadCV = () => {
    const content = `Deepak Kumar
ankitsaini1706@gmail.com || +91 7015324087
Profile Summary
A developer with high problem-solving skills and develops complex projects
development proficient in Java, HTML, CSS, and JavaScript.
Education
. Targeting frontend
Gurugram University, Gurgaon
• Master of Computer Application || ( Appearing )
Maharshi Dayanand University, Rohtak
2024 - 2026
2021 - 2024
• Bachelor of Computer Application || 64.7%
Gyandeep Sr. Sec. School 2020 - 2021
• HBSE (Class XII), 89.4%
Gyandeep Sr. Sec. School
• HBSE (Class X), 73.8%
Skills
2018 - 2019
MS Office | HTML | CSS | Java | JavaScript | Bootstrap | Git | SQL
Projects
Car Game using Java || GitHub link Mar’25
A 2D car racing game developed in Java with real-time obstacles and scoring
system.
• Developed using Java with Swing/JavaFX for graphics and user interaction.
• Implemented keyboard controls for smooth car movement and gameplay
mechanics.
• Designed collision detection to manage obstacles and track game progress.
Dano Game using Java || GitHub link Mar’25
A Java-based survival game where players navigate obstacles and challenges to reach the goal.
• Developed using Java with Swing/JavaFX for interactive UI and smooth gameplay.
• Designed game mechanics involving obstacles, enemy AI, and time-based challenges.
• Implemented keyboard controls for character movement and actions.
Soft Skills
• Problem-solving: Effective at debugging and finding solutions to complex issues.
• Communication: Strong written and verbal communication skills, able to collaborate effectively with
teams.
• Other: Analytical, Collaborator, Leader, Adaptable
Personal attributes
• Detail-oriented: Meticulous in ensuring high-quality code and documentation.
• Eager to learn: Passionate about technology and continuous learning.
Personal Details
Date of Birth: 17th Jun 2003
Languages Known: English and Hindi
Address: Rohtak, Haryana`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'deepak_kumar_CV.txt'; a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <section id="about" className="scroll-mt-28 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="animate-on-scroll" data-animate data-delay="1">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-6 -z-10 rounded-3xl bg-[radial-gradient(ellipse_at_center,_rgba(0,229,255,0.15),transparent_60%)]" />
              <div className="rounded-3xl overflow-hidden ring-1 ring-white/10 glow-ring">
                <img
                  alt="Portrait"
                  src="https://cdn.builder.io/api/v1/image/assets%2Fa0e2402845ae4203a43e8acd3e3dbb57%2Fb9e0102bbff24be9b2cdd647fb825ee4?format=webp&width=800"
                  className="h-80 w-full object-cover transition-transform duration-[4000ms] ease-out hover:scale-110"
                />
              </div>
            </div>
          </div>
          <div className="animate-on-scroll" data-animate data-delay="2">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">About Me</h2>
            <p className="mt-5 text-white/70 leading-relaxed">
              I am a frontend developer focused on creating immersive, accessible, and performant web applications. I
              love translating complex ideas into intuitive interfaces with thoughtful motion and micro-interactions.
            </p>
            <p className="mt-4 text-white/70 leading-relaxed">
              Over the past years, I have worked with startups and product teams to deliver responsive UIs, scalable
              component systems, and delightful user experiences that drive business outcomes.
            </p>
            <button onClick={downloadCV} className="mt-8 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-black btn-gradient shadow-[0_8px_30px_rgba(0,229,255,0.35)]">
              Download CV <FileDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const skills = useMemo(
    () => [
      { name: 'JavaScript', icon: Code2 },
      { name: 'React', icon: Cpu },
      { name: 'Next.js', icon: Layers },
      { name: 'TypeScript', icon: Code2 },
      { name: 'Node.js', icon: Server },
      { name: 'Tailwind CSS', icon: Palette },
      { name: 'java', icon: Cloud },
      { name: 'SQL', icon: Database }
    ],
    []
  );

  return (
    <section id="skills" className="scroll-mt-28 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="animate-on-scroll" data-animate data-delay="1">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">My Tech Stack</h2>
          <p className="mt-3 text-white/70">Tools and technologies I use to craft high-quality products.</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {skills.map((s, idx) => (
            <div
              key={`skill-${s.name}`}
              data-animate
              data-delay={((idx % 4) + 1).toString()}
              className="animate-on-scroll group rounded-2xl border border-white/10 bg-white/5 p-5 ring-1 ring-white/10 transition transform hover:scale-[1.02] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_20px_60px_rgba(0,229,255,0.15)]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(0,229,255,0.08)] ring-1 ring-[rgba(255,255,255,0.08)] group-hover:ring-[rgba(255,255,255,0.18)] transition">
                  {React.createElement(s.icon, { className: 'h-6 w-6 text-cyan-300' })}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{s.name}</h3>
                  <p className="text-sm text-white/60">Advanced</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const projects = [
    {
      title: 'CAR GAME ',
      desc: 'A 2D CAR GAME USIG JAVA .',
      image: 'https://cdn.builder.io/api/v1/image/assets%2Fa0e2402845ae4203a43e8acd3e3dbb57%2F791727b7447c415185c9f770b54d8c83?format=webp&width=800',
      tags: ['', 'JAVA', '']
    },
    {
      title: 'Commerce UI Kit',
      desc: 'Headless e-commerce storefront with blazing-fast product browsing.',
      image: 'https://images.unsplash.com/photo-1557825835-70d97c4aa567?q=80&w=1600&auto=format&fit=crop',
      tags: ['Next.js', 'Stripe', 'TypeScript']
    },
    {
      title: ' SITAA TeamHub Collaboration',
      desc: ' A farmer helping web app .Realtime collaboration with presence, comments, and tasks.',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1600&auto=format&fit=crop',
      tags: ['React', 'WebSockets', 'Figma']
    },
    {
      title: 'Brand Portfolio',
      desc: 'My portfolio .',
      image: 'https://cdn.builder.io/api/v1/image/assets%2Fa0e2402845ae4203a43e8acd3e3dbb57%2Fba82636b823d4bb2a6a1ef82146f8487?format=webp&width=800',
      tags: ['Vite', 'Tailwind', 'react']
    }
  ];

  return (
    <section id="projects" className="scroll-mt-28 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="animate-on-scroll" data-animate data-delay="1">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Featured Projects</h2>
          <p className="mt-3 text-white/70">A selection of projects showcasing my skills in UI engineering.</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, idx) => (
            <article
              key={`proj-${p.title}`}
              data-animate
              data-delay={((idx % 4) + 1).toString()}
              className="animate-on-scroll group overflow-hidden rounded-2xl border border-white/10 bg-white/5 ring-1 ring-white/10"
            >
              <div className="relative aspect-video overflow-hidden">
                <img alt={p.title} src={p.image} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 translate-y-full bg-gradient-to-t from-black/70 via-black/50 to-transparent p-4 text-white transition-transform duration-500 group-hover:translate-y-0 flex flex-col justify-end">
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm text-white/80">{p.desc}</p>
                  <div className="mt-3 flex items-center gap-4 text-sm text-white/90">
                    <a href="https://github.com/deepakkumar017" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-cyan-300 transition"><Github className="h-4 w-4" /> Code</a>
                    <a href="#" className="inline-flex items-center gap-1 hover:text-cyan-300 transition"><ExternalLink className="h-4 w-4" /> Live</a>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 p-4">
                {p.tags.map((t, i) => (
                  <span key={`tag-${idx}-${i}`} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70">{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience () {
  const items = [
    {
      role: ' Frontend Developer ',
      org: 'Riselnno Tech ',
      time: '26 june - 26 july 2025',
      desc: 'working on UI designs into responsive web pages and intergrating with backend APIs to manage client data .'
    },
     {
      role: 'Master In Computer Science',
      org: 'Gurugram University',
      time: '2014 - 2026',
      desc: ' PostGraduated with honors. Specialized in web technologies.'
    },
    
    {
      role: 'Bachelor In Computer Science',
      org: 'Maharshi Dayanand University',
      time: '2021 - 2024',
      desc: 'Graduated with honors. Specialized in web technologies .'
    }
  ];

  return (
    <section id="experience" className="scroll-mt-28 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="animate-on-scroll" data-animate data-delay="1">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Experience</h2>
          <p className="mt-3 text-white/70">Roles and education that shaped my craft.</p>
        </div>
        <div className="relative mt-12">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 -translate-x-px w-[2px] bg-gradient-to-b from-white/20 via-white/10 to-transparent" />
          <div className="space-y-12">
            {items.map((it, idx) => (
              <div key={`exp-${idx}-${it.org}`} className={`animate-on-scroll`} data-animate data-delay={((idx % 4) + 1).toString()}>
                <div className={`flex ${idx % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'} items-start gap-6`}>
                  <div className={`relative mt-1 hidden sm:block h-4 w-4 rounded-full bg-[var(--accent)] shadow-[0_0_0_6px_rgba(0,229,255,0.15)] ${idx % 2 === 0 ? 'sm:translate-x-[calc(-50%-4px)]' : 'sm:translate-x-[calc(50%+4px)]'}`} />
                  <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-5 ring-1 ring-white/10">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-white font-semibold">{it.role} • <span className="text-white/80">{it.org}</span></h3>
                      <span className="text-sm text-white/60">{it.time}</span>
                    </div>
                    <p className="mt-2 text-white/70">{it.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };
  return (
    <section id="contact" className="scroll-mt-28 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="animate-on-scroll" data-animate data-delay="1">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Contact</h2>
          <p className="mt-3 text-white/70">Have a project in mind? Let’s talk.</p>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <form onSubmit={onSubmit} className="animate-on-scroll space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10" data-animate data-delay="2">
            <FloatingInput label="Name" name="name" />
            <FloatingInput label="Email" name="email" type="email" />
            <FloatingTextArea label="Message" name="message" rows={5} />
            <button type="submit" className="w-full rounded-xl px-5 py-3 text-sm font-semibold text-black btn-gradient shadow-[0_8px_30px_rgba(0,229,255,0.35)]">
              {submitted ? 'Sent ✓' : 'Send Message'}
            </button>
          </form>
          <div className="animate-on-scroll space-y-6" data-animate data-delay="3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="text-white font-semibold">Connect</h3>
              <p className="mt-2 text-white/70">I’m open to freelance, collaboration, and full-time opportunities.</p>
              <div className="mt-4 flex items-center gap-4">
                <Social href="https://github.com/deepakkumar017" label="GitHub">
                  <Github />
                </Social>
                <Social href="https://www.linkedin.com/in/deepak-kumar-0a6149311" label="LinkedIn">
                  <Linkedin />
                </Social>
                <Social href="https://twitter.com/ankitsaini1706" label="Twitter">
                  <Twitter />
                </Social>
                <Social href="mailto:ankitsaini1706@gmail.com" label="Email">
                  <Mail />
                </Social>
              </div>
              <div className="mt-3 text-sm text-white/80">
                <a href="mailto:ankitsaini1706@gmail.com" className="text-cyan-300 hover:underline">ankitsaini1706@gmail.com</a>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="text-white font-semibold">Location</h3>
              <p className="mt-2 text-white/70">Remote • IST (UTC+5:30)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-white/5">
      <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-white/60">© 2025 deepak kumar</p>
        <div className="flex items-center gap-4 text-white/70">
          <a href="https://github.com/deepakkumar017" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition"><Github className="h-5 w-5" /></a>
          <a href="https://www.linkedin.com/in/deepak-kumar-0a6149311" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition"><Linkedin className="h-5 w-5" /></a>
          <a href="https://twitter.com/ankitsaini1706" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition"><Twitter className="h-5 w-5" /></a>
        </div>
      </div>
    </footer>
  );
}

function FloatingInput({ label, name, type = 'text' }) {
  const [focused, setFocused] = useState(false);
  return (
    <label className={`group relative block rounded-xl border ${focused ? 'border-[var(--accent)]' : 'border-white/10'} bg-white/5 px-4 pt-4 pb-2 ring-1 ${focused ? 'ring-[var(--accent)]' : 'ring-white/10'} transition`}>
      <input
        className="peer w-full bg-transparent text-white outline-none placeholder-transparent"
        name={name}
        type={type}
        placeholder={label}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required
      />
      <span className="pointer-events-none absolute left-4 top-2 text-xs text-white/60 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">{label}</span>
    </label>
  );
}

function FloatingTextArea({ label, name, rows = 4 }) {
  const [focused, setFocused] = useState(false);
  return (
    <label className={`group relative block rounded-xl border ${focused ? 'border-[var(--accent)]' : 'border-white/10'} bg-white/5 px-4 pt-4 pb-2 ring-1 ${focused ? 'ring-[var(--accent)]' : 'ring-white/10'} transition`}>
      <textarea
        className="peer w-full resize-none bg-transparent text-white outline-none placeholder-transparent"
        name={name}
        rows={rows}
        placeholder={label}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required
      />
      <span className="pointer-events-none absolute left-4 top-2 text-xs text-white/60 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">{label}</span>
    </label>
  );
}

function Social({ href, children, label }) {
  return (
    <a
      aria-label={label}
      href={href}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 ring-1 ring-white/10 transition hover:scale-105 hover:text-cyan-300"
    >
      {React.cloneElement(children, { className: 'h-5 w-5' })}
    </a>
  );
}

function ChevronIcon() {
  return (
    <svg className="h-6 w-6 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function App() {
  useGlobalStyles();
  useAnimateOnScroll();

  const active = useSectionSpy(SECTIONS.map((s) => s.id));

  const onNav = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen text-white">
      <Navbar active={active} onNav={onNav} />

      <main className="pt-6">
        <Hero onCTAClick={(e) => {
          document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
