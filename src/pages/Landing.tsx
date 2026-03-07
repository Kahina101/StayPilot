import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  Zap,
  Users,
  CheckCircle,
  BarChart3,
  Lock,
  Globe,
  Clock,
  Headphones,
  Star,
  ChevronDown,
  Play,
  Building2,
  TrendingUp,
  Layers,
  MessageSquare,
  Calendar,
  FileText,
  Smartphone
} from 'lucide-react';
import { Button } from '../components/ui';
import { PublicHeader } from '../components/layout/Header';
import { useState } from 'react';

const features = [
  {
    icon: Calendar,
    title: 'Synchronisation multi-plateformes',
    description: 'Centralisez vos réservations Airbnb, Booking, et autres plateformes dans une seule interface.',
  },
  {
    icon: Zap,
    title: 'Automatisation des tâches',
    description: 'Automatisez check-in, check-out, messages de bienvenue et rappels pour gagner du temps.',
  },
  {
    icon: MessageSquare,
    title: 'Messagerie centralisée',
    description: 'Gérez toutes vos conversations clients depuis un seul endroit, quelle que soit la plateforme.',
  },
  {
    icon: BarChart3,
    title: 'Rapports en temps réel',
    description: 'Suivez vos performances, revenus et taux d\'occupation avec des tableaux de bord actualisés.',
  },
  {
    icon: Users,
    title: 'Gestion d\'équipe',
    description: 'Coordonnez vos équipes de ménage, maintenance et accueil avec des plannings intelligents.',
  },
  {
    icon: Lock,
    title: 'Sécurité entreprise',
    description: 'Protection des données, accès sécurisés et conformité RGPD pour une gestion fiable et professionnelle.',
  },
];

const stats = [
  { value: '2 500+', label: 'Conciergeries clientes' },
  { value: '99.9%', label: 'Disponibilité' },
  { value: '150K+', label: 'Réservations/mois' },
  { value: '4.9/5', label: 'Satisfaction client' },
];

const testimonials = [
  {
    quote: 'Grâce à StayPilot, je gère désormais 40 appartements au lieu de 15, sans embaucher de personnel supplémentaire.',
    author: 'Sophie Lavandier',
    role: 'Propriétaire',
    company: 'Conciergerie du Marais',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  },
  {
    quote: 'L\'automatisation des messages et du check-in nous fait économiser 20 heures par semaine. Un vrai gain de temps !',
    author: 'Alexandre Beaumont',
    role: 'Gérant',
    company: 'Nice Riviera Stays',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  },
  {
    quote: 'Interface claire, fonctionnalités complètes et support réactif. Je recommande à tous les professionnels.',
    author: 'Camille Deveraux',
    role: 'Co-fondatrice',
    company: 'Alpine Retreats',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  },
];

const pricingPlans = [
  {
    name: 'Solo',
    description: 'Pour les propriétaires indépendants',
    price: '39',
    period: '/mois',
    features: [
      'Jusqu\'à 5 logements',
      'Synchronisation Airbnb & Booking',
      'Messagerie centralisée',
      'Automatisations basiques',
      'Support email',
    ],
    cta: 'Commencer',
    popular: false,
  },
  {
    name: 'Professionnel',
    description: 'Pour les conciergeries en croissance',
    price: '99',
    period: '/mois',
    features: [
      'Jusqu\'à 25 logements',
      'Toutes les plateformes',
      'Automatisations avancées',
      'Gestion d\'équipe',
      'Rapports détaillés',
      'Support prioritaire',
      'Application mobile',
    ],
    cta: 'Essai gratuit',
    popular: true,
  },
  {
    name: 'Entreprise',
    description: 'Pour les grandes conciergeries',
    price: 'Sur mesure',
    period: '',
    features: [
      'Logements illimités',
      'API personnalisée',
      'Intégrations sur mesure',
      'Account manager dédié',
      'Formation de l\'équipe',
      'SLA garanti',
      'Facturation personnalisée',
    ],
    cta: 'Nous contacter',
    popular: false,
  },
];

