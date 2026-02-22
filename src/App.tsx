/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle2, 
  Gift, 
  Star, 
  TrendingUp, 
  Users, 
  Zap, 
  MessageCircle, 
  ShieldCheck, 
  Clock,
  ArrowRight,
  Lock,
  Unlock,
  AlertCircle,
  X
} from "lucide-react";

const PlanCard = ({ 
  title, 
  price, 
  duration, 
  features, 
  onSelect,
  highlight = false, 
  color = "emerald" 
}: { 
  title: string; 
  price: string; 
  duration: string; 
  features: string[]; 
  onSelect: () => void;
  highlight?: boolean;
  color?: "emerald" | "amber" | "blue";
}) => {
  const colorClasses = {
    emerald: "border-emerald-500/20 bg-emerald-50/50",
    amber: "border-amber-500/20 bg-amber-50/50",
    blue: "border-blue-500/20 bg-blue-50/50"
  };

  const accentClasses = {
    emerald: "bg-emerald-600",
    amber: "bg-amber-600",
    blue: "bg-blue-600"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative p-6 rounded-3xl border-2 ${highlight ? 'scale-105 z-10 shadow-xl' : 'shadow-sm'} ${colorClasses[color]} flex flex-col h-full`}
    >
      {highlight && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
          Más Popular
        </div>
      )}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{duration}</p>
      </div>
      <div className="mb-6">
        <span className="text-3xl font-bold text-slate-900">{price}</span>
        <span className="text-slate-500 ml-1">Bs</span>
      </div>
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircle2 className={`w-5 h-5 shrink-0 ${color === 'amber' ? 'text-amber-500' : color === 'blue' ? 'text-blue-500' : 'text-emerald-500'}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button 
        onClick={onSelect}
        className={`w-full py-3 rounded-xl font-bold text-white transition-transform active:scale-95 ${accentClasses[color]}`}
      >
        Elegir Plan
      </button>
    </motion.div>
  );
};

