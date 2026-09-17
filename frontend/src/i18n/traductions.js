// Textes du site dans les 3 langues. Le français est la langue par défaut.
// "ln" (lingala) mélange volontairement des mots français pour les notions
// techniques (numérique, application, gestion...), comme à l'oral à Kinshasa.

export const LANGUES = [
  { code: 'fr', libelle: 'Français' },
  { code: 'en', libelle: 'English' },
  { code: 'ln', libelle: 'Lingála' },
];

export const LANGUE_DEFAUT = 'fr';

export const TRADUCTIONS = {
  fr: {
    nav: {
      equipe: 'Équipe',
      expertises: 'Expertises',
      solutions: 'Solutions',
      methode: 'Notre méthode',
      engagements: 'Nos engagements',
      contact: 'Contact',
      contacter: 'Nous contacter',
    },
    commun: {
      chargement: 'Chargement…',
      reessayer: 'Réessayer',
      remonterHaut: 'Remonter en haut de la page',
      fermer: 'Fermer',
      navigationPrincipale: 'Navigation principale',
      navigationMobile: 'Navigation mobile',
      menu: 'Menu',
      choisirLangue: 'Choisir la langue',
    },
    hero: {
      slogan: 'Solutions logicielles',
      titre1: 'Vos idées,',
      titre2: 'nos réalités digitales.',
      accroche:
        "Que vous dirigiez une PME, une start-up, un établissement scolaire ou que vous portiez un projet " +
        "entrepreneurial ambitieux, la visibilité et la performance numérique ne sont plus une option.",
      cta1: 'Discuter sur WhatsApp',
      cta2: 'Comment nous travaillons',
      decouvrir: 'Découvrir',
    },
    apropos: {
      eyebrow: 'Qui sommes-nous',
      titre: 'Un collectif de jeunes freelances congolais',
      description:
        "FoxGroup est une association de jeunes freelances basés à Kinshasa, réunis pour offrir aux entreprises, écoles " +
        "et porteurs de projets de RDC des solutions numériques sérieuses, sans les coûts et la lourdeur d'une grande agence. " +
        "Nous concevons, installons et accompagnons des solutions taillées pour la réalité du terrain congolais : connexion " +
        "internet parfois instable, besoin de fiabilité au quotidien, et exigence d'un vrai accompagnement humain.",
    },
    domaines: {
      eyebrow: 'Nos expertises',
      titre: 'Ce que nous construisons pour vous',
      liste: [
        {
          titre: 'Développement Web & Mobile',
          texte:
            "Applications sur mesure, plateformes performantes et sites internet professionnels, pensés pour accompagner " +
            "la croissance de votre activité, et non à des modèles génériques importés tels quels.",
          items: ['Sites internet professionnels et vitrines', 'Applications web et mobiles sur mesure', 'Plateformes et outils métier en ligne'],
        },
        {
          titre: 'Solutions de gestion',
          texte:
            "Des outils logiciels adaptés aux entreprises comme aux établissements scolaires, conçus pour simplifier vos " +
            "opérations quotidiennes et fonctionner sans dépendance à une connexion internet permanente.",
          items: ['Gestion des paiements et de la comptabilité', "Suivi des dossiers, des effectifs et des stocks", 'Gestion multi-devises : dollars et francs congolais'],
        },
        {
          titre: 'Réseau & Maintenance',
          texte:
            "Installation, sécurisation et support technique pour garantir la continuité de vos activités, afin que la " +
            "technologie reste un atout, jamais un obstacle.",
          items: ['Installation et sécurisation de réseau', 'Support technique et dépannage', 'Maintenance et suivi dans la durée'],
        },
      ],
    },
    equipe: {
      eyebrow: 'Notre équipe',
      titre: 'Les personnes derrière FoxGroup',
    },
    solutions: {
      eyebrow: 'Nos solutions',
      titre: 'Ce que nous avons déjà réalisé',
      enSavoirPlus: 'En savoir plus',
      videTitre: 'Nos solutions arrivent bientôt',
      videTexte: 'Revenez prochainement découvrir nos projets.',
    },
    solutionDetail: {
      retour: 'Retour à l’accueil',
      introuvableTitre: 'Cette solution est introuvable',
      introuvableTexte: 'Elle a peut-être été retirée.',
      ceQueCaResout: 'Ce que ça résout',
      cta: 'Commander ou poser une question',
      message: (titre) => `Bonjour, je suis intéressé(e) par « ${titre} ». J'aimerais en savoir plus et/ou passer commande.`,
    },
    methode: {
      eyebrow: 'Notre méthode',
      accroche: 'Comment nous travaillons',
      description:
        "Que vous ayez besoin d'un site, d'une application ou d'un outil de gestion, notre façon de travailler reste " +
        "la même : comprendre votre activité, installer une solution configurée pour vos besoins réels, former les " +
        "personnes qui l'utiliseront, puis rester présents après la mise en service — pas seulement le temps d'une livraison.",
      inclusTitre: 'Ce qui est inclus, à chaque projet',
      inclus: [
        "Installation et configuration adaptées à votre activité",
        "Formation de votre personnel à l'utilisation de l'outil",
        "Assistance technique après la mise en service",
        "Corrections et mises à jour correctives",
      ],
      cta: 'Discuter de mon projet',
    },
    engagements: {
      eyebrow: 'Nos engagements',
      titre: "Le choix de l'excellence et de l'intégrité",
      liste: [
        {
          titre: 'Vos données vous appartiennent',
          texte:
            "Les données saisies dans nos logiciels — dossiers, paiements, écritures comptables — restent la propriété " +
            "pleine et entière de votre établissement ou de votre entreprise. Vous pouvez en obtenir une copie complète " +
            "à tout moment, dans un format exploitable.",
        },
        {
          titre: 'Formation incluse',
          texte:
            "Nous formons votre personnel désigné à l'utilisation de chaque outil que nous installons, pour une prise " +
            "en main réelle et durable — pas seulement une livraison technique laissée à elle-même.",
        },
        {
          titre: 'Assistance technique réactive',
          texte:
            "Une période d'assistance technique suit chaque mise en service, avec une prise en charge rapide des " +
            "anomalies bloquantes et un accompagnement par téléphone, message ou intervention à distance.",
        },
        {
          titre: 'Confidentialité garantie',
          texte:
            "Les informations financières et internes de nos clients restent strictement confidentielles, pendant toute " +
            "la durée de notre collaboration et bien après sa fin.",
        },
      ],
    },
    contact: {
      titre: 'Discutons de votre projet',
      whatsapp: 'WhatsApp',
      appeler: 'Appeler',
    },
    footer: {
      slogan: 'Solutions logicielles',
    },
    introuvable: {
      titre: "Cette page n'existe pas",
      texte: 'Le lien est peut-être incorrect.',
      retour: "Retour à l'accueil",
    },
    admin: {
      connexion: {
        titre: 'Administration',
        sousTitre: "Connexion réservée à l'administrateur.",
        email: 'Email',
        motDePasse: 'Mot de passe',
        seConnecter: 'Se connecter',
        connexionEnCours: 'Connexion…',
      },
      layout: {
        equipe: 'Équipe',
        solutions: 'Solutions',
        voirLeSite: 'Voir le site',
        seDeconnecter: 'Se déconnecter',
      },
      equipe: {
        titre: 'Équipe',
        sousTitre: 'Les profils affichés dans la section « Notre équipe » du site.',
        ajouter: 'Ajouter',
        ajouterMembre: 'Ajouter un membre',
        aucunTitre: 'Aucun membre',
        aucunTexte: 'Ajoutez les 5 profils de votre équipe.',
        modifier: (nom) => `Modifier ${nom}`,
        supprimer: (nom) => `Supprimer ${nom}`,
        supprimerBouton: 'Supprimer',
        masque: 'Masqué',
        confirmerSuppressionTitre: 'Supprimer ce membre ?',
        confirmerSuppressionTexte: (nom) => `« ${nom} » sera retiré du site.`,
        annuler: 'Annuler',
        suppressionEnCours: 'Suppression…',
      },
      equipeForm: {
        modifierTitre: 'Modifier le membre',
        ajouterTitre: 'Ajouter un membre',
        photo: 'Photo',
        photoAide: 'JPG, PNG ou WebP, 5 Mo maximum.',
        retirerPhoto: 'Retirer la photo',
        nom: 'Nom',
        role: 'Rôle',
        rolePlaceholder: 'Ex. Fondateur, Développeur…',
        bio: 'Courte présentation',
        ordre: "Ordre d'affichage",
        ordreAide: "Les plus petits nombres s'affichent en premier.",
        visible: 'Visible sur le site',
        annuler: 'Annuler',
        enregistrement: 'Enregistrement…',
        enregistrer: 'Enregistrer',
        ajouter: 'Ajouter',
        erreurTailleImage: "L'image dépasse 5 Mo.",
        erreurNom: 'Donnez un nom.',
        erreurRole: 'Donnez un rôle.',
      },
      solutions: {
        titre: 'Solutions',
        sousTitre: 'Les projets affichés dans la section « Nos solutions » du site.',
        ajouter: 'Ajouter',
        ajouterSolution: 'Ajouter une solution',
        aucuneTitre: 'Aucune solution',
        aucuneTexte: 'Publiez votre première réalisation.',
        enAvant: 'En avant',
        masque: 'Masqué',
        modifier: (titre) => `Modifier ${titre}`,
        supprimer: (titre) => `Supprimer ${titre}`,
        supprimerBouton: 'Supprimer',
        confirmerSuppressionTitre: 'Supprimer cette solution ?',
        confirmerSuppressionTexte: (titre) => `« ${titre} » sera retirée du site.`,
        annuler: 'Annuler',
        suppressionEnCours: 'Suppression…',
      },
      solutionForm: {
        modifierTitre: 'Modifier la solution',
        ajouterTitre: 'Ajouter une solution',
        image: 'Image',
        imageAide: 'JPG, PNG ou WebP, 5 Mo maximum.',
        retirerImage: "Retirer l'image",
        titreChamp: 'Titre',
        titrePlaceholder: 'Ex. EcolePay',
        descriptionCourte: 'Courte description (affichée sur la carte, optionnel)',
        descriptionComplete: 'Description complète',
        probleme: 'Ce que ça résout',
        problemePlaceholder: 'Quel problème concret cette solution règle-t-elle pour le client ?',
        ordre: "Ordre d'affichage",
        mettreEnAvant: 'Mettre en avant',
        visible: 'Visible sur le site',
        annuler: 'Annuler',
        enregistrement: 'Enregistrement…',
        enregistrer: 'Enregistrer',
        publier: 'Publier',
        erreurTailleImage: "L'image dépasse 5 Mo.",
        erreurTitre: 'Donnez un titre à la solution.',
      },
    },
  },

  en: {
    nav: {
      equipe: 'Team',
      expertises: 'Expertise',
      solutions: 'Solutions',
      methode: 'How we work',
      engagements: 'Our commitments',
      contact: 'Contact',
      contacter: 'Contact us',
    },
    commun: {
      chargement: 'Loading…',
      reessayer: 'Try again',
      remonterHaut: 'Back to top',
      fermer: 'Close',
      navigationPrincipale: 'Main navigation',
      navigationMobile: 'Mobile navigation',
      menu: 'Menu',
      choisirLangue: 'Choose language',
    },
    hero: {
      slogan: 'Software solutions',
      titre1: 'Your ideas,',
      titre2: 'our digital realities.',
      accroche:
        "Whether you run an SME, a start-up, a school, or you're driving an ambitious entrepreneurial project, " +
        "visibility and digital performance are no longer optional.",
      cta1: 'Chat on WhatsApp',
      cta2: 'How we work',
      decouvrir: 'Discover',
    },
    apropos: {
      eyebrow: 'About us',
      titre: 'A collective of young Congolese freelancers',
      description:
        "FoxGroup is an association of young freelancers based in Kinshasa, brought together to offer businesses, " +
        "schools, and project owners across the DRC serious digital solutions — without the cost and overhead of a " +
        "large agency. We design, install, and support solutions built for the realities on the ground in Congo: " +
        "sometimes unstable internet connections, the need for everyday reliability, and genuine human support.",
    },
    domaines: {
      eyebrow: 'Our expertise',
      titre: 'What we build for you',
      liste: [
        {
          titre: 'Web & Mobile Development',
          texte:
            "Custom applications, high-performance platforms, and professional websites, designed to support the " +
            "growth of your business — not generic templates imported as-is.",
          items: ['Professional and showcase websites', 'Custom web and mobile applications', 'Online business tools and platforms'],
        },
        {
          titre: 'Management Solutions',
          texte:
            "Software tools adapted for businesses and schools alike, designed to simplify your daily operations and " +
            "run without depending on a permanent internet connection.",
          items: ['Payment and accounting management', 'Tracking of records, staff, and stock', 'Multi-currency management: US dollars and Congolese francs'],
        },
        {
          titre: 'Network & Maintenance',
          texte:
            "Installation, security, and technical support to keep your operations running, so that technology " +
            "stays an asset — never an obstacle.",
          items: ['Network installation and security', 'Technical support and troubleshooting', 'Ongoing maintenance and monitoring'],
        },
      ],
    },
    equipe: {
      eyebrow: 'Our team',
      titre: 'The people behind FoxGroup',
    },
    solutions: {
      eyebrow: 'Our solutions',
      titre: "What we've already built",
      enSavoirPlus: 'Learn more',
      videTitre: 'Our solutions are coming soon',
      videTexte: 'Check back soon to see our projects.',
    },
    solutionDetail: {
      retour: 'Back to home',
      introuvableTitre: 'This solution could not be found',
      introuvableTexte: 'It may have been removed.',
      ceQueCaResout: 'What it solves',
      cta: 'Order or ask a question',
      message: (titre) => `Hello, I'm interested in "${titre}". I'd like to know more and/or place an order.`,
    },
    methode: {
      eyebrow: 'Our method',
      accroche: 'How we work',
      description:
        "Whether you need a website, an application, or a management tool, our way of working stays the same: " +
        "understand your business, install a solution configured for your real needs, train the people who will " +
        "use it, then stay by your side after go-live — not just for the length of a delivery.",
      inclusTitre: "What's included, on every project",
      inclus: [
        "Installation and configuration tailored to your business",
        "Training your staff to use the tool",
        "Technical support after go-live",
        "Corrections and maintenance updates",
      ],
      cta: 'Discuss my project',
    },
    engagements: {
      eyebrow: 'Our commitments',
      titre: 'The choice of excellence and integrity',
      liste: [
        {
          titre: 'Your data belongs to you',
          texte:
            "Data entered into our software — records, payments, accounting entries — remains the full and complete " +
            "property of your organization or business. You can obtain a complete copy at any time, in a usable format.",
        },
        {
          titre: 'Training included',
          texte:
            "We train your designated staff to use every tool we install, for real, lasting adoption — not just a " +
            "technical handover left to fend for itself.",
        },
        {
          titre: 'Responsive technical support',
          texte:
            "A period of technical support follows every go-live, with rapid response to blocking issues and support " +
            "by phone, message, or remote intervention.",
        },
        {
          titre: 'Confidentiality guaranteed',
          texte:
            "Your financial and internal information stays strictly confidential, throughout our collaboration and " +
            "well beyond its end.",
        },
      ],
    },
    contact: {
      titre: "Let's talk about your project",
      whatsapp: 'WhatsApp',
      appeler: 'Call',
    },
    footer: {
      slogan: 'Software solutions',
    },
    introuvable: {
      titre: "This page doesn't exist",
      texte: 'The link may be incorrect.',
      retour: 'Back to home',
    },
    admin: {
      connexion: {
        titre: 'Administration',
        sousTitre: 'Login reserved for the administrator.',
        email: 'Email',
        motDePasse: 'Password',
        seConnecter: 'Sign in',
        connexionEnCours: 'Signing in…',
      },
      layout: {
        equipe: 'Team',
        solutions: 'Solutions',
        voirLeSite: 'View site',
        seDeconnecter: 'Sign out',
      },
      equipe: {
        titre: 'Team',
        sousTitre: 'The profiles shown in the "Our team" section of the site.',
        ajouter: 'Add',
        ajouterMembre: 'Add a member',
        aucunTitre: 'No members',
        aucunTexte: 'Add your 5 team profiles.',
        modifier: (nom) => `Edit ${nom}`,
        supprimer: (nom) => `Delete ${nom}`,
        supprimerBouton: 'Delete',
        masque: 'Hidden',
        confirmerSuppressionTitre: 'Delete this member?',
        confirmerSuppressionTexte: (nom) => `"${nom}" will be removed from the site.`,
        annuler: 'Cancel',
        suppressionEnCours: 'Deleting…',
      },
      equipeForm: {
        modifierTitre: 'Edit member',
        ajouterTitre: 'Add a member',
        photo: 'Photo',
        photoAide: 'JPG, PNG or WebP, 5 MB maximum.',
        retirerPhoto: 'Remove photo',
        nom: 'Name',
        role: 'Role',
        rolePlaceholder: 'E.g. Founder, Developer…',
        bio: 'Short bio',
        ordre: 'Display order',
        ordreAide: 'Smaller numbers appear first.',
        visible: 'Visible on the site',
        annuler: 'Cancel',
        enregistrement: 'Saving…',
        enregistrer: 'Save',
        ajouter: 'Add',
        erreurTailleImage: 'The image exceeds 5 MB.',
        erreurNom: 'Enter a name.',
        erreurRole: 'Enter a role.',
      },
      solutions: {
        titre: 'Solutions',
        sousTitre: 'The projects shown in the "Our solutions" section of the site.',
        ajouter: 'Add',
        ajouterSolution: 'Add a solution',
        aucuneTitre: 'No solutions',
        aucuneTexte: 'Publish your first project.',
        enAvant: 'Featured',
        masque: 'Hidden',
        modifier: (titre) => `Edit ${titre}`,
        supprimer: (titre) => `Delete ${titre}`,
        supprimerBouton: 'Delete',
        confirmerSuppressionTitre: 'Delete this solution?',
        confirmerSuppressionTexte: (titre) => `"${titre}" will be removed from the site.`,
        annuler: 'Cancel',
        suppressionEnCours: 'Deleting…',
      },
      solutionForm: {
        modifierTitre: 'Edit solution',
        ajouterTitre: 'Add a solution',
        image: 'Image',
        imageAide: 'JPG, PNG or WebP, 5 MB maximum.',
        retirerImage: 'Remove image',
        titreChamp: 'Title',
        titrePlaceholder: 'E.g. EcolePay',
        descriptionCourte: 'Short description (shown on the card, optional)',
        descriptionComplete: 'Full description',
        probleme: 'What it solves',
        problemePlaceholder: 'What concrete problem does this solution solve for the client?',
        ordre: 'Display order',
        mettreEnAvant: 'Feature this',
        visible: 'Visible on the site',
        annuler: 'Cancel',
        enregistrement: 'Saving…',
        enregistrer: 'Save',
        publier: 'Publish',
        erreurTailleImage: 'The image exceeds 5 MB.',
        erreurTitre: 'Give the solution a title.',
      },
    },
  },

  // Lingála (variante parlée à Kinshasa, avec des emprunts au français pour les
  // notions techniques — usage courant à l'oral). À faire relire par une
  // personne lingalaphone avant publication définitive : voir le message qui accompagne ce fichier.
  ln: {
    nav: {
      equipe: 'Ekipi',
      expertises: 'Misala na biso',
      solutions: 'Ba solution',
      methode: 'Ndenge tosalaka',
      engagements: 'Bilaka na biso',
      contact: 'Contact',
      contacter: 'Bengá biso',
    },
    commun: {
      chargement: 'Ezali kokoma…',
      reessayer: 'Meká lisusu',
      remonterHaut: 'Zongá na likoló',
      fermer: 'Kanga',
      navigationPrincipale: 'Navigation ya ebandeli',
      navigationMobile: 'Navigation ya mobile',
      menu: 'Menu',
      choisirLangue: 'Poná monoko',
    },
    hero: {
      slogan: 'Ba solution ya logiciel',
      titre1: 'Makanisi na yo,',
      titre2: 'misala na yo ya numérique.',
      accroche:
        "Ezala kompani na yo ya moke, start-up, eteyelo, to mokano ya mombongo ya monene — komonana malamu na " +
        "internet mpe kosala na ndenge ya numérique ezali lelo eloko ya ntina mingi.",
      cta1: 'Solola na biso na WhatsApp',
      cta2: 'Ndenge tosalaka',
      decouvrir: 'Yebá mingi',
    },
    apropos: {
      eyebrow: 'Biso nani ?',
      titre: 'Ekipi ya ba jeune freelance ya Congo',
      description:
        "FoxGroup ezali association ya ba jeune freelance oyo bazali na Kinshasa, basangani mpo na kopesa ba entreprise, " +
        "ba eteyelo, na bato oyo bazali na ba projet na RDC, ba solution ya numérique ya solo — kasi na mbongo mingi te " +
        "lokola agence ya monene. Tosalaka mpe totiaka ba solution oyo ekokani na bomoi ya mokili ya Congo : internet " +
        "oyo ezalaka ntango mosusu makasi te, bosenga ya kozala solide mikolo nyonso, mpe bosenga ya lisungi ya bato ya solo.",
    },
    domaines: {
      eyebrow: 'Makoki na biso',
      titre: 'Biloko oyo tosalaka mpo na bino',
      liste: [
        {
          titre: 'Site Internet na Application',
          texte:
            "Ba application oyo ekokani na bino, ba plateforme ya makasi, na ba site internet ya professionnel, mpo " +
            "na kosunga bokoli ya mombongo na bino — kasi modèle ya bipai mosusu te.",
          items: ['Ba site internet ya professionnel', 'Ba application web na mobile oyo ekokani na bino', 'Ba plateforme na bisaleli ya mombongo na internet'],
        },
        {
          titre: 'Ba Solution ya Gestion',
          texte:
            "Ba outils ya logiciel oyo ekokani na ba entreprise mpe na ba eteyelo, mpo na kopetola mosala na bino ya " +
            "mokolo na mokolo, mpe ekoki kosala ata soki internet ezali te.",
          items: ['Gestion ya mbongo na comptabilité', 'Bokengeli ya ba dossier, basali, na biloko', 'Gestion ya mbongo mibale : dollar na franc congolais'],
        },
        {
          titre: 'Réseau na Maintenance',
          texte:
            "Kotia, kobatela, na kosunga na tekiniki mpo mosala na bino etikala kotambola tango nyonso — technologie " +
            "ezala kaka lisungi, esika ya mokakatano te.",
          items: ['Kotia na kobatela réseau', 'Lisungi ya tekiniki', 'Maintenance na bokengeli tango nyonso'],
        },
      ],
    },
    equipe: {
      eyebrow: 'Ekipi na biso',
      titre: 'Bato oyo batambwisaka FoxGroup',
    },
    solutions: {
      eyebrow: 'Ba solution na biso',
      titre: 'Oyo tosili kosala',
      enSavoirPlus: 'Yebá mingi',
      videTitre: 'Ba solution na biso ekoya kala te',
      videTexte: 'Zongá noki mpo na komona misala na biso.',
    },
    solutionDetail: {
      retour: 'Zongá na ndako',
      introuvableTitre: 'Solution oyo emonani te',
      introuvableTexte: 'Ekoki kozala ete balongoli yango.',
      ceQueCaResout: 'Mokakatano oyo esilisaka',
      cta: 'Tuná to somba',
      message: (titre) => `Mbote, nalingi koyeba mingi to kosomba « ${titre} ».`,
    },
    methode: {
      eyebrow: 'Ndenge na biso',
      accroche: 'Ndenge tosalaka',
      description:
        "Ezala site, application, to outil ya gestion oyo osengeli na yango, ndenge na biso ya kosala etikalaka kaka " +
        "moko : koyeba mombongo na yo, kotia solution oyo ekokani na bosenga na yo, kolakisa bato oyo bakosalela " +
        "yango, mpe kotikala pene na yo sima ya mosala — kaka te mpo na mikolo ya livraison.",
      inclusTitre: 'Oyo ezali kati na mosala, na proyè nyonso',
      inclus: [
        'Kotia na configuration oyo ekokani na mombongo na yo',
        'Kolakisa basali na yo kosalela outil',
        'Lisungi ya tekiniki sima ya mosala',
        'Kobongisa na kokitisa ba mise à jour',
      ],
      cta: 'Solola na biso mpo na proyè na ngai',
    },
    engagements: {
      eyebrow: 'Bilaka na biso',
      titre: 'Kopona bolamu na bosembo',
      liste: [
        {
          titre: 'Ba data na yo ezali ya yo',
          texte:
            "Ba data oyo ekomami na ba logiciel na biso — ba dossier, mbongo, écriture ya comptabilité — etikalaka " +
            "biloko ya société to ya entreprise na yo, mobimba. Okoki kozwa copie na yango tango nyonso.",
        },
        {
          titre: 'Formation ekoti na kati',
          texte:
            "Tolakisaka basali na bino kosalela outil nyonso oyo totie, mpo bayeba mpenza kosalela yango — kaka te " +
            "kopesa eloko mpe kotika.",
        },
        {
          titre: 'Lisungi ya tekiniki, noki',
          texte:
            "Ntango ya lisungi ya tekiniki elandaka mosala nyonso, na koyanola noki na ba mokakatano, na téléphone, " +
            "message, to na internet.",
        },
        {
          titre: 'Sekele ekobatelama',
          texte:
            "Ba nsango ya mbongo mpe ya kati ya ba client na biso etikalaka sekele, na ntango nyonso ya mosala elongo " +
            "na biso, mpe sima na yango.",
        },
      ],
    },
    contact: {
      titre: 'Tosolola mpo na proyè na yo',
      whatsapp: 'WhatsApp',
      appeler: 'Bengá',
    },
    footer: {
      slogan: 'Ba solution ya logiciel',
    },
    introuvable: {
      titre: 'Page oyo ezali te',
      texte: "Ekoki kozala ete lien esili kobeba.",
      retour: 'Zongá na ndako',
    },
    admin: {
      connexion: {
        titre: 'Administration',
        sousTitre: 'Kokota ezali kaka mpo na administrateur.',
        email: 'Email',
        motDePasse: 'Mot de passe',
        seConnecter: 'Kokota',
        connexionEnCours: 'Kokota…',
      },
      layout: {
        equipe: 'Ekipi',
        solutions: 'Ba solution',
        voirLeSite: 'Talá site',
        seDeconnecter: 'Bima',
      },
      equipe: {
        titre: 'Ekipi',
        sousTitre: 'Ba profil oyo emonanaka na eteni « Ekipi na biso » ya site.',
        ajouter: 'Bakisa',
        ajouterMembre: 'Bakisa moto',
        aucunTitre: 'Moto ata moko te',
        aucunTexte: 'Bakisa ba profil 5 ya ekipi na yo.',
        modifier: (nom) => `Bongisa ${nom}`,
        supprimer: (nom) => `Longola ${nom}`,
        supprimerBouton: 'Longola',
        masque: 'Ebombami',
        confirmerSuppressionTitre: 'Olongola moto oyo ?',
        confirmerSuppressionTexte: (nom) => `« ${nom} » akolongwa na site.`,
        annuler: 'Tiká',
        suppressionEnCours: 'Kolongola…',
      },
      equipeForm: {
        modifierTitre: 'Bongisa moto',
        ajouterTitre: 'Bakisa moto',
        photo: 'Photo',
        photoAide: 'JPG, PNG to WebP, 5 Mo na likolo te.',
        retirerPhoto: 'Longola photo',
        nom: 'Nkombo',
        role: 'Rôle',
        rolePlaceholder: 'Ex. Fondateur, Développeur…',
        bio: 'Lisoló ya mokuse',
        ordre: 'Molongo ya komonana',
        ordreAide: 'Mitúya ya moke emonanaka liboso.',
        visible: 'Emonani na site',
        annuler: 'Tiká',
        enregistrement: 'Kobomba…',
        enregistrer: 'Bomba',
        ajouter: 'Bakisa',
        erreurTailleImage: 'Image eleki 5 Mo.',
        erreurNom: 'Pesá nkombo.',
        erreurRole: 'Pesá rôle.',
      },
      solutions: {
        titre: 'Ba solution',
        sousTitre: 'Ba proyè oyo emonanaka na eteni « Ba solution na biso » ya site.',
        ajouter: 'Bakisa',
        ajouterSolution: 'Bakisa solution',
        aucuneTitre: 'Solution ata moko te',
        aucuneTexte: 'Bimisa proyè na yo ya liboso.',
        enAvant: 'Na liboso',
        masque: 'Ebombami',
        modifier: (titre) => `Bongisa ${titre}`,
        supprimer: (titre) => `Longola ${titre}`,
        supprimerBouton: 'Longola',
        confirmerSuppressionTitre: 'Olongola solution oyo ?',
        confirmerSuppressionTexte: (titre) => `« ${titre} » ekolongwa na site.`,
        annuler: 'Tiká',
        suppressionEnCours: 'Kolongola…',
      },
      solutionForm: {
        modifierTitre: 'Bongisa solution',
        ajouterTitre: 'Bakisa solution',
        image: 'Image',
        imageAide: 'JPG, PNG to WebP, 5 Mo na likolo te.',
        retirerImage: 'Longola image',
        titreChamp: 'Titre',
        titrePlaceholder: 'Ex. EcolePay',
        descriptionCourte: 'Lisoló ya mokuse (emonanaka na carte, na posa te)',
        descriptionComplete: 'Lisoló mobimba',
        probleme: 'Oyo esilisaka',
        problemePlaceholder: 'Mokakatano nini solution oyo esilisaka mpo na client ?',
        ordre: 'Molongo ya komonana',
        mettreEnAvant: 'Tiá na liboso',
        visible: 'Emonani na site',
        annuler: 'Tiká',
        enregistrement: 'Kobomba…',
        enregistrer: 'Bomba',
        publier: 'Bimisa',
        erreurTailleImage: 'Image eleki 5 Mo.',
        erreurTitre: 'Pesá titre na solution.',
      },
    },
  },
};
