import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Truck, 
  Phone, 
  CheckCircle, 
  X, 
  ShoppingBag,
  Package,
  ShieldCheck,
  TimerReset,
  Leaf,
  ChevronLeft,
  ChevronRight,
  Zap,
  Maximize2,
  Coffee,
} from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp, FaFacebookMessenger, FaEnvelope } from 'react-icons/fa6';
import ReactCountryFlag from 'react-country-flag';

const ORDER_API_URL = import.meta.env.VITE_ORDER_API_URL || '/.netlify/functions/order-notify';
const LEGACY_SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL || '';

const ASSETS = {
  logo: '/images/logo-1.png',
  bbqPetit: '/images/bbq-petit-2.png',
  bbqGrand: '/images/bbq-grand-3.png',
  rechaudBois: '/images/rechaud4.png',
  hero: '/images/hero-5.png',
  whyBg: '/images/bg2.jpg',
  yalidineLogo: '/images/yalidine-logo.png',
  bbqDetailBackground: '/images/bbq_grand2.png',
  rechaudDetailImage: '/images/rechaud3.webp',
  rechaudDetailCarousel: ['/images/rechaud2.png', '/images/rechaud4.png', '/images/rechaud5.png'],
  bbqDetailVideoWebm: '/images/outputvid.webm',
  bbqDetailVideo: '/images/outputvid.mov',
  rechaudDetailVideo: '/images/file.mp4'
};

const WILAYAS = [
  "01 - Adrar", "02 - Chlef", "03 - Laghouat", "04 - Oum El Bouaghi", "05 - Batna", 
  "06 - Béjaïa", "07 - Biskra", "08 - Béchar", "09 - Blida", "10 - Bouira", 
  "11 - Tamanrasset", "12 - Tébessa", "13 - Tlemcen", "14 - Tiaret", "15 - Tizi Ouzou", 
  "16 - Alger", "17 - Djelfa", "18 - Jijel", "19 - Sétif", "20 - Saïda", 
  "21 - Skikda", "22 - Sidi Bel Abbès", "23 - Annaba", "24 - Guelma", "25 - Constantine", 
  "26 - Médéa", "27 - Mostaganem", "28 - M'Sila", "29 - Mascara", "30 - Ouargla", 
  "31 - Oran", "32 - El Bayadh", "33 - Illizi", "34 - Bordj Bou Arreridj", "35 - Boumerdès", 
  "36 - El Tarf", "37 - Tindouf", "38 - Tissemsilt", "39 - El Oued", "40 - Khenchela", 
  "41 - Souk Ahras", "42 - Tipaza", "43 - Mila", "44 - Aïn Defla", "45 - Naâma", 
  "46 - Aïn Témouchent", "47 - Ghardaïa", "48 - Relizane", "49 - El M'Ghair", 
  "50 - El Meniaa", "51 - Ouled Djellal", "52 - Bordj Baji Mokhtar", "53 - Béni Abbès", 
  "54 - Timimoun", "55 - Touggourt", "56 - Djanet", "57 - In Salah", "58 - In Guezzam"
];

