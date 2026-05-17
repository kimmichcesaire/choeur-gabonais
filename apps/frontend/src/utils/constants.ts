/**
 * Constantes centralisées pour l'application
 */

export const SITE_CONFIG = {
    name: 'Chœur Gabonais de France',
    description: 'Association culturelle et musicale gabonaise',
    contact: {
        email: 'neybernal99@gmail.com',
        location: 'Paris, France',
        rehearsal: {
            day: 'samedi',
            startTime: '15h',
            endTime: '18h',
        },
    },
    social: {
        youtube: 'https://www.youtube.com/@choeurgabonaisfrance9523',
        instagram: 'https://www.instagram.com/choeur_gabonais_de_france',
        facebook: 'https://www.facebook.com/people/Choeur-Gabonais-de-France/100051156166946/?sk=photos',
    },
} as const

export const STATS = [
    { number: '30', label: 'Choristes' },
    { number: '6', label: "Ans d'existence" },
    { number: '35', label: 'Prestations' },
] as const

export const VALUES = [
    'Promouvoir le patrimoine musical gabonais',
    'Créer des liens au sein de la diaspora gabonaise',
    'Partager notre culture avec le public français',
] as const

export const GABON_FLAG_COLORS = {
    green: '#009e60',
    yellow: '#fcd116',
    blue: '#3a75c4',
} as const

export const ROUTES = {
    home: '/',
    events: '/evenements',
    media: '/medias',
    gallery: '/galerie',
    about: '/a-propos',
    contact: '/contact',
} as const

export const FORM_MESSAGES = {
    errors: {
        generic: 'Une erreur est survenue. Veuillez réessayer dans quelques instants.',
        network: 'Impossible de contacter le serveur. Vérifiez votre connexion.',
        tooManyRequests: 'Trop de tentatives. Veuillez patienter quelques minutes.',
        server: 'Erreur serveur. Nos équipes ont été notifiées.',
    },
    success: {
        contactSubmitted: '✅ Message envoyé ! Nous vous répondrons sous 48h.',
        applicationSubmitted: '✅ Candidature reçue ! Nous reviendrons vers vous bientôt.',
    },
    loading: {
        sending: 'Envoi…',
        loading: 'Chargement…',
    },
} as const
