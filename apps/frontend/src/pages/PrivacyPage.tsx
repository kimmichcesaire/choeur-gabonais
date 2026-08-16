import { usePageMeta } from '../hooks/usePageMeta'
import { SITE_CONFIG } from '../utils/constants'

export default function PrivacyPage() {
  usePageMeta(
    'Politique de confidentialité — Chœur Gabonais de France',
    'Politique de confidentialité et protection des données personnelles du Chœur Gabonais de France.',
  )

  return (
    <div className="page-hero">
      <div className="section-tag">Vie privée</div>
      <h1>Politique de confidentialité</h1>

      <section>
        <h2>1. Responsable du traitement</h2>
        <p>
          Chœur Gabonais de France (CGDF), 4 rue Lomet, 47000 Agen, contact : {SITE_CONFIG.contact.email}
        </p>
      </section>

      <section>
        <h2>2. Données collectées</h2>
        <p>
          <strong>Formulaire de contact :</strong> nom complet, email, sujet, message.
          <br />
          <strong>Formulaire de candidature :</strong> nom complet, email, téléphone, tessiture,
          expérience musicale, motivation.
        </p>
      </section>

      <section>
        <h2>3. Finalités</h2>
        <p>
          Ces données sont utilisées uniquement pour répondre à votre demande de contact ou pour
          étudier votre candidature au sein du chœur.
        </p>
      </section>

      <section>
        <h2>4. Base légale</h2>
        <p>
          Le traitement repose sur votre consentement, exprimé en soumettant volontairement l'un des
          formulaires du site.
        </p>
      </section>

      <section>
        <h2>5. Destinataires et sous-traitants</h2>
        <p>
          Vos données sont accessibles aux seuls administrateurs de l'association et sont traitées
          par les prestataires techniques suivants, susceptibles de traiter des données hors de
          l'Union européenne :
        </p>
        <p>
          Supabase, Inc. (base de données et stockage) — Resend (envoi des emails de notification) —
          Cloudflare, Inc. (hébergement du site). Ces transferts sont encadrés par les clauses
          contractuelles types de la Commission européenne ou un mécanisme équivalent.
        </p>
      </section>

      <section>
        <h2>6. Durée de conservation</h2>
        <p>
          Messages de contact : 12 mois. Candidatures : 24 mois, sauf si la personne devient membre
          du chœur.
        </p>
      </section>

      <section>
        <h2>7. Vos droits</h2>
        <p>
          Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un
          droit d'accès, de rectification, d'effacement, de limitation et d'opposition sur vos données.
          Pour l'exercer, contactez {SITE_CONFIG.contact.email}. Vous pouvez également introduire une
          réclamation auprès de la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>).
        </p>
      </section>

      <section>
        <h2>8. Sécurité</h2>
        <p>
          L'accès aux données est restreint aux seuls comptes administrateurs de l'association et
          protégé par des règles d'accès strictes au niveau de la base de données, ainsi que par un
          chiffrement systématique des échanges (HTTPS).
        </p>
      </section>
    </div>
  )
}
