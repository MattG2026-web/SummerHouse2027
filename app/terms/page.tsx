import { PROPERTY, TERMS_AND_CONDITIONS } from "@/lib/content";

export const dynamic = "force-static";

export default function TermsPage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <p className="uppercase tracking-widest text-xs text-seafoam font-semibold text-center">
          {PROPERTY.village}
        </p>
        <h1 className="text-2xl sm:text-3xl font-serif text-deep mt-1 text-center">
          Booking Terms &amp; Conditions
        </h1>
        <p className="text-sm text-deep/60 mt-2 text-center">
          The Summer House — 2027 season
        </p>

        <div className="mt-8 space-y-6">
          {TERMS_AND_CONDITIONS.map((section) => (
            <div key={section.title}>
              <h2 className="font-semibold text-deep text-sm mb-1">
                {section.title}
              </h2>
              <p className="text-sm text-deep/75 leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-xs text-deep/40 text-center">
          Questions about any of this? Just message Matt or Alex directly.
        </p>
      </div>
    </main>
  );
}