const faqs = [
  {
    question: 'Comment fonctionne la synchronisation avec les plateformes ?',
    answer: 'StayPilot se connecte automatiquement à vos comptes Airbnb, Booking.com et autres plateformes via leurs API officielles. Les réservations, messages et calendriers sont synchronisés en temps réel, sans intervention manuelle.',
  },
  {
    question: 'Puis-je essayer gratuitement avant de m\'engager ?',
    answer: 'Oui, nous offrons 14 jours d\'essai gratuit du plan Professionnel, sans carte bancaire requise. Vous pouvez tester toutes les fonctionnalités et décider ensuite du plan qui vous convient.',
  },
  {
    question: 'Mes données clients sont-elles sécurisées ?',
    answer: 'Absolument. Nous utilisons un chiffrement bancaire (AES-256) pour protéger vos données. Nos serveurs sont hébergés en Europe et nous sommes conformes au RGPD. Vos données ne sont jamais partagées avec des tiers.',
  },
  {
    question: 'Puis-je gérer plusieurs équipes avec StayPilot ?',
    answer: 'Oui, vous pouvez créer différents rôles (ménage, maintenance, accueil) et assigner des tâches spécifiques à chaque membre. Chaque personne reçoit uniquement les informations nécessaires à son travail.',
  },
  {
    question: 'Quelles plateformes sont supportées ?',
    answer: 'Nous supportons Airbnb, Booking.com, Vrbo, Abritel, Expedia et plus de 20 autres plateformes de location. De nouvelles intégrations sont ajoutées régulièrement selon les demandes de nos clients.',
  },
];

