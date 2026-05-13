/**
 * Utilitaires de formatage centralisés pour l'application
 */

export const formatters = {
    /**
     * Formate une date en objet avec représentations multiples
     */
    date: (dateStr: string) => {
        const d = new Date(dateStr)
        return {
            day: d.toLocaleDateString('fr-FR', { day: '2-digit' }),
            month: d.toLocaleDateString('fr-FR', { month: 'short' }),
            full: d.toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }),
            time: d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        }
    },

    /**
     * Formate un numéro de téléphone au format français
     */
    phone: (phone: string): string => {
        return phone.replace(/(\d{2})(?=\d)/g, '$1 ').trim()
    },

    /**
     * Formate une URL pour que ce soit un slug valide
     */
    slug: (str: string): string => {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w-]/g, '')
            .replace(/-+/g, '-')
            .trim()
    },
}
