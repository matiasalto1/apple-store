import { site } from '@/config/site'
import { RevealText } from '@/components/ui/RevealText'
import { Arrow, MagneticButton } from '@/components/ui/MagneticButton'

export function FinalCTA() {
  return (
    <section id="contacto" data-scene="cta" className="relative overflow-hidden" aria-labelledby="cta-title">
      {/* transition into a darker, quieter space */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-transparent to-black/40" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 top-48 bg-black/40" />

      <div className="relative flex min-h-[100svh] flex-col items-center justify-center py-[16vh] text-center">
        {/* the calm system docks here */}
        <div data-system-anchor="cta" aria-hidden="true" className="absolute inset-x-0 top-1/2 h-[80vh] -translate-y-1/2" />

        <div className="container-x relative">
          <p className="label-mono text-mute" data-reveal>
            Contacto
          </p>
          <RevealText id="cta-title" className="text-display mx-auto mt-8 max-w-[14ch] font-medium">
            Tu próximo sistema inteligente empieza con una conversación.
          </RevealText>
          <p className="mx-auto mt-8 max-w-[34rem] text-[1.05rem] text-mute md:text-[1.15rem]" data-reveal>
            Contanos qué proceso querés transformar y diseñemos una solución alrededor de tu negocio.
          </p>
          <div className="mt-12 flex flex-col items-center gap-4" data-reveal>
            <MagneticButton href={site.contactHref} size="lg" strength={0.35}>
              Hablar con un especialista <Arrow />
            </MagneticButton>
            <p className="label-mono text-dim">Sin compromiso.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