const platformLogos = [
  { name: 'Booking.com', color: 'text-blue-600' },
  { name: 'Airbnb', color: 'text-rose-500' },
  { name: 'Abritel', color: 'text-blue-700' },
  { name: 'Tripadvisor', color: 'text-green-600' },
  { name: 'Expedia', color: 'text-yellow-600' },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-primary-blue transition-colors"
      >
        <span className="text-lg font-medium text-gray-900">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96 pb-6' : 'max-h-0'
        }`}
      >
        <p className="text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-soft-blue">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-medium mb-8 shadow-soft border border-gray-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-green"></span>
              </span>
              <span className="text-gray-700">Nouveau : Application mobile disponible</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-[1.1] animate-slide-up">
              La plateforme pensée
              <span className="block bg-gradient-blue-green bg-clip-text text-transparent mt-2">
                pour votre conciergerie
              </span>
            </h1>
            <p className="mt-8 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Moins de gestion, plus de location. Synchronisation multi-plateformes, automatisation des tâches, messagerie centralisée : Pilotez votre activité avec un suivi et des rapports en temps réel
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="group bg-primary-blue hover:bg-blue-700 text-white shadow-colored">
                  Démarrer gratuitement
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="group border-gray-300 text-gray-700 hover:bg-gray-50">
                <Play className="mr-2 w-5 h-5" />
                Voir la démo
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Essai gratuit 14 jours - Aucune carte bancaire requise
            </p>
          </div>

          <div className="mt-20 relative animate-slide-up">
            <div className="bg-white rounded-2xl shadow-large overflow-hidden border border-gray-200">
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-4 text-sm text-gray-500">dashboard.staypilot.com</span>
              </div>
              <div className="p-6 bg-gradient-light">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Revenus ce mois', value: '24 500 €', trend: '+12.5%', color: 'text-primary-blue' },
                    { label: 'Taux occupation', value: '87%', trend: '+5.2%', color: 'text-primary-green' },
                    { label: 'Note moyenne', value: '4.8/5', trend: '+0.2', color: 'text-accent-yellow' },
                    { label: 'Logements actifs', value: '32', trend: '+4', color: 'text-gray-700' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-lg p-4 shadow-soft border border-gray-100">
                      <p className="text-gray-500 text-sm">{stat.label}</p>
                      <p className={`${stat.color} text-2xl font-bold mt-1`}>{stat.value}</p>
                      <p className="text-primary-green text-sm mt-1">{stat.trend}</p>
                    </div>
                  ))}
                </div>
                <div className="h-48 bg-white rounded-lg flex items-end justify-around px-6 pb-4 shadow-soft border border-gray-100">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                    <div
                      key={i}
                      className="w-6 bg-gradient-to-t from-primary-blue to-primary-green rounded-t hover:opacity-80 transition-all"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm font-medium text-gray-400 mb-8 tracking-wider uppercase">
            Intégrations avec vos plateformes favorites
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
            {platformLogos.map((platform) => (
              <div key={platform.name} className={`text-2xl font-bold ${platform.color} hover:opacity-70 transition-opacity`}>
                {platform.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary-blue tracking-wide uppercase">
              Fonctionnalités
            </span>
            <h2 className="mt-4 text-4xl font-bold text-gray-900">
              Tout pour gérer votre conciergerie
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Des outils simples et puissants pour automatiser, organiser et développer votre activité.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-8 rounded-2xl bg-white border border-gray-200 hover:shadow-medium hover:border-primary-blue/30 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-soft-blue rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-primary-blue" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-soft-blue">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group">
                <p className="text-5xl font-bold bg-gradient-blue-green bg-clip-text text-transparent group-hover:scale-110 transition-transform">{stat.value}</p>
                <p className="mt-2 text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-semibold text-primary-blue tracking-wide uppercase">
                Pourquoi StayPilot
              </span>
              <h2 className="mt-4 text-4xl font-bold text-gray-900">
                Conçu pour les professionnels de la location
              </h2>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Développé avec des gestionnaires de conciergerie, StayPilot simplifie chaque aspect
                de votre métier : réservations, communication, équipes et finances.
              </p>

              <div className="mt-10 space-y-6">
                {[
                  {
                    icon: TrendingUp,
                    title: 'Augmentez vos revenus',
                    description: 'Optimisez vos tarifs et votre taux d\'occupation grâce aux analyses en temps réel.',
                  },
                  {
                    icon: Clock,
                    title: 'Gagnez du temps',
                    description: 'Automatisez les tâches répétitives et libérez 15h par semaine minimum.',
                  },
                  {
                    icon: Smartphone,
                    title: 'Gérez où que vous soyez',
                    description: 'Application mobile complète pour piloter votre activité en déplacement.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-soft-blue rounded-lg flex items-center justify-center group-hover:shadow-soft transition-all">
                      <item.icon className="w-6 h-6 text-primary-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="mt-1 text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-large p-8 border border-gray-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary-green/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-primary-green" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Configuration terminée</p>
                    <p className="text-sm text-gray-500">Votre espace est prêt à l\'emploi</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    'Compte créé et configuré',
                    'Plateformes connectées',
                    'Équipe invitée',
                    'Premiers logements ajoutés',
                    'Automatisations activées',
                  ].map((step, i) => (
                    <div key={step} className="flex items-center gap-3 group">
                      <div className="w-6 h-6 bg-primary-green rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm text-gray-500 bg-light-gray px-4 py-3 rounded-lg">
                  ⚡ Temps moyen de configuration : 10 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-light-gray" id="testimonials">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary-blue tracking-wide uppercase">
              Témoignages
            </span>
            <h2 className="mt-4 text-4xl font-bold text-gray-900">
              Ce que nos clients disent
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.author}
                className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all border border-gray-100"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent-yellow text-accent-yellow" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-8">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm font-medium text-gray-400 mb-8 tracking-wider uppercase">
            Ils nous font confiance
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6e/Booking.com_logo.svg" alt="Booking.com" className="h-10 opacity-60 hover:opacity-100 transition-opacity" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" alt="Airbnb" className="h-10 opacity-60 hover:opacity-100 transition-opacity" />
            <img src="https://logos-world.net/wp-content/uploads/2021/08/Abritel-Logo.png" alt="Abritel" className="h-12 opacity-60 hover:opacity-100 transition-opacity" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/11/TripAdvisor_Logo.svg" alt="Tripadvisor" className="h-10 opacity-60 hover:opacity-100 transition-opacity" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/22/Expedia_Logo.svg" alt="Expedia" className="h-8 opacity-60 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white" id="pricing">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary-blue tracking-wide uppercase">
              Tarifs
            </span>
            <h2 className="mt-4 text-4xl font-bold text-gray-900">
              Un prix adapté à chaque étape
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Commencez gratuitement, évoluez selon vos besoins. Tous les plans incluent
              l'essai gratuit de 14 jours.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 transition-all ${
                  plan.popular
                    ? 'bg-gradient-blue-green text-white shadow-colored scale-105 border-2 border-primary-blue'
                    : 'bg-white border-2 border-gray-200 hover:border-primary-blue/50 hover:shadow-soft'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-yellow text-gray-900 text-sm font-medium rounded-full shadow-soft">
                    Le plus populaire
                  </span>
                )}
                <h3 className={`text-xl font-semibold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`mt-2 text-sm ${plan.popular ? 'text-white/80' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
                <div className="mt-6 mb-8">
                  <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price.includes('mesure') ? plan.price : `${plan.price}€`}
                  </span>
                  {plan.period && (
                    <span className={plan.popular ? 'text-white/80' : 'text-gray-500'}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 ${plan.popular ? 'text-white' : 'text-primary-green'}`} />
                      <span className={plan.popular ? 'text-white/90' : 'text-gray-700'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link to="/signup">
                  <Button
                    fullWidth
                    className={plan.popular ? 'bg-white text-primary-blue hover:bg-gray-50' : 'bg-primary-blue text-white hover:bg-blue-700'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-light-gray" id="faq">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary-blue tracking-wide uppercase">
              FAQ
            </span>
            <h2 className="mt-4 text-4xl font-bold text-gray-900">
              Questions fréquentes
            </h2>
          </div>

          <div className="bg-white rounded-2xl px-8 shadow-soft border border-gray-200">
            {faqs.map((faq) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Vous avez d'autres questions ?</p>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <Headphones className="w-4 h-4 mr-2" />
              Contacter le support
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-blue-green relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Building2 className="w-16 h-16 text-white/20 mx-auto mb-8" />
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Prêt à professionnaliser votre conciergerie ?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Rejoignez les milliers de professionnels qui ont choisi StayPilot.
            Essayez gratuitement pendant 14 jours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-primary-blue hover:bg-gray-50 shadow-large">
                Démarrer gratuitement
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              Demander une démo
            </Button>
          </div>
          <p className="mt-6 text-sm text-white/80">
            Configuration en 10 minutes - Aucune carte bancaire requise
          </p>
        </div>
      </section>

      <footer className="bg-gray-50 border-t border-gray-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-blue-green rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-gray-900">StayPilot</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                La plateforme qui simplifie la gestion de votre conciergerie.
                Automatisez, organisez, développez.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Produit</h4>
              <ul className="space-y-3">
                {['Fonctionnalités', 'Tarifs', 'Intégrations', 'Application mobile', 'Nouveautés'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 hover:text-primary-blue transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Ressources</h4>
              <ul className="space-y-3">
                {['Documentation', 'Guides', 'Blog', 'Communauté', 'Webinaires'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 hover:text-primary-blue transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Entreprise</h4>
              <ul className="space-y-3">
                {['À propos', 'Carrières', 'Contact', 'Partenaires', 'Mentions légales'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 hover:text-primary-blue transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 StayPilot. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-primary-blue transition-colors text-sm">
                Confidentialité
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-blue transition-colors text-sm">
                CGU
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-blue transition-colors text-sm">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
