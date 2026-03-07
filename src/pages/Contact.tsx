import { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { useAuth } from '../context/AuthContext';

export function Contact() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    subject: '',
    message: '',
    requestType: 'general',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSuccess(true);
    setLoading(false);
    setFormData({
      name: '',
      email: user?.email || '',
      subject: '',
      message: '',
      requestType: 'general',
    });

    setTimeout(() => setSuccess(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Contactez-nous</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Une question sur votre licence, un upgrade ou un besoin spécifique ? Nous sommes là pour vous aider.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Email</h3>
            <p className="text-sm text-slate-600 mb-2">support@example.com</p>
            <p className="text-xs text-slate-500">Réponse sous 24h</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Chat en direct</h3>
            <p className="text-sm text-slate-600 mb-2">Lun-Ven, 9h-18h</p>
            <p className="text-xs text-slate-500">Réponse immédiate</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-4">
              <CheckCircle className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Upgrades</h3>
            <p className="text-sm text-slate-600 mb-2">Demande personnalisée</p>
            <p className="text-xs text-slate-500">Réponse sous 24h</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {success && (
            <Alert variant="success" className="mb-6">
              <CheckCircle className="w-4 h-4" />
              <div className="ml-2">
                <p className="font-medium">Message envoyé avec succès !</p>
                <p className="text-sm mt-1">
                  Nous vous répondrons dans les plus brefs délais.
                </p>
              </div>
            </Alert>
          )}

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type de demande
              </label>
              <select
                name="requestType"
                value={formData.requestType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="general">Question générale</option>
                <option value="upgrade">Demande d'upgrade de licence</option>
                <option value="technical">Support technique</option>
                <option value="billing">Facturation</option>
                <option value="feature">Demande de fonctionnalité</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Nom complet"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jean Dupont"
                required
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jean@exemple.com"
                required
              />
            </div>

            <Input
              label="Sujet"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Décrivez brièvement votre demande"
              required
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Expliquez-nous comment nous pouvons vous aider..."
                required
              />
              <p className="text-sm text-slate-500 mt-2">
                Pour les demandes d'upgrade, merci de préciser votre licence actuelle et le tier souhaité.
              </p>
            </div>

            <Button type="submit" loading={loading} className="w-full md:w-auto">
              <Send className="w-4 h-4 mr-2" />
              Envoyer le message
            </Button>
          </form>
        </div>

        <div className="mt-12 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Demande d'upgrade de licence</h2>
          <p className="text-slate-300 mb-4">
            Vous souhaitez passer à un tier supérieur ? Contactez-nous avec les informations suivantes :
          </p>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Votre licence actuelle (Standard, Pro ou Premium)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>Le tier souhaité</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span>La raison de l'upgrade (croissance, nouvelles fonctionnalités, etc.)</span>
            </li>
          </ul>
          <p className="text-slate-300 mt-4">
            Nous vous répondrons sous 24h avec une offre personnalisée tenant compte de ce que vous avez déjà payé.
          </p>
        </div>
      </div>
    </div>
  );
}
