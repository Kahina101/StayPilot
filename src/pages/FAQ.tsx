import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    category: 'Licence perpétuelle',
    questions: [
      {
        q: 'Comment fonctionne la licence perpétuelle ?',
        a: 'Vous achetez votre licence une seule fois et elle reste valide à vie. Toutes les fonctionnalités disponibles au moment de votre achat restent accessibles pour toujours, même si vous décidez de ne pas souscrire à la maintenance.',
      },
      {
        q: 'Que se passe-t-il si je n\'achète pas la maintenance ?',
        a: 'Votre licence reste parfaitement fonctionnelle. Vous continuez à utiliser toutes les fonctionnalités existantes. Cependant, vous n\'aurez pas accès aux nouvelles fonctionnalités ajoutées après votre achat et au support prioritaire.',
      },
      {
        q: 'Est-ce que ma licence expire ?',
        a: 'Non, jamais. C\'est une licence perpétuelle. Vous l\'achetez une fois et elle est à vous pour toujours.',
      },
    ],
  },
  {
    category: 'Maintenance',
    questions: [
      {
        q: 'Pourquoi le prix de maintenance augmente après un an ?',
        a: 'Nous offrons une réduction de 50% la première année pour faciliter votre démarrage et vous permettre de tester notre service. C\'est une stratégie d\'acquisition transparente : vous payez moins au début, puis le tarif standard s\'applique. Vous êtes toujours libre d\'annuler à tout moment.',
      },
      {
        q: 'Que se passe-t-il si j\'annule ma maintenance ?',
        a: 'Votre licence reste valide à vie. Les fonctionnalités disponibles au moment de l\'annulation restent accessibles. Seules les nouvelles fonctionnalités ajoutées après l\'annulation nécessiteront la maintenance pour y accéder.',
      },
      {
        q: 'Puis-je réactiver ma maintenance plus tard ?',
        a: 'Oui, absolument ! Vous pouvez réactiver la maintenance à tout moment et vous bénéficierez à nouveau du tarif promotionnel pendant 12 mois. C\'est notre engagement envers vous.',
      },
      {
        q: 'Serai-je prévenu avant que le tarif change ?',
        a: 'Oui. Nous vous enverrons des rappels à 60 jours, 30 jours et 7 jours avant le passage au tarif standard. Vous pourrez annuler à tout moment si vous le souhaitez.',
      },
    ],
  },
  {
    category: 'Upgrades',
    questions: [
      {
        q: 'Comment faire un upgrade de licence ?',
        a: 'Les upgrades sont gérés manuellement pour garantir une transition parfaite. Contactez-nous via la page Contact avec votre tier actuel et le tier souhaité. Nous vous répondrons sous 24h avec une offre personnalisée tenant compte de ce que vous avez déjà payé.',
      },
      {
        q: 'Puis-je downgrader ma licence ?',
        a: 'Les licences étant perpétuelles, il n\'y a pas de downgrade possible. Cependant, vous pouvez annuler votre maintenance à tout moment pour réduire vos coûts mensuels.',
      },
    ],
  },
  {
    category: 'Comparaison et ROI',
    questions: [
      {
        q: 'Quel est le coût total sur plusieurs années ?',
        a: 'Standard: 1 500€ + (720€ an 1 + 1 440€/an ensuite) = 2 220€ la 1ère année, puis 2 940€/an. Pro: 3 000€ + (1 440€ an 1 + 2 880€/an ensuite) = 4 440€ la 1ère année, puis 5 880€/an. Premium: 9 000€ + (2 760€ an 1 + 5 520€/an ensuite) = 11 760€ la 1ère année, puis 14 520€/an.',
      },
      {
        q: 'Quelle licence choisir pour ma situation ?',
        a: 'Standard: Parfait pour débuter ou gérer jusqu\'à 10 logements. Économisez 10h/semaine. Pro: Idéal pour la croissance, jusqu\'à 30 logements avec équipe. Économisez 20h/semaine. Premium: Pour devenir le gestionnaire de prestige avec croissance illimitée et support dédié. Économisez 40h+/semaine.',
      },
    ],
  },
  {
    category: 'Paiement et facturation',
    questions: [
      {
        q: 'Quels moyens de paiement acceptez-vous ?',
        a: 'Nous acceptons toutes les cartes bancaires (Visa, Mastercard, American Express) via notre plateforme de paiement sécurisée Stripe.',
      },
      {
        q: 'Comment gérer mes moyens de paiement pour la maintenance ?',
        a: 'Depuis votre page Paramètres, cliquez sur "Gérer ma maintenance" pour accéder à votre portail client Stripe où vous pouvez mettre à jour votre carte bancaire.',
      },
      {
        q: 'Puis-je obtenir une facture ?',
        a: 'Oui, vous recevez automatiquement une facture par email pour chaque paiement. Vous pouvez également accéder à l\'historique de toutes vos factures depuis votre compte.',
      },
    ],
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Questions fréquentes
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Tout ce que vous devez savoir sur notre modèle de licence perpétuelle et la maintenance
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((category, catIndex) => (
            <div key={catIndex} className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, qIndex) => {
                  const globalIndex = catIndex * 100 + qIndex;
                  const isOpen = openIndex === globalIndex;

                  return (
                    <div
                      key={qIndex}
                      className="border border-slate-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-semibold text-slate-900 pr-8">{faq.q}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-600 flex-shrink-0 transition-transform ${
                            isOpen ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4 text-slate-600 leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Vous avez d'autres questions ?</h2>
          <p className="text-lg mb-6">
            Notre équipe est là pour vous aider. N'hésitez pas à nous contacter.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
          >
            Contactez-nous
          </a>
        </div>
      </div>
    </div>
  );
}