export default function App() {
  const [showForecastModal, setShowForecastModal] = useState(false);
  const [showInternalBrowser, setShowInternalBrowser] = useState(false);
  const [forecastPlanType, setForecastPlanType] = useState<"basico" | "tripletas" | "premium" | null>(null);
  const [accessKey, setAccessKey] = useState("");
  const [isKeyValid, setIsKeyValid] = useState<boolean | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<{title: string, price: string} | null>(null);

  // Subscription & Activation Logic
  const [planData, setPlanData] = useState<{
    basico: { days: number, lastAccess: string | null },
    tripletas: { days: number, lastAccess: string | null },
    premium: { days: number, lastAccess: string | null }
  }>(() => {
    const saved = localStorage.getItem("ganadores_vip_v2");
    if (saved) return JSON.parse(saved);
    // Initial state: 0 days, must activate
    return { 
      basico: { days: 0, lastAccess: null }, 
      tripletas: { days: 0, lastAccess: null }, 
      premium: { days: 0, lastAccess: null } 
    };
  });

  const savePlanData = (newData: typeof planData) => {
    setPlanData(newData);
    localStorage.setItem("ganadores_vip_v2", JSON.stringify(newData));
  };

  const handleActivatePlan = () => {
    if (!forecastPlanType) return;
    
    if (accessKey.trim() === PLAN_KEYS[forecastPlanType]) {
      const daysToGrant = forecastPlanType === 'premium' ? 34 : 19;
      const newData = {
        ...planData,
        [forecastPlanType]: {
          days: daysToGrant,
          lastAccess: new Date().toISOString().split('T')[0]
        }
      };
      savePlanData(newData);
      setIsKeyValid(true);
    } else {
      setIsKeyValid(false);
    }
  };

  const handleVerifyKey = () => {
    if (!forecastPlanType) return;
    
    const currentPlan = planData[forecastPlanType];
    
    if (accessKey.trim() === PLAN_KEYS[forecastPlanType]) {
      if (currentPlan.days > 0) {
        const today = new Date().toISOString().split('T')[0];
        if (currentPlan.lastAccess !== today) {
          // Decrement day if it's a new day
          const newData = {
            ...planData,
            [forecastPlanType]: {
              ...currentPlan,
              days: currentPlan.days - 1,
              lastAccess: today
            }
          };
          savePlanData(newData);
        }
        setIsKeyValid(true);
      } else {
        // Plan expired
        setIsKeyValid(false);
      }
    } else {
      setIsKeyValid(false);
    }
  };

  const AFFILIATE_URL = "https://juegaenlineaplay.com/t9rfyaewi";

  const PLAN_KEYS = {
    basico: "1234",
    tripletas: "5678",
    premium: "9421"
  };

  const resetForecast = () => {
    setShowForecastModal(false);
    setForecastPlanType(null);
    setAccessKey("");
    setIsKeyValid(null);
  };

  const openForecast = (type: "basico" | "tripletas" | "premium") => {
    setForecastPlanType(type);
    setShowForecastModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Modals */}
      <AnimatePresence>
        {showInternalBrowser && (
          <div className="fixed inset-0 z-[200] bg-white flex flex-col">
            <div className="bg-slate-900 text-white px-4 py-3 flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="text-sm font-bold tracking-tight">Juega en Línea</span>
              </div>
              <button 
                onClick={() => setShowInternalBrowser(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-grow relative bg-slate-100">
              <iframe 
                src={AFFILIATE_URL}
                className="w-full h-full border-none"
                title="Juega en Línea"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              />
            </div>
          </div>
        )}

        {selectedPlan && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[32px] p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">¡Excelente elección!</h3>
              <p className="text-slate-500 mb-6">
                Has seleccionado el <span className="font-bold text-slate-900">{selectedPlan.title}</span> por <span className="font-bold text-emerald-600">{selectedPlan.price} Bs</span>.
              </p>
              <div className="space-y-3">
                <a 
                  href="https://t.me/Trabajand0Ando" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-colors"
                >
                  Activar Plan
                </a>
                <button 
                  onClick={() => setSelectedPlan(null)}
                  className="block w-full py-4 text-slate-400 font-medium hover:text-slate-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showForecastModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={resetForecast}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {!isKeyValid ? (
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
                    forecastPlanType === 'basico' ? 'bg-emerald-100 text-emerald-600' :
                    forecastPlanType === 'tripletas' ? 'bg-blue-100 text-blue-600' :
                    'bg-amber-100 text-amber-600'
                  }`}>
                    <Lock className="w-8 h-8" />
                  </div>
                  
                  {planData[forecastPlanType!].days === 0 ? (
                    <>
                      <h3 className="text-2xl font-bold mb-2">Plan Caducado</h3>
                      <p className="text-slate-500 mb-6 px-4">
                        Tu suscripción ha terminado. Introduce tu nueva clave para <span className="font-bold text-slate-900">Activar tu Plan</span> y restaurar tus días.
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold mb-2">Acceso VIP</h3>
                      <p className="text-slate-500 mb-6">
                        Introduce tu clave para el <span className="font-bold text-slate-900 uppercase">
                          {forecastPlanType === 'basico' ? 'Plan Básico' : 
                          forecastPlanType === 'tripletas' ? 'Especial Tripletas' : 
                          'Premium VIP'}
                        </span>
                      </p>
                    </>
                  )}
                  
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Introduce tu clave..."
                      value={accessKey}
                      onChange={(e) => setAccessKey(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 outline-none transition-all text-center font-bold tracking-widest uppercase"
                    />
                    
                    {isKeyValid === false && (
                      <div className="flex flex-col gap-2 p-4 bg-red-50 rounded-2xl border border-red-100">
                        <div className="flex items-center gap-2 text-red-600 text-sm justify-center font-bold">
                          <AlertCircle className="w-4 h-4" />
                          <span>{planData[forecastPlanType!].days === 0 ? "Clave Caducada o Inválida" : "Clave Incorrecta"}</span>
                        </div>
                        <p className="text-[10px] text-red-500">
                          {planData[forecastPlanType!].days === 0 
                            ? "Tu plan ha expirado. Solicita una nueva clave de activación con soporte." 
                            : "Verifica tu clave o solicita acceso con @Trabajand0Ando"}
                        </p>
                      </div>
                    )}

                    {planData[forecastPlanType!].days === 0 ? (
                      <button 
                        onClick={handleActivatePlan}
                        className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95"
                      >
                        ACTIVAR PLAN
                      </button>
                    ) : (
                      <button 
                        onClick={handleVerifyKey}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors"
                      >
                        Entrar al Panel
                      </button>
                    )}
                    
                    <p className="text-xs text-slate-400">
                      ¿Necesitas ayuda? <a href="https://t.me/Trabajand0Ando" className="text-emerald-600 font-bold underline">Contacta a soporte</a>
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      forecastPlanType === 'basico' ? 'bg-emerald-100 text-emerald-600' :
                      forecastPlanType === 'tripletas' ? 'bg-blue-100 text-blue-600' :
                      'bg-amber-100 text-amber-600'
                    }`}>
                      <Unlock className="w-6 h-6" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold">
                        {forecastPlanType === 'basico' ? 'Pronóstico Básico' : 
                         forecastPlanType === 'tripletas' ? 'Especial Tripletas' : 
                         'Datos Premium VIP'}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500">Acceso VIP Activo</p>
                        <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="text-[10px] font-bold text-slate-600">{planData[forecastPlanType!].days} días restantes</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {planData[forecastPlanType!].days <= 4 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-amber-900">¡Aviso de Renovación!</p>
                        <p className="text-[10px] text-amber-700 leading-tight">
                          Recuerda renovar tu plan antes de que la clave caduque. Te quedan solo {planData[forecastPlanType!].days} días.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                    {/* Plan Básico */}
                    {forecastPlanType === 'basico' && (
                      <div className="space-y-4 text-slate-700">
                        <div className="bg-emerald-50 p-6 rounded-[24px] border border-emerald-100">
                          <p className="text-sm leading-relaxed mb-6 italic">
                            ¡Suscríbete ahora y forma parte de la comunidad de ganadores! No te arrepentirás de esta decisión. Queremos ofrecerte la oportunidad de acceder a valiosos datos de lotto activo y granjita que podrían aumentar tus posibilidades de éxito.
                          </p>
                          
                          <div className="text-center py-4 border-y border-emerald-200/50 mb-6">
                            <h4 className="font-black text-emerald-800 tracking-tight">🚨 PRONÓSTICO DEL DÍA 22/02/2026 🚨</h4>
                          </div>

                          <div className="space-y-4 mb-8">
                            <div className="flex flex-wrap justify-center gap-2 text-[10px] font-bold text-emerald-600 uppercase">
                              <span>Lotto Activo</span> • <span>Lotto Rey</span> • <span>La Granjita</span> • <span>Selvaplus</span>
                            </div>
                            
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100">
                              <div className="text-center text-xs font-bold text-slate-400 mb-3 tracking-widest uppercase">/———-⭐️————/</div>
                              <div className="text-center font-black text-slate-900 mb-4">9:00 AM / 2:00 PM</div>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center bg-emerald-50/50 px-4 py-2 rounded-xl">
                                  <span className="font-bold">✅ 15</span>
                                  <span className="font-black text-emerald-700">🦊 ZORRO</span>
                                </div>
                                <div className="flex justify-between items-center bg-emerald-50/50 px-4 py-2 rounded-xl">
                                  <span className="font-bold">✅ 10</span>
                                  <span className="font-black text-emerald-700">🐯 TIGRE</span>
                                </div>
                                <div className="flex justify-between items-center bg-emerald-50/50 px-4 py-2 rounded-xl">
                                  <span className="font-bold">✅ 28</span>
                                  <span className="font-black text-emerald-700">⬛️ ZAMURO</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100">
                              <div className="text-center font-black text-slate-900 mb-4">3:00 PM / 7:00 PM</div>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center bg-emerald-50/50 px-4 py-2 rounded-xl">
                                  <span className="font-bold">✅ 21</span>
                                  <span className="font-black text-emerald-700">🐓 GALLO</span>
                                </div>
                                <div className="flex justify-between items-center bg-emerald-50/50 px-4 py-2 rounded-xl">
                                  <span className="font-bold">✅ 12</span>
                                  <span className="font-black text-emerald-700">🐎 CABALLO</span>
                                </div>
                              </div>
                              <div className="text-center text-xs font-bold text-slate-400 mt-4 tracking-widest uppercase">/———-⭐️————/</div>
                            </div>
                          </div>

                          <div className="text-xs space-y-4 leading-relaxed text-slate-600">
                            <p>En nuestra comunidad, hemos seleccionado cuidadosamente estos datos basados en análisis y tendencias para brindarte una ventaja estratégica. Nuestro objetivo es ayudarte a tomar decisiones informadas.</p>
                            <p className="font-bold text-slate-800">¡MUCHA SUERTE EN TUS PRÓXIMOS JUEGOS Y MIL BENDICIONES!</p>
                            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-900 font-medium">
                              💡 Recuerda: si tienes éxito en los tres primeros sorteos, es recomendable no continuar jugando. Asegura tu victoria y disfruta tus ganancias.
                            </div>
                            <p>Suscríbete ahora y comienza a recibir nuestros datos confiables y efectivos. ¡Te esperamos!</p>
                            
                            <div className="pt-4">
                              <button 
                                onClick={() => {
                                  resetForecast();
                                  setShowInternalBrowser(true);
                                }}
                                className="flex items-center justify-center gap-2 w-full py-4 bg-amber-500 text-slate-900 rounded-2xl font-black text-sm hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                              >
                                <Zap className="w-5 h-5 fill-slate-900" />
                                JUEGA EN LÍNEA AQUÍ
                              </button>
                            </div>

                            <p className="font-bold text-slate-900 pt-4 border-t border-emerald-100">Atentamente,<br/>El Equipo de Ganadores VIP</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Especial Tripletas */}
                    {forecastPlanType === 'tripletas' && (
                      <div className="space-y-4 text-slate-700">
                        <div className="bg-blue-50 p-6 rounded-[24px] border border-blue-100">
                          <p className="text-sm leading-relaxed mb-6 italic">
                            ¡Suscríbete ahora y forma parte de la comunidad de ganadores! Queremos ofrecerte la oportunidad de acceder a valiosos datos de lotto activo y granjita que podrían aumentar tus posibilidades de éxito.
                          </p>
                          
                          <div className="text-center py-4 border-y border-blue-200/50 mb-6">
                            <h4 className="font-black text-blue-800 tracking-tight">🚨 PRONÓSTICO DEL DÍA 22/02/2026 🚨</h4>
                          </div>

                          <div className="space-y-4 mb-8">
                            <div className="flex flex-wrap justify-center gap-2 text-[10px] font-bold text-blue-600 uppercase">
                              <span>Lotto Activo</span> • <span>La Granjita</span> • <span>Selvaplus</span>
                            </div>
                            
                            {/* Tripleta 1 */}
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-100">
                              <div className="text-center text-xs font-bold text-blue-400 mb-3 tracking-widest uppercase">Tripleta 1 (Los Fijos)</div>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center bg-blue-50/50 px-4 py-2 rounded-xl">
                                  <span className="font-bold">✅ 15</span>
                                  <span className="font-black text-blue-700">🦊 ZORRO</span>
                                </div>
                                <div className="flex justify-between items-center bg-blue-50/50 px-4 py-2 rounded-xl">
                                  <span className="font-bold">✅ 10</span>
                                  <span className="font-black text-blue-700">🐯 TIGRE</span>
                                </div>
                                <div className="flex justify-between items-center bg-blue-50/50 px-4 py-2 rounded-xl">
                                  <span className="font-bold">✅ 28</span>
                                  <span className="font-black text-blue-700">⬛️ ZAMURO</span>
                                </div>
                              </div>
                            </div>

                            {/* Tripleta 2 */}
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-100">
                              <div className="text-center text-xs font-bold text-blue-400 mb-3 tracking-widest uppercase">Tripleta 2 (Mañaneros)</div>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center bg-blue-50/50 px-4 py-2 rounded-xl">
                                  <span className="font-bold">✅ 21</span>
                                  <span className="font-black text-blue-700">🐓 GALLO</span>
                                </div>
                                <div className="flex justify-between items-center bg-blue-50/50 px-4 py-2 rounded-xl">
                                  <span className="font-bold">✅ 12</span>
                                  <span className="font-black text-blue-700">🐎 CABALLO</span>
                                </div>
                                <div className="flex justify-between items-center bg-blue-50/50 px-4 py-2 rounded-xl">
                                  <span className="font-bold">✅ 03</span>
                                  <span className="font-black text-blue-700">🐛 CIEMPIÉS</span>
                                </div>
                              </div>
                            </div>

                            {/* Tripleta 3 */}
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-100">
                              <div className="text-center text-xs font-bold text-blue-400 mb-3 tracking-widest uppercase">Tripleta 3 (El Batacazo)</div>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center bg-blue-50/50 px-4 py-2 rounded-xl">
                                  <span className="font-bold">✅ 17</span>
                                  <span className="font-black text-blue-700">🦃 PAVO</span>
                                </div>
                                <div className="flex justify-between items-center bg-blue-50/50 px-4 py-2 rounded-xl">
                                  <span className="font-bold">✅ 8</span>
                                  <span className="font-black text-blue-700">🐭 RATÓN</span>
                                </div>
                                <div className="flex justify-between items-center bg-blue-50/50 px-4 py-2 rounded-xl">
                                  <span className="font-bold">✅ 27</span>
                                  <span className="font-black text-blue-700">🐶 PERRO</span>
                                </div>
                              </div>
                              <div className="text-center text-xs font-bold text-slate-400 mt-4 tracking-widest uppercase">/———-⭐️————/</div>
                            </div>
                          </div>

                          <div className="text-xs space-y-4 leading-relaxed text-slate-600 mb-8">
                            <p>En nuestra comunidad, hemos seleccionado cuidadosamente estos datos basados en análisis y tendencias para brindarte una ventaja estratégica. Nuestro objetivo es ayudarte a tomar decisiones informadas.</p>
                            <p className="font-bold text-slate-800">¡MUCHA SUERTE EN TUS PRÓXIMOS JUEGOS Y MIL BENDICIONES!</p>
                            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-900 font-medium">
                              💡 Recuerda: si tienes éxito en los tres primeros sorteos, es recomendable no continuar jugando.
                            </div>
                          </div>

                          {/* Promo Premium */}
                          <div className="bg-slate-900 p-6 rounded-3xl text-white text-center">
                            <h5 className="text-amber-400 font-black mb-2 uppercase tracking-tighter">🔥 ¿QUIERES GANAR TODOS LOS DÍAS? 🔥</h5>
                            <p className="text-xs text-slate-400 mb-4">Si estos datos te gustaron, el <span className="text-white font-bold">PLAN PREMIUM</span> te va a encantar.</p>
                            <ul className="text-left text-[10px] space-y-1 mb-6 max-w-[200px] mx-auto">
                              <li className="flex items-center gap-2">✅ Datos filtrados los 30 días.</li>
                              <li className="flex items-center gap-2">✅ Acceso al Grupo Privado VIP.</li>
                              <li className="flex items-center gap-2">✅ Estrategias para Tripletas.</li>
                              <li className="flex items-center gap-2">✅ Soporte directo WhatsApp.</li>
                            </ul>
                            <button 
                              onClick={() => {
                                resetForecast();
                                setSelectedPlan({ title: "Plan Premium V.I.P", price: "300" });
                              }}
                              className="w-full py-3 bg-amber-500 rounded-xl font-bold text-slate-900 text-sm active:scale-95 transition-transform mb-3"
                            >
                              ¡ASEGURA TU MES AQUÍ!
                            </button>
                            <button 
                              onClick={() => {
                                resetForecast();
                                setShowInternalBrowser(true);
                              }}
                              className="flex items-center justify-center gap-2 w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-sm active:scale-95 transition-transform"
                            >
                              JUEGA EN LÍNEA AQUÍ
                            </button>
                          </div>
                          
                          <p className="text-xs font-bold text-slate-900 pt-6 mt-6 border-t border-blue-100">Atentamente,<br/>El Equipo de Ganadores VIP</p>
                        </div>
                      </div>
                    )}

                    {/* Premium VIP */}
                    {forecastPlanType === 'premium' && (
                      <div className="space-y-6 text-slate-700">
                        <div className="bg-amber-50 p-6 rounded-[24px] border border-amber-100">
                          <div className="text-center py-4 border-b border-amber-200/50 mb-6">
                            <h4 className="font-black text-amber-800 tracking-tight uppercase">💎 PANEL PREMIUM VIP - 22/02/2026 💎</h4>
                            <p className="text-[10px] text-amber-600 font-bold mt-1">DATOS FILTRADOS DE ALTA PRECISIÓN</p>
                          </div>

                          {/* Animalitos VIP Section */}
                          <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
                              <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
                              Animalitos VIP
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              <div className="bg-white p-4 rounded-2xl shadow-sm border border-amber-100">
                                <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase">Mañana (9:00 AM - 2:00 PM)</div>
                                <div className="grid grid-cols-3 gap-2">
                                  {[
                                    { n: "15", a: "🦊 ZORRO" },
                                    { n: "10", a: "🐯 TIGRE" },
                                    { n: "28", a: "⬛️ ZAMURO" }
                                  ].map((item, i) => (
                                    <div key={i} className="bg-amber-50/50 p-2 rounded-xl text-center border border-amber-100/50">
                                      <div className="text-xs font-bold text-slate-500">{item.n}</div>
                                      <div className="text-[10px] font-black text-amber-700">{item.a.split(' ')[1]}</div>
                                      <div className="text-lg">{item.a.split(' ')[0]}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="bg-white p-4 rounded-2xl shadow-sm border border-amber-100">
                                <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase">Tarde (3:00 PM - 7:00 PM)</div>
                                <div className="grid grid-cols-2 gap-2">
                                  {[
                                    { n: "21", a: "🐓 GALLO" },
                                    { n: "12", a: "🐎 CABALLO" }
                                  ].map((item, i) => (
                                    <div key={i} className="bg-amber-50/50 p-2 rounded-xl text-center border border-amber-100/50 flex items-center justify-around">
                                      <div className="text-lg">{item.a.split(' ')[0]}</div>
                                      <div className="text-left">
                                        <div className="text-xs font-bold text-slate-500">{item.n}</div>
                                        <div className="text-[10px] font-black text-amber-700">{item.a.split(' ')[1]}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Ruletas Recomendadas Section */}
                          <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
                              <TrendingUp className="w-4 h-4 text-amber-500" />
                              Ruletas Recomendadas
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-amber-100">
                              <div className="grid grid-cols-2 gap-3">
                                {[
                                  { name: "Lotto Activo", icon: "🔥" },
                                  { name: "Lotto Rey", icon: "👑" },
                                  { name: "La Granjita", icon: "🍀" },
                                  { name: "Selvaplus", icon: "🐾" }
                                ].map((r, i) => (
                                  <div key={i} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <span className="text-lg">{r.icon}</span>
                                    <span className="text-xs font-bold text-slate-700">{r.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="bg-slate-900 p-5 rounded-2xl text-white">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Efectividad</span>
                              <span className="text-xs font-bold text-emerald-400">MÁXIMA</span>
                            </div>
                            <p className="text-sm leading-relaxed">
                              Datos filtrados con <span className="text-emerald-400 font-bold">95% de probabilidad</span> en las ruletas indicadas.
                            </p>
                          </div>

                          <div className="mt-8 pt-6 border-t border-amber-200/50 text-[10px] text-slate-500 leading-relaxed">
                            <p className="mb-4">Estos datos han sido filtrados mediante nuestro algoritmo de tendencias y análisis de sorteos previos.</p>
                            
                            <button 
                              onClick={() => {
                                resetForecast();
                                setShowInternalBrowser(true);
                              }}
                              className="flex items-center justify-center gap-2 w-full py-4 bg-amber-500 text-slate-900 rounded-2xl font-black text-sm hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 active:scale-95 mb-4"
                            >
                              <Zap className="w-5 h-5 fill-slate-900" />
                              JUEGA EN LÍNEA AQUÍ
                            </button>

                            <p className="font-bold text-slate-900 italic">"La disciplina en el juego es la clave del éxito."</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-slate-900 p-5 rounded-2xl text-white">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Efectividad</span>
                        <span className="text-xs font-bold text-emerald-400">ALTA</span>
                      </div>
                      <p className="text-sm leading-relaxed">
                        Probabilidades de <span className="text-emerald-400 font-bold">3 a 4 aciertos</span> de lunes a viernes.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header className="relative overflow-hidden bg-slate-900 text-white pt-16 pb-24 px-6">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500 rounded-full blur-[100px]" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border border-white/20">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>FAMILIA DE GANADORES</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
            Aumenta tus posibilidades de <span className="text-emerald-400">GANAR</span>
          </h1>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            Pronósticos exclusivos y estrategias probadas para maximizar tus oportunidades en las loterías más populares.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => {
                const el = document.getElementById('pronosticos');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl transition-all active:scale-95"
            >
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
              Área de Pronósticos
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('planes');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              Ver Planes VIP <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </header>

      {/* Promo Banner */}
      <section className="px-6 -mt-8 relative z-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full -ml-16 -mb-16 blur-2xl" />
          
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-[24px] flex items-center justify-center shrink-0 animate-bounce">
              <Gift className="w-10 h-10 text-emerald-600" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold mb-3 flex items-center justify-center md:justify-start gap-2">
                ¡Bienvenido/a a nuestra comunidad! 👋
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                ¡Grandes noticias! 🎉 Al unirte a cualquiera de nuestros planes, disfrutarás de <span className="text-emerald-600 font-bold">4 días totalmente GRATIS</span> 🤑. 
                ¡Y ojo! 👀 Los fines de semana (sábados y domingos) <span className="font-bold text-slate-900 underline decoration-amber-400 decoration-2">no los contamos</span>, ¡así aprovechas al máximo! 🚀
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-slate-700">Bonificación por Renovación ✨</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                  <MessageCircle className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold text-slate-700">Soporte 24/7 🤔💬</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Plans Section */}
      <section id="planes" className="px-6 mt-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PlanCard 
            title="Plan Básico"
            price="150"
            duration="15 Días"
            color="emerald"
            onSelect={() => setSelectedPlan({ title: "Plan Básico", price: "150" })}
            features={[
              "5 pronósticos diarios (animalitos)",
              "Horarios: 9:00 AM - 2:00 PM y 3:00 PM - 7:00 PM",
              "Una jugada al día con alta probabilidad",
              "¡Primer día GRATIS para nuevos afiliados!"
            ]}
          />
          <PlanCard 
            title="Especial Tripletas"
            price="200"
            duration="15 Días"
            color="blue"
            highlight={true}
            onSelect={() => setSelectedPlan({ title: "Plan Especial Tripletas", price: "200" })}
            features={[
              "3 pronósticos en tendencia",
              "Lotto Activo, Lotto Rey, La Granjita",
              "Máxima precisión en jugadas",
              "Ideal para buscadores de exactitud"
            ]}
          />
          <PlanCard 
            title="Premium V.I.P"
            price="300"
            duration="30 Días"
            color="amber"
            onSelect={() => setSelectedPlan({ title: "Plan Premium V.I.P", price: "300" })}
            features={[
              "5 pronósticos diarios estratégicos",
              "Datos filtrados y exclusivos",
              "3 pronósticos en tendencia (Lotto Activo, Rey, Granjita)",
              "Máxima rentabilidad mensual"
            ]}
          />
        </div>
      </section>

      {/* Forecast Area Section */}
      <section id="pronosticos" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Área de Pronósticos VIP</h2>
          <p className="text-slate-500">Selecciona tu plan para ver los resultados de hoy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: 'basico', title: 'Plan Básico', icon: Clock, color: 'emerald', desc: 'Animalitos Mañana y Tarde' },
            { id: 'tripletas', title: 'Especial Tripletas', icon: TrendingUp, color: 'blue', desc: 'Lotto Activo, Rey y Granjita' },
            { id: 'premium', title: 'Premium VIP', icon: Star, color: 'amber', desc: 'Datos Filtrados Exclusivos' }
          ].map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openForecast(item.id as any)}
              className={`p-8 rounded-[32px] border-2 text-left transition-all shadow-sm flex flex-col items-start gap-4 ${
                item.color === 'emerald' ? 'bg-emerald-50 border-emerald-100 hover:border-emerald-200' :
                item.color === 'blue' ? 'bg-blue-50 border-blue-100 hover:border-blue-200' :
                'bg-amber-50 border-amber-100 hover:border-amber-200'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                item.color === 'emerald' ? 'bg-emerald-500 text-white' :
                item.color === 'blue' ? 'bg-blue-500 text-white' :
                'bg-amber-500 text-white'
              }`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{item.desc}</p>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                  <span className={
                    item.color === 'emerald' ? 'text-emerald-600' :
                    item.color === 'blue' ? 'text-blue-600' :
                    'text-amber-600'
                  }>Ver Pronóstico</span>
                  <ArrowRight className={`w-4 h-4 ${
                    item.color === 'emerald' ? 'text-emerald-600' :
                    item.color === 'blue' ? 'text-blue-600' :
                    'text-amber-600'
                  }`} />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Beneficios Exclusivos</h2>
          <p className="text-slate-500">Lo que obtienes al unirte a nuestra comunidad</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Gift, title: "Regalos Sorpresa", desc: "Para nuestros afiliados más fieles" },
            { icon: Zap, title: "Alta Probabilidad", desc: "3 a 4 días de acierto semanal" },
            { icon: ShieldCheck, title: "Soporte VIP", desc: "Atención personalizada 24/7" },
            { icon: TrendingUp, title: "Descuentos", desc: "Precios especiales en renovaciones" }
          ].map((benefit, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm text-center"
            >
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-6 h-6 text-slate-900" />
              </div>
              <h3 className="font-bold mb-2">{benefit.title}</h3>
              <p className="text-sm text-slate-500">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How to Affiliate */}
      <section className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">¿Cómo Afiliarte?</h2>
            <p className="text-slate-400">Sigue estos simples pasos para empezar a ganar</p>
          </div>
          
          <div className="space-y-8">
            {[
              { step: "01", title: "Elige tu Plan", desc: "Selecciona el que mejor se adapte a tus necesidades." },
              { step: "02", title: "Solicita Datos", desc: "Escríbenos para recibir la información de pago." },
              { step: "03", title: "Envía Comprobante", desc: "Mándanos el capture y tu número de teléfono." },
              { step: "04", title: "¡Empieza a Ganar!", desc: "Recibe tus pronósticos y únete a la familia." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex gap-6 items-start"
              >
                <div className="text-4xl font-black text-white/10 select-none">{item.step}</div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-slate-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-12">¿Por qué elegirnos?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                <TrendingUp className="w-7 h-7 text-emerald-600" />
              </div>
              <h4 className="font-bold mb-2">Resultados Comprobados</h4>
              <p className="text-sm text-slate-500">Nuestros afiliados experimentan ganancias reales constantemente.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-7 h-7 text-blue-600" />
              </div>
              <h4 className="font-bold mb-2">Transparencia Total</h4>
              <p className="text-sm text-slate-500">Información clara, precisa y sin letras pequeñas.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-purple-600" />
              </div>
              <h4 className="font-bold mb-2">Atención Personalizada</h4>
              <p className="text-sm text-slate-500">Estamos contigo en cada paso del camino para resolver tus dudas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-emerald-600 rounded-[40px] p-12 text-center text-white shadow-2xl shadow-emerald-600/20"
        >
          <h2 className="text-3xl font-bold mb-4">¡No pierdas esta oportunidad!</h2>
          <p className="text-emerald-50 mb-8 max-w-md mx-auto">
            El éxito está a solo un paso. Afíliate hoy mismo y comienza a ganar con nosotros.
          </p>
          <button className="bg-white text-emerald-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-colors flex items-center gap-2 mx-auto">
            <MessageCircle className="w-6 h-6" />
            Escríbenos Ahora
          </button>
        </motion.div>
      </section>

      {/* Footer / Bottom Nav for TMA */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-lg border-t border-slate-100 px-6 py-4 flex justify-around items-center z-50">
        <button 
          onClick={() => setShowForecastModal(true)}
          className={`flex flex-col items-center gap-1 transition-colors ${showForecastModal ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-600'}`}
        >
          <Zap className="w-6 h-6" />
          <span className="text-[10px] font-medium">Pronósticos</span>
        </button>
        <button 
          onClick={() => {
            setShowForecastModal(false);
            const el = document.getElementById('planes');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-emerald-600"
        >
          <Star className="w-6 h-6" />
          <span className="text-[10px] font-medium">Planes</span>
        </button>
        <button 
          onClick={() => {
            setShowForecastModal(false);
            setShowInternalBrowser(true);
          }}
          className="flex flex-col items-center gap-1 text-amber-600 animate-pulse"
        >
          <Zap className="w-6 h-6 fill-amber-600" />
          <span className="text-[10px] font-black uppercase">Jugar</span>
        </button>
        <a 
          href="https://t.me/Trabajand0Ando"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-emerald-600 transition-colors"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-[10px] font-medium">Contacto</span>
        </a>
      </footer>
    </div>
  );
}