const TRANSLATIONS = {
  fr: {
    dir: 'ltr',
    nav_products: 'Nos Produits',
    nav_contact: 'Contact',
    hero_badge: 'Livraison 58 Wilayas via Yalidine',
    hero_title_1: 'Vivez l\'Aventure avec',
    hero_title_2: 'The Great Outdoors',
    hero_desc: 'Barbecues et Réchauds à Bois Démontables, légers et robustes.\nVotre compagnon idéal pour la forêt, la plage ou le camping.',
    cta_hero: 'Commander Maintenant',
    banner_delivery: 'Livraison partout en Algérie',
    banner_payment: 'Paiement à la livraison',
    banner_quality: 'Qualité Garantie',
    section_title: 'Nos meilleures ventes',
    section_desc: 'Choisissez votre équipement et commencez votre prochaine aventure',
    details_title: 'Plus d\'infos sur nos équipements',
    details_desc: 'Découvrez chaque produit en image et en vidéo avant de passer commande.',
    bbq_detail_title: 'Barbecue Démontable Pratique et Robuste',
    bbq_detail_desc: 'Notre barbecue démontable est pensé pour vos sorties:\nMontage ⛰️ Forêt 🌳 Plage 🏖️ ou Camping 🏕️.\nRapide, structure stable et format facile à transporter. Il offre une cuisson régulière et un entretien simple.',
    rechaud_detail_title: 'Réchaud à Bois Compact et Polyvalent',
    rechaud_detail_desc: 'Le Réchaud à Bois, compagnon idéal en Van 🚐, en Forêt 🌳, en Montage ⛰️ ou au Désert 🏜️, vous permet de faire bouillir de l\'eau, préparer un café ou cuisiner facilement en extérieur.\nSon design optimise la circulation de \'air pour une combustion efficace.',
    features: ['Montage simple et rapide', 'Format compact', 'Structure stable', 'Nettoyage facile'],
    rechaud_features: ['Montage simple et rapide', '6 pièces uniquement', 'Idéal pour café et thé'],
    video_label: 'Vidéo de démonstration',
    order_btn: 'Acheter',
    why_title: 'Pourquoi choisir nos produits ?',
    why_1: 'Démontable : Gagnez de la place partout.',
    why_2: 'Résistant : Conçu pour durer, même face à la chaleur.',
    why_3: 'Nettoyage facile : Pensé pour votre confort.',
    why_4: 'Livraison rapide : Partout en Algérie via Yalidine Express.',
    why_cta: 'Voir les produits',
    footer_desc: '📍 Basés au Eucalyptus, Alger.\nLivraison vers toutes les wilayas d\'Algérie ',
    footer_social: 'Suivez-nous',
    footer_phone: 'Commander par téléphone',
    modal_title: 'Confirmer la commande',
    form_name: 'Nom Complet *',
    form_phone: 'Numéro de Téléphone *',
    form_wilaya: 'Wilaya *',
    form_qty: 'Quantité',
    form_product: 'Produit *',
    form_total: 'Total',
    form_submit: 'Confirmer ma commande',
    success_title: 'Commande envoyée !',
    success_desc: 'Merci pour votre confiance. Notre équipe vous contactera sous peu pour confirmer l\'expédition.',
    success_btn: 'Fermer',
    lang_btn: 'العربية'
  },
  ar: {
    dir: 'rtl',
    nav_products: 'منتجاتنا',
    nav_contact: 'اتصل بنا',
    hero_badge: 'توصيل متوفر لـ 58 ولاية عبر Yalidine',
    hero_title_1: 'عيش المغامرة مع',
    hero_title_2: 'The Great Outdoors',
    hero_desc: 'شوايات وريشو حطب ديمونطابل، خفاف وما يصددوش.\nرفيقك المثالي في الغابة، البحر، ولا الكامبينغ.',
    cta_hero: 'اطلب الآن',
    banner_delivery: 'التوصيل لكل الولايات',
    banner_payment: 'الدفع عند الاستلام',
    banner_quality: 'جودة مضمونة',
    section_title: 'منتجاتنا الأكثر طلباً',
    section_desc: 'اختر عتادك وابدأ مغامرتك القادمة',
    details_title: 'معلومات أكثر على منتجاتنا',
    details_desc: 'شوف كل منتج بالصور والفيديو قبل ما تدير الطلبية.',
    bbq_detail_title: 'شواية ديمونطابل\nعملية وقوية',
    bbq_detail_desc: 'شوايتنا الديمونطابل مصممة لخرجاتك:\nتركيب سريع ⛰️ غابة 🌳 بحر 🏖️ كامبينغ 🏕️.\nسهلة التركيب، ثابتة، وسهلة الحمل. توفر طياب منتظم وتنظيف سهل.',
    rechaud_detail_title: 'ريشو حطب\nصغير وفعال',
    rechaud_detail_desc: 'رفيق الخرجات في السيارة 🚐 الغابة 🌳 الجبل ⛰️ أو الصحراء 🏜️.\nيغلي الماء ويحضر القهوة أو يطيّب الماكلة، وتصميمه يسمح بمرور الهواء بشكل ممتاز.' ,
    features: ['تركيب سريع', 'حجم صغير', 'هيكل ثابت', 'تنظيف سهل'],
    rechaud_features: ['تركيب سريع', 'قطع فقط', 'مثالي للقهوة والشاي'],
    video_label: 'فيديو توضيحي',
    order_btn: 'أطلب الآن',
    why_title: 'علاش تخير منتجاتنا؟',
    why_1: 'ديمونطابل: ما يديش بلاصة فـ sac ولا الطوموبيل.',
    why_2: 'ما يصددش: حديد عالي الجودة ومقاوم.',
    why_3: 'سهل التنظيف: تصميم مدروس يسهل عليك المهمة.',
    why_4: 'توصيل سريع: نبعثولك مع Yalidine حتى لدارك.',
    why_cta: 'شاهد المنتجات',
    footer_desc: '📍 مقرنا في الكاليتوس، الجزائر العاصمة.\nتوصيل لكل ولايات الجزائر ',
    footer_social: 'تابعونا على',
    footer_phone: 'للطلب عبر الهاتف',
    modal_title: 'تأكيد الطلبية',
    form_name: 'الاسم الكامل *',
    form_phone: 'رقم الهاتف *',
    form_wilaya: 'الولاية *',
    form_qty: 'الكمية',
    form_product: 'المنتج *',
    form_total: 'المجموع',
    form_submit: 'أكد طلبي الآن',
    success_title: 'تم إرسال طلبك بنجاح!',
    success_desc: 'شكراً على ثقتك. سيتصل بك فريقنا في أقرب وقت لتأكيد الطلب وبدء عملية التوصيل.',
    success_btn: 'حسناً',
    lang_btn: 'Français'
  }
};

