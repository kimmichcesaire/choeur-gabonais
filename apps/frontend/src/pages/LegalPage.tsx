import { usePageMeta } from '../hooks/usePageMeta'
import { LegalPlaceholder } from '../components/LegalPlaceholder'
import { SITE_CONFIG } from '../utils/constants'

export default function LegalPage() {
  usePageMeta(
    'Mentions légales — Chœur Gabonais de France',
    'Mentions légales du site du Chœur Gabonais de France.',
  )

  return (
    <div className="page-hero">
      <div className="section-tag">Informations légales</div>
      <h1>Mentions légales</h1>

      <section>
        <h2>Éditeur du site</h2>
        <p>
          Le site est édité par <LegalPlaceholder>nom légal complet de l'association</LegalPlaceholder>,
          association régie par la loi du 1er juillet 1901, dont le siège social est situé{' '}
          <LegalPlaceholder>adresse du siège social</LegalPlaceholder>.
        </p>
        <p>Numéro RNA : <LegalPlaceholder>numéro RNA (format W + 9 chiffres)</LegalPlaceholder></p>
        <p>
          Directeur de la publication :{' '}
          <LegalPlaceholder>nom du président ou responsable de la publication</LegalPlaceholder>
        </p>
        <p>Contact : {SITE_CONFIG.contact.email}</p>
      </section>

      <section>
        <h2>Hébergement</h2>
        <p>
          Le site est hébergé par :
          <br />
          Cloudflare, Inc.
          <br />
          101 Townsend Street, San Francisco, CA 94107, États-Unis
        </p>
        <p>
          Le nom de domaine est enregistré auprès de :
          <br />
          OVH SAS — 2 rue Kellermann, 59100 Roubaix, France
        </p>
      </section>

      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          L'ensemble des contenus présents sur ce site (textes, photographies, vidéos, logo) est la
          propriété du Chœur Gabonais de France, sauf mention contraire. Toute reproduction sans
          autorisation préalable est interdite.
        </p>
      </section>
    </div>
  )
}