const PRODUCTS = [
  {
    id: 'bbq-petit',
    name: { fr: 'Barbecue Démontable (Petit)', ar: 'شواية ديمونطابل (صغيرة)' },
    price: 3000,
    size: '30×20 cm',
    description: { 
      fr: 'Pratique, léger, se range dans un petit sac.\nIdéal pour toutes vos sorties en forêt, plage ou camping.', 
      ar: 'شواية عملية وتتتفكّك، خفيفة وتقدر تدخلها في صاك صغير. مثالية للخرجات للغابة، الجبل أو لبحر.' 
    },
    images: [
      ASSETS.bbqPetit,
      '/images/bbq_petit3.png',
      '/images/bbq_petit2.webp'
    ]
  },
  {
    id: 'bbq-grand',
    name: { fr: 'Barbecue Démontable (Grand)', ar: 'شواية ديمونطابل (كبيرة)' },
    price: 4000,
    size: '50×30 cm',
    description: { 
      fr: 'Plus de surface, stable et robuste pour les passionnés de grillades.', 
      ar: 'مساحة شواء أكبر، ثابتة وقوية لمحبي الشواء.\nسهلة التنظيف ومصممة لتدوم.' 
    },
    images: [
      ASSETS.bbqGrand,
      '/images/bbq_grand2.png',
      '/images/bbq_grand3.png'
    ]
  },
  {
    id: 'rechaud-bois',
    name: { fr: 'Réchaud à Bois Démontable', ar: 'ريشو تع حطب ديمونطابل' },
    price: 3600,
    size: 'En stock',
    description: { 
      fr: 'Compagnon en Van, forêt, montagne ou au désert. Fait bouillir de l\'eau, préparer un café ou cuisiner a manger. Avec un flux d\'air optimisé.', 
      ar: 'رفيق الخرجات في السيارة، الغابة، الجبل أو الصحراء.\nيغلي الماء ويحضر القهوة أو يطيّب الماكلة، وتصميمه يسمح بمرور الهواء بشكل ممتاز.' 
    },
    images: [
      ASSETS.rechaudBois,
      '/images/rechaud2.png',
      '/images/rechaud3.png'
    ]
  }
];

export default function App() {
  const [lang, setLang] = useState('fr');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [allowBbqChoice, setAllowBbqChoice] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [productImageIndexes, setProductImageIndexes] = useState({});
  const [rechaudPosterIndex, setRechaudPosterIndex] = useState(0);
  const [isWhyInView, setIsWhyInView] = useState(false);
  const whySectionRef = useRef(null);

  const t = TRANSLATIONS[lang];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    wilaya: '16 - Alger',
    quantity: 1
  });

  useEffect(() => {
    setProductImageIndexes(PRODUCTS.reduce((acc, product) => {
      acc[product.id] = 0;
      return acc;
    }, {}));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProductImageIndexes(prev => {
        const next = { ...prev };
        PRODUCTS.forEach(product => {
          const imagesLength = product.images?.length || 1;
          next[product.id] = ((prev[product.id] || 0) + 1) % imagesLength;
        });
        return next;
      });
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const section = whySectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsWhyInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const postersCount = ASSETS.rechaudDetailCarousel.length;
    if (!postersCount) return undefined;

    const timer = setInterval(() => {
      setRechaudPosterIndex(prev => (prev + 1) % postersCount);
    }, 3200);

    return () => clearInterval(timer);
  }, []);

  const toggleLang = () => setLang(prev => prev === 'fr' ? 'ar' : 'fr');

  const resolveProductImage = (product) => {
    const images = product?.images || [];
    if (!images.length) return '';
    return images[(productImageIndexes[product.id] || 0) % images.length];
  };

  const handleProductImageError = (productId) => {
    setProductImageIndexes(prev => {
      const product = PRODUCTS.find(p => p.id === productId);
      const imagesLength = product?.images?.length || 1;
      return {
        ...prev,
        [productId]: ((prev[productId] || 0) + 1) % imagesLength
      };
    });
  };

  const rechaudCurrentPoster = ASSETS.rechaudDetailCarousel[
    rechaudPosterIndex % ASSETS.rechaudDetailCarousel.length
  ];

  const goToPrevRechaudPoster = () => {
    setRechaudPosterIndex(prev => (prev - 1 + ASSETS.rechaudDetailCarousel.length) % ASSETS.rechaudDetailCarousel.length);
  };

  const goToNextRechaudPoster = () => {
    setRechaudPosterIndex(prev => (prev + 1) % ASSETS.rechaudDetailCarousel.length);
  };

  const handleRechaudPosterError = () => {
    goToNextRechaudPoster();
  };

  const renderTextWithYalidineLogo = (text) => {
    const marker = 'Yalidine';
    if (!text?.includes(marker)) return text;
    const [before, after] = text.split(marker);
    return (
      <>
        {before}
        <span className="inline-flex items-center gap-1 align-middle">
          <span>{marker}</span>
          <img src={ASSETS.yalidineLogo} alt="Yalidine" className="h-8 w-auto" />
        </span>
        {after}
      </>
    );
  };

  const renderWhyText = (text) => {
    const parts = text.split(':');
    if (parts.length < 2) return renderTextWithYalidineLogo(text);
    const keyword = parts[0].trim();
    const description = parts.slice(1).join(':').trim();

    return (
      <>
        <span className="text-orange-300">{keyword}:</span>{' '}
        {renderTextWithYalidineLogo(description)}
      </>
    );
  };

  const orderTotal = (selectedProduct?.price || 0) * Number(formData.quantity || 0);

  const whyPoints = [
    { icon: Package, text: t.why_1, tone: 'bg-orange-500/20 text-orange-300 border border-orange-400/30' },
    { icon: ShieldCheck, text: t.why_2, tone: 'bg-amber-500/20 text-amber-300 border border-amber-400/30' },
    { icon: TimerReset, text: t.why_3, tone: 'bg-orange-400/20 text-orange-200 border border-orange-300/30' },
    { icon: Truck, text: t.why_4, tone: 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' },
  ];

  const openOrderModal = (product, options = {}) => {
    setAllowBbqChoice(Boolean(options.allowBbqChoice));
    setSelectedProduct(product);
    setIsModalOpen(true);
    setIsSuccess(false);
  };

  const closeOrderModal = () => {
    setIsModalOpen(false);
    setAllowBbqChoice(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone || formData.phone.length < 9) {
      alert(lang === 'fr' ? "Veuillez entrer un numéro valide" : "يرجى إدخال رقم هاتف صحيح.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      ...formData,
      product: selectedProduct.name.fr,
      productAr: selectedProduct.name.ar,
      total: orderTotal,
      date: new Date().toLocaleString(),
      status: 'pending'
    };

    try {
      let response = await fetch(ORDER_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Local Vite or static-only deployments may not expose Netlify Functions.
      if (response.status === 404 && LEGACY_SCRIPT_URL) {
        response = await fetch(LEGACY_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        throw new Error('order-notify failed');
      }

      setIsSuccess(true);
      setFormData({ name: '', phone: '', wilaya: '16 - Alger', quantity: 1 });
    } catch (error) {
      alert("Error / خطأ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-neutral-50 font-sans text-neutral-900 overflow-x-hidden ${lang === 'ar' ? 'lang-ar' : ''}`}>
      {/* Navigation */}
      <nav className="fixed w-full z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <img src={ASSETS.logo} alt="Logo" className="h-18 md:h-20 w-auto rounded" />
             <span className="hidden sm:block font-black text-lg tracking-tighter">THE GREAT OUTDOORS</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLang}
              className="flex items-center gap-1 bg-neutral-100 px-3 py-1.5 rounded-lg font-bold text-sm hover:bg-neutral-200 transition-all"
            >
              {lang === 'fr' ? (
                <ReactCountryFlag
                  countryCode="DZ"
                  svg
                  aria-label="Algeria"
                  style={{ width: '1.25rem', height: '0.875rem', borderRadius: '2px' }}
                />
              ) : (
                <ReactCountryFlag
                  countryCode="FR"
                  svg
                  aria-label="France"
                  style={{ width: '1.25rem', height: '0.875rem', borderRadius: '2px' }}
                />
              )}
              {t.lang_btn}
            </button>
            <a href="tel:0797350430" className="bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-xs sm:text-sm">
              <Phone className="w-4 h-4" />
              0797.35.04.30
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header
        className="relative pt-32 pb-20 px-4 text-center text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(9, 9, 11, 0.66), rgba(9, 9, 11, 0.66)), url(${ASSETS.hero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-orange-500/20 to-transparent"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold mb-6 border border-white/20">
            <Truck className="w-4 h-4 text-orange-400" /> 
            <span>{renderTextWithYalidineLogo(t.hero_badge)}</span>
          </div>
          <h1 className="title-font text-4xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
            {t.hero_title_1} <br />
            <span className="text-orange-500 italic drop-shadow-sm">{t.hero_title_2}</span>
          </h1>
          <p
            className="text-lg text-neutral-300 mb-10 max-w-2xl mx-auto font-medium whitespace-pre-line text-center"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
            style={lang === 'ar' ? { unicodeBidi: 'plaintext' } : undefined}
          >
            {t.hero_desc}
          </p>
          <button 
            onClick={() => document.getElementById('produits').scrollIntoView({ behavior: 'smooth' })}
            className="why-cta px-10 py-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-black text-xl shadow-[0_12px_30px_rgba(234,88,12,0.4)] hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-105 active:scale-95"
          >
            {t.cta_hero}
          </button>
        </div>
      </header>

      {/* Delivery Banner */}
      <div className="bg-white border-y border-neutral-100 py-5">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-12 text-neutral-500 font-bold text-sm">
           <span className="flex items-center gap-2"><Truck className="text-orange-600 w-5 h-5"/> {t.banner_delivery}
           <ReactCountryFlag
              countryCode="DZ"
              svg
              aria-label="Algeria"
              style={{ width: '1.25rem', height: '0.875rem', borderRadius: '2px' }}
            /></span>
           <span className="hidden sm:inline text-neutral-200">|</span>
           <span className="flex items-center gap-2"><ShoppingBag className="text-orange-600 w-5 h-5"/> {t.banner_payment}</span>
           <span className="hidden sm:inline text-neutral-200">|</span>
           <span className="flex items-center gap-2"><CheckCircle className="text-orange-600 w-5 h-5"/> {t.banner_quality}</span>
        </div>
      </div>

      {/* Products Grid */}
      <section id="produits" className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="title-font text-4xl font-black mb-4">{t.section_title}</h2>
          <p className="text-neutral-500 font-medium">{t.section_desc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="group bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-neutral-200/50 border border-neutral-100 flex flex-col transition-all hover:-translate-y-2">
              <div className="h-72 bg-neutral-100 relative overflow-hidden">
                <div className="absolute top-4 right-4 z-10 bg-orange-600 text-white px-4 py-1.5 rounded-full font-black shadow-lg">
                  {product.price} DA
                </div>
                <img 
                  key={`${product.id}-${productImageIndexes[product.id] || 0}`}
                  src={resolveProductImage(product)} 
                  alt={product.name[lang]} 
                  onError={() => handleProductImageError(product.id)}
                  className="carousel-fade-image w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className={`p-8 flex-grow flex flex-col ${lang === 'ar' ? 'text-right' : ''}`}>
                <h3 className={`text-2xl font-black mb-1 ${lang === 'ar' ? 'text-right' : ''}`}>{product.name[lang]}</h3>
                <span className={`text-orange-600 font-black text-lg mb-4 block ${lang === 'ar' ? 'text-right' : ''}`}>{product.size}</span>
                <p
                  className={`text-neutral-500 text-sm leading-relaxed mb-8 flex-grow font-medium whitespace-pre-line ${lang === 'ar' ? 'text-right' : ''}`}
                  dir={lang === 'ar' ? 'rtl' : 'ltr'}
                  style={lang === 'ar' ? { unicodeBidi: 'plaintext' } : undefined}
                >
                  {product.description[lang]}
                </p>
                <button 
                  onClick={() => openOrderModal(product)}
                  className="w-full py-4 bg-zinc-950 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors shadow-lg active:scale-95"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {t.order_btn}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Details Section */}
      <section
        className="relative overflow-hidden text-white py-20 px-6 border-b border-white/5"
        style={{
          backgroundImage: `linear-gradient(rgba(10, 10, 10, 0.66), rgba(10, 10, 10, 0.66)), url(${ASSETS.bbqDetailBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-orange-500/8 pointer-events-none" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-1 lg:order-1 space-y-6">
            <h2 className={`title-font text-3xl sm:text-4xl md:text-6xl font-black leading-tight uppercase whitespace-pre-line ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.bbq_detail_title}</h2>
            <div className="lg:hidden relative w-full max-w-[460px] mx-auto rounded-2xl overflow-hidden shadow-xl border border-white/5 bg-black/20">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster={ASSETS.bbqDetailBackground}
                className="w-full h-full min-h-[12rem] sm:min-h-[16rem] object-cover object-left"
              >
                <source src={ASSETS.bbqDetailVideoWebm} type="video/webm" />
                <source src={ASSETS.bbqDetailVideo} type="video/quicktime" />
              </video>
            </div>
            <p
              className={`text-lg text-neutral-400 font-medium leading-relaxed whitespace-pre-line ${lang === 'ar' ? 'text-right' : 'text-left'}`}
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              style={lang === 'ar' ? { unicodeBidi: 'plaintext' } : undefined}
            >
              {t.bbq_detail_desc}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {t.features.map((feat, i) => (
                <div key={i} className={`flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10 ${lang === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                  <CheckCircle className="w-4 h-4 text-orange-500" />
                  <span className="text-[11px] font-black uppercase">{feat}</span>
                </div>
              ))}
            </div>
            <div className={`flex flex-col sm:flex-row gap-3 pt-4 ${lang === 'ar' ? 'sm:justify-end' : 'sm:justify-start'}`}>
              <button onClick={() => openOrderModal(PRODUCTS[1], { allowBbqChoice: true })} className="why-cta w-full sm:w-auto min-w-[220px] px-10 py-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_12px_30px_rgba(234,88,12,0.4)] hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto sm:mx-0">
                <ShoppingBag className="w-4 h-4" /> {t.order_btn}
              </button>
            </div>
          </div>
          <div className="hidden lg:block order-2 lg:order-2 relative w-full max-w-[460px] lg:max-w-none mx-auto lg:justify-self-end lg:translate-x-12 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 bg-black/20">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster={ASSETS.bbqDetailBackground}
              className="w-full h-full min-h-[20rem] sm:min-h-[22rem] md:min-h-[24rem] object-cover object-left"
            >
              <source src={ASSETS.bbqDetailVideoWebm} type="video/webm" />
              <source src={ASSETS.bbqDetailVideo} type="video/quicktime" />
            </video>
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden text-white py-20 px-6"
        style={{
          backgroundImage: `linear-gradient(rgba(10, 10, 10, 0.58), rgba(10, 10, 10, 0.58)), url(${ASSETS.rechaudDetailImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-emerald-500/10 pointer-events-none" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start lg:items-stretch">
          <div className="hidden lg:block order-2 lg:order-1 relative w-full max-w-[620px] h-full mx-auto rounded-[2.2rem] overflow-hidden shadow-xl border border-white/10 bg-black/30">
            <div
              className="flex h-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${rechaudPosterIndex * 100}%)` }}
            >
              {ASSETS.rechaudDetailCarousel.map((poster, index) => (
                <img
                  key={poster}
                  src={poster}
                  alt={`Rechaud slide ${index + 1}`}
                  onError={handleRechaudPosterError}
                  className="w-full h-full min-h-[24rem] flex-shrink-0 object-contain bg-black/35"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={goToPrevRechaudPoster}
              aria-label="Image précédente"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/45 text-white border border-white/20 hover:bg-black/65 transition-all flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={goToNextRechaudPoster}
              aria-label="Image suivante"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/45 text-white border border-white/20 hover:bg-black/65 transition-all flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className={`order-1 lg:order-2 h-full space-y-6 flex flex-col ${lang === 'ar' ? 'text-right' : ''}`}>
            
            <h2 className={`title-font text-4xl md:text-6xl font-black leading-none uppercase whitespace-pre-line ${lang === 'ar' ? 'text-right' : ''}`}>{t.rechaud_detail_title}</h2>
            <div className="lg:hidden relative w-full max-w-[620px] mx-auto rounded-[2.2rem] overflow-hidden shadow-xl border border-white/10 bg-black/30">
              <div
                className="flex h-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${rechaudPosterIndex * 100}%)` }}
              >
                {ASSETS.rechaudDetailCarousel.map((poster, index) => (
                  <img
                    key={poster}
                    src={poster}
                    alt={`Rechaud slide ${index + 1}`}
                    onError={handleRechaudPosterError}
                    className="w-full h-full min-h-[24rem] flex-shrink-0 object-contain bg-black/35"
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={goToPrevRechaudPoster}
                aria-label="Image précédente"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/45 text-white border border-white/20 hover:bg-black/65 transition-all flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={goToNextRechaudPoster}
                aria-label="Image suivante"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/45 text-white border border-white/20 hover:bg-black/65 transition-all flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <p
              className={`text-lg text-neutral-200 font-medium leading-relaxed whitespace-pre-line ${lang === 'ar' ? 'text-right' : ''}`}
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              style={lang === 'ar' ? { unicodeBidi: 'plaintext' } : undefined}
            >
              {t.rechaud_detail_desc}
            </p>
            <div className="space-y-3">
              {[
                { icon: Zap, text: t.rechaud_features[0] },
                { icon: Maximize2, text: t.rechaud_features[1] },
                { icon: Coffee, text: t.rechaud_features[2] },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-3 font-black text-xs uppercase tracking-tight ${lang === 'ar' ? 'flex-row-reverse text-right' : ''}`}>
                  <span className="text-emerald-300"><item.icon className="w-4 h-4" /></span>
                  {lang === 'ar' && i === 1 ? (
                    <span className="inline-flex items-center gap-1" dir="rtl">
                      <bdi dir="ltr">6</bdi>
                      <span>{item.text}</span>
                    </span>
                  ) : (
                    item.text
                  )}
                </div>
              ))}
            </div>
            <div className={`flex flex-col sm:flex-row gap-3 pt-4 ${lang === 'ar' ? 'sm:justify-end' : 'sm:justify-start'}`}>
              <button onClick={() => openOrderModal(PRODUCTS[2])} className="why-cta w-full sm:w-auto min-w-[220px] px-10 py-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_12px_30px_rgba(234,88,12,0.4)] hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto sm:mx-0">
                <ShoppingBag className="w-4 h-4" /> {t.order_btn}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section
        ref={whySectionRef}
        className="relative py-24 px-4 text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(10, 10, 10, 0.82), rgba(10, 10, 10, 0.82)), url(${ASSETS.whyBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="why-mist why-mist-1" />
          <div className="why-mist why-mist-2" />
          <span className="why-particle why-particle-1" />
          <span className="why-particle why-particle-2" />
          <span className="why-particle why-particle-3" />
          <span className="why-particle why-particle-4" />
        </div>
        <div className="max-w-4xl mx-auto">
          <h2 className="title-font text-3xl font-black mb-12 text-center">{t.why_title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {whyPoints.map((point, i) => (
              <div
                key={i}
                className={`why-card flex items-start gap-4 bg-white/8 p-6 rounded-3xl border border-white/20 backdrop-blur-md hover:bg-white/14 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(0,0,0,0.35)] hover:border-orange-300/45 transition-all duration-500 ${lang === 'ar' ? 'flex-row-reverse text-right' : ''} ${isWhyInView ? 'why-card-in' : ''}`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className={`p-2.5 rounded-xl ${point.tone}`}>
                  <point.icon className="w-7 h-7 flex-shrink-0 why-icon-motion" />
                </div>
                <span
                  className={`font-bold text-lg leading-9 sm:leading-relaxed w-full ${lang === 'ar' ? 'text-right' : ''}`}
                  dir={lang === 'ar' ? 'rtl' : 'ltr'}
                  style={lang === 'ar' ? { unicodeBidi: 'plaintext' } : undefined}
                >
                  {renderWhyText(point.text)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center sticky bottom-4 z-20">
            <button
              onClick={() => document.getElementById('produits').scrollIntoView({ behavior: 'smooth' })}
              className="why-cta px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-black shadow-[0_12px_30px_rgba(234,88,12,0.4)] hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-105 active:scale-95"
            >
              {t.why_cta}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-white pt-24 pb-12 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center md:text-start">
            <div className="md:text-left flex flex-col items-center md:items-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                 <img src={ASSETS.logo} alt="Logo" className="h-20 md:h-24 w-auto" />
              </div>
              <p
                className={`text-neutral-500 font-medium whitespace-pre-line ${lang === 'ar' ? 'text-right' : ''}`}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
                style={lang === 'ar' ? { unicodeBidi: 'plaintext' } : undefined}
              >
                {t.footer_desc}
                <ReactCountryFlag
                  countryCode="DZ"
                  svg
                  aria-label="Algeria"
                  style={{ width: '1.25rem', height: '0.875rem', borderRadius: '2px' }}
                />
              </p>
            </div>
            
            <div className="text-center flex flex-col items-center">
              <h4 className="title-font font-black mb-8 text-neutral-400 uppercase tracking-widest text-xs">{t.footer_social}</h4>
              <div className="flex justify-center gap-4">
                <a href="https://www.facebook.com/thegreatoutdoorsgrill" target="_blank" className="p-4 bg-neutral-100 text-neutral-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all" aria-label="Facebook">
                  <FaFacebookF className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/thegreatoutdoorsgrill" target="_blank" className="p-4 bg-neutral-100 text-neutral-600 rounded-2xl hover:bg-pink-600 hover:text-white transition-all" aria-label="Instagram">
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a href="https://www.tiktok.com/@thegreatoutdoorsgrill" target="_blank" className="p-4 bg-neutral-100 text-neutral-600 rounded-2xl hover:bg-black hover:text-white transition-all" aria-label="TikTok">
                  <FaTiktok className="w-5 h-5" />
                </a>
                <a href="mailto:thegreatoutdoorsgrill@gmail.com" target="_blank" className="p-4 bg-neutral-100 text-neutral-600 rounded-2xl hover:bg-orange-600 hover:text-white transition-all" aria-label="Email">
                  <FaEnvelope className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="md:text-right md:pl-8 xl:pl-12">
              <h4 className="title-font font-black mb-8 text-neutral-400 uppercase tracking-widest text-xs">{t.footer_phone}</h4>
              <div className="inline-flex flex-col items-center md:items-end">
                <p className="text-3xl font-black text-zinc-950 mb-2">
                  <a href="tel:+213797350430" target="_blank" rel="noopener noreferrer">
                    0797.35.04.30
                  </a>
                </p>
                <p className="text-orange-600 text-sm font-bold animate-pulse text-center">7j/7 : 09:00 - 20:00</p>
              </div>
            </div>
          </div>
          
          <div className="mt-20 pt-8 border-t border-neutral-100 text-center text-neutral-400 font-bold text-xs flex items-center justify-center gap-2">
            <span>&copy; {new Date().getFullYear()} THE GREAT OUTDOORS. MADE IN ALGERIA</span>
            <ReactCountryFlag
              countryCode="DZ"
              svg
              aria-label="Algeria"
              style={{ width: '1.25rem', height: '0.875rem', borderRadius: '2px' }}
            />
          </div>
        </div>
      </footer>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md" onClick={() => !isSubmitting && closeOrderModal()} />
          <div className="relative bg-white w-full max-w-md max-h-[92vh] rounded-[2.2rem] shadow-2xl overflow-hidden animate-slide-up flex flex-col">
            
            <div className={`px-6 py-5 border-b border-neutral-100 flex justify-between items-center bg-neutral-50`}>
              <h3 className="font-black text-2xl text-zinc-950">{t.modal_title}</h3>
              <button onClick={closeOrderModal} className="p-2.5 bg-white rounded-full shadow-sm hover:rotate-90 transition-transform"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto">
              {isSuccess ? (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <h4 className="text-3xl font-black mb-4 text-zinc-950">{t.success_title}</h4>
                  <p className="text-neutral-500 mb-6 font-medium leading-relaxed">
                    {t.success_desc}
                  </p>
                  <button onClick={() => setIsModalOpen(false)} className="w-full py-4 bg-zinc-950 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all">
                    {t.success_btn}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {allowBbqChoice ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[PRODUCTS[0], PRODUCTS[1]].map((product) => {
                        const isActive = selectedProduct?.id === product.id;
                        return (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => setSelectedProduct(product)}
                            className={`p-4 bg-orange-50 rounded-2xl border border-orange-100 flex gap-3 items-center text-left transition-all ${isActive ? 'ring-2 ring-orange-500/70 border-orange-400' : 'hover:border-orange-300 hover:bg-orange-100/70'}`}
                          >
                            <img src={resolveProductImage(product)} className="w-14 h-14 object-cover rounded-xl shadow-sm" alt={product.name[lang]} />
                            <div>
                              <p className="text-xs font-black text-orange-600 uppercase tracking-tighter">{product.size}</p>
                              <p className="text-zinc-950 font-black text-base leading-tight">{product.name[lang]}</p>
                              <p className="text-zinc-500 font-bold">{product.price} DA</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex gap-3 items-center">
                      <img src={selectedProduct ? resolveProductImage(selectedProduct) : ''} className="w-14 h-14 object-cover rounded-xl shadow-sm" alt="product" />
                      <div>
                        <p className="text-xs font-black text-orange-600 uppercase tracking-tighter">{selectedProduct?.size}</p>
                        <p className="text-zinc-950 font-black text-base leading-tight">{selectedProduct?.name[lang]}</p>
                        <p className="text-zinc-500 font-bold">{selectedProduct?.price} DA × {formData.quantity}</p>
                        <p className="text-zinc-950 font-black">{t.form_total}: {orderTotal} DA</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black mb-2 text-neutral-400 uppercase tracking-widest">{t.form_name}</label>
                      <input required name="name" value={formData.name} onChange={handleInputChange} placeholder="Nom Complet / الاسم الكامل" className="w-full px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none font-bold transition-all" />
                    </div>

                    <div>
                      <label className="block text-xs font-black mb-2 text-neutral-400 uppercase tracking-widest">{t.form_phone}</label>
                      <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="0550 00 00 00" className="w-full px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none font-black text-lg transition-all" dir="ltr" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black mb-2 text-neutral-400 uppercase tracking-widest">{t.form_wilaya}</label>
                        <select name="wilaya" value={formData.wilaya} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none font-black text-sm appearance-none cursor-pointer">
                          {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-black mb-2 text-neutral-400 uppercase tracking-widest">{t.form_qty}</label>
                        <input type="number" min="1" name="quantity" value={formData.quantity} onChange={handleInputChange} className="w-full px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl outline-none font-black transition-all" />
                      </div>
                    </div>
                    <p className="text-end text-sm font-black text-zinc-900">{t.form_total}: {orderTotal} DA</p>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-4.5 bg-orange-600 text-white rounded-[1.4rem] font-black text-lg shadow-2xl shadow-orange-500/30 hover:bg-orange-700 disabled:opacity-50 transition-all transform active:scale-95 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : t.form_submit}
                  </button>
                  <p className="text-center text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Paiement à la livraison | Livraison 58 Wilayas</p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-40 flex flex-col items-center gap-3">
        <a
          href="https://m.me/thegreatoutdoorsgrill"
          target="_blank"
          rel="noreferrer"
          aria-label="Messenger"
          className="bg-blue-600 text-white p-4 rounded-full shadow-[0_12px_30px_rgba(37,99,235,0.35)] hover:scale-110 active:scale-95 transition-transform duration-300"
        >
          <FaFacebookMessenger className="w-6 h-6" />
        </a>
        <a
          href="https://wa.me/213797350430"
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
          className="bg-emerald-500 text-white p-5 rounded-full shadow-[0_15px_40px_rgba(16,185,129,0.4)] hover:scale-110 active:scale-95 transition-transform duration-300"
        >
          <FaWhatsapp className="w-8 h-8" />
        </a>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Cairo:wght@400;700;900&display=swap');
        
        @keyframes slide-up {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1); }

        @keyframes carousel-fade {
          from { opacity: 0; transform: scale(1.03); }
          to { opacity: 1; transform: scale(1); }
        }
        .carousel-fade-image {
          animation: carousel-fade 0.6s ease-in-out;
        }

        @keyframes why-card-reveal {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .why-card {
          opacity: 0;
        }
        .why-card.why-card-in {
          opacity: 1;
          animation: why-card-reveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes icon-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .why-icon-motion {
          animation: icon-float 2.6s ease-in-out infinite;
        }
        .why-card:hover .why-icon-motion {
          animation-duration: 1.2s;
        }

        @keyframes cta-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .why-cta {
          animation: cta-bob 2.4s ease-in-out infinite;
        }

        @keyframes mist-drift {
          0% { transform: translateX(-6%) translateY(0); opacity: 0.16; }
          50% { transform: translateX(5%) translateY(-4%); opacity: 0.24; }
          100% { transform: translateX(-6%) translateY(0); opacity: 0.16; }
        }
        .why-mist {
          position: absolute;
          border-radius: 9999px;
          filter: blur(28px);
          background: radial-gradient(circle, rgba(251,146,60,0.20) 0%, rgba(251,146,60,0.03) 70%);
          animation: mist-drift 14s ease-in-out infinite;
        }
        .why-mist-1 {
          width: 18rem;
          height: 18rem;
          top: 10%;
          left: 8%;
        }
        .why-mist-2 {
          width: 22rem;
          height: 22rem;
          bottom: 4%;
          right: 6%;
          animation-delay: -6s;
        }

        @keyframes particle-float {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: 0.55; }
          100% { transform: translateY(-80px) scale(1.25); opacity: 0; }
        }
        .why-particle {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: rgba(251, 146, 60, 0.65);
          animation: particle-float 9s linear infinite;
        }
        .why-particle-1 { left: 18%; bottom: 14%; animation-delay: -1s; }
        .why-particle-2 { left: 42%; bottom: 10%; animation-delay: -3s; }
        .why-particle-3 { left: 68%; bottom: 12%; animation-delay: -5s; }
        .why-particle-4 { left: 84%; bottom: 9%; animation-delay: -7s; }
        
        body {
          font-family: 'Inter', sans-serif;
        }

        .title-font {
          font-family: 'Inter', sans-serif;
        }

        .lang-ar {
          font-family: 'Cairo', sans-serif;
        }

        .lang-ar .title-font {
          font-family: 'Cairo', sans-serif;
        }

        select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='orig'/%3E%3Cpath d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
          background-position: right 1rem center;
          background-repeat: no-repeat;
          background-size: 1.5em;
        }
      `}</style>
    </div>
  );
}