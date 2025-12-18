
import React, { useState } from 'react';
import Header from './Header';

interface FaqPageProps {
  onBack: () => void;
  onAboutClick: () => void;
}

const FAQ_DATA = [
  {
    category: "Product Overview",
    items: [
      { q: "What is a Repos Portable Station (RPS)?", a: "A PESO-approved, above-ground, fully automated portable fuel station for large fuel consumers." },
      { q: "In what capacities is the RPS available?", a: "RPS is available in 22KL, 30KL, 45KL, and 60KL capacities." },
      { q: "Are these units portable?", a: "Yes. All RPS models can be relocated as per project requirement." },
      { q: "Are the RPS units suitable for high consumption?", a: "Yes. Designed for large industrial, infra, logistics & mining operations." },
      { q: "What technology powers the RPS?", a: "ReposOS – an IoT-enabled ecosystem for complete fuel automation." },
      { q: "What is the purpose of RPS?", a: "To provide bulk diesel users with an on-site consumer pump that increases efficiency and reduces pilferage." }
    ]
  },
  {
    category: "Manufacturing & Construction",
    items: [
      { q: "What material is used for the RPS tank?", a: "Primary tank: 8mm MS (IS2062 E250). Secondary tank: 6mm dish + 5mm shell." },
      { q: "How are RPS tanks designed?", a: "Double-walled above-ground tanks as per PESO standards." },
      { q: "Are the units corrosion resistant?", a: "Yes. They are coated with a high-grade anti-rust system." },
      { q: "Who manufactures the hardware and software?", a: "Repos manufactures the entire mechanical + IoT system in-house." },
      { q: "Are the fuel dispensing units custom-built?", a: "Yes. They are built for precision and Legal Metrology compliance." }
    ]
  },
  {
    category: "Safety Features",
    items: [
      { q: "What major safety systems are included?", a: "Leak detection, fire suppression, overfill protection, emergency venting, safety skids." },
      { q: "Do RPS units have automatic fire suppression?", a: "Yes. They activate at pre-set high temperatures." },
      { q: "Is leak detection standard?", a: "Yes. LDS sensors detect leakage and shut the system automatically." },
      { q: "What prevents overfilling of fuel?", a: "A float-based Overfill Protection System." },
      { q: "How does RPS prevent tank pressure hazards?", a: "Through Pressure Vacuum Valves and emergency vents." },
      { q: "Are physical safety barriers included?", a: "Yes. Bollards and crash barriers are part of the safety layout." }
    ]
  },
  {
    category: "Software (ReposOS)",
    items: [
      { q: "What is ReposOS?", a: "A cloud-based monitoring platform for live fuel tracking and control." },
      { q: "Does RPS integrate with ERP systems?", a: "Yes – SAP, Oracle, Tally, and custom ERPs." },
      { q: "What parameters can be monitored?", a: "Fuel levels, consumption, transactions, errors, alarms, and user logs." },
      { q: "Can operators control dispensing from software?", a: "Yes. Dispensing, locking, RFID access, reports, all available in ReposOS." },
      { q: "Is the fuelling monitored by CCTV cameras?", a: "Yes. On-site CCTV is integrated with the system." }
    ]
  },
  {
    category: "PESO Process",
    items: [
      { q: "Is PESO approval mandatory?", a: "Yes. Prior Approval & Final License (Form 14) are compulsory." },
      { q: "What documents are required for Prior Approval?", a: "LOI, KYC, land papers, site/layout drawings, undertakings, Form IX." },
      { q: "How long does PESO approval take?", a: "Typically 60–90 days depending on documentation." },
      { q: "Who handles PESO liaison?", a: "Repos supports the process; customer must provide the required documents." },
      { q: "Is Legal Metrology approval included?", a: "Yes. Fuelling units meet LM requirements." }
    ]
  },
  {
    category: "Land & Site",
    items: [
      { q: "How much land is required for RPS installation?", a: "Typically 6,000–8,000 sq. ft, depending on the model." },
      { q: "Can RPS be installed under HT/LT lines?", a: "No. Overhead HT/LT lines are not permitted." },
      { q: "Are water bodies allowed nearby?", a: "No water body within 100 meters of the site." },
      { q: "Are permanent constructions allowed on land?", a: "No permanent structures within the site boundary." },
      { q: "What civil work is needed?", a: "Foundation block of ~30x8x9 ft or as per model guidelines." },
      { q: "What electrical setup is required?", a: "3-phase power, proper earthing, stabilizer, MCCB." }
    ]
  },
  {
    category: "Usage & Operations",
    items: [
      { q: "Who operates the RPS?", a: "A trained operator appointed by the customer." },
      { q: "How does dispensing occur?", a: "Through RFID-enabled automated dispensing via ReposOS." },
      { q: "Can multiple nozzles operate simultaneously?", a: "Yes. Dual-nozzle support is available." },
      { q: "Does RPS prevent fuel pilferage?", a: "Yes. Through automation + RFID + CCTV + controlled access." },
      { q: "How does RPS handle emergencies?", a: "Automatic shutdown via IoT controller + manual ESD buttons." }
    ]
  },
  {
    category: "Procurement",
    items: [
      { q: "From where can diesel be procured?", a: "OMC depots (IOCL/HPCL/BPCL) using LOI." },
      { q: "How is diesel loaded into RPS?", a: "Through Decantation Skid using tanker-to-tank transfer." },
      { q: "Is decantation faster than normal pumps?", a: "Yes, significantly faster and more accurate." },
      { q: "Can fuel be delivered via Repos partners?", a: "Yes, via Repos Fuel Delivery Network." }
    ]
  },
  {
    category: "Commercials & Finance",
    items: [
      { q: "What business models are available?", a: "Outright purchase & EMI-based subscription." },
      { q: "Does Repos offer credit?", a: "Yes. Repos Pay provides 15+7 days interest-free credit." },
      { q: "What cost benefits does RPS offer?", a: "Reduced pilferage (5–8%), reduced downtime, accurate billing." },
      { q: "What maintenance costs apply?", a: "AMC begins from Year 2 onwards." }
    ]
  },
  {
    category: "Support & Warranty",
    items: [
      { q: "Does Repos provide after-sales support?", a: "Yes. Pan-India service network (Repos CARE)." },
      { q: "Is operator training provided?", a: "Yes. On-site training is included at installation." },
      { q: "Does AMC include software support?", a: "Yes. Software + hardware + troubleshooting are included." },
      { q: "Who handles calibration and repairs?", a: "Repos technicians manage all technical service; LM officer manages legal calibration." }
    ]
  }
];

const FaqPage: React.FC<FaqPageProps> = ({ onBack, onAboutClick }) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenQuestionIndex(openQuestionIndex === index ? null : index);
  };

  const handleCategoryClick = (index: number) => {
    setActiveCategoryIndex(index);
    setOpenQuestionIndex(null); // Reset open question when changing category
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      <Header 
        navItems={['Home', 'Build Your Own RPS', 'About Us']}
        onHomeClick={onBack}
        onNavItemClick={(item) => {
            if (item === 'Home') onBack();
            if (item === 'Build Your Own RPS') onBack(); // Assuming back goes to main app or home
            if (item === 'About Us') onAboutClick();
        }}
        showRoi={false}
      />

      <main className="flex-grow">
        {/* Header Section */}
        <div className="bg-black text-white py-20 px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">Frequently Asked Questions</h1>
            <p className="text-gray-400 text-sm tracking-widest uppercase">Everything you need to know about RPS</p>
        </div>

        <div className="max-w-7xl mx-auto py-16 px-6">
            <div className="flex flex-col lg:flex-row gap-12">
                
                {/* Left Column: Categories */}
                <div className="lg:w-1/3 flex-shrink-0">
                    <div className="sticky top-24">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 px-4">Categories</h3>
                        <div className="space-y-1">
                            {FAQ_DATA.map((cat, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleCategoryClick(idx)}
                                    className={`w-full text-left px-4 py-3 text-sm font-medium transition-all duration-300 border-l-2 ${
                                        activeCategoryIndex === idx 
                                        ? 'border-black text-black bg-gray-50' 
                                        : 'border-transparent text-gray-500 hover:text-black hover:bg-gray-50'
                                    }`}
                                >
                                    {cat.category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Accordion Content */}
                <div className="lg:w-2/3 min-h-[500px]">
                    <h2 className="text-2xl font-light text-black mb-8 pb-4 border-b border-gray-100">
                        {FAQ_DATA[activeCategoryIndex].category}
                    </h2>

                    <div className="space-y-4">
                        {FAQ_DATA[activeCategoryIndex].items.map((item, idx) => (
                            <div 
                                key={idx} 
                                className={`border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${
                                    openQuestionIndex === idx ? 'bg-gray-50 border-gray-300 shadow-sm' : 'bg-white hover:border-gray-300'
                                }`}
                            >
                                <button
                                    onClick={() => toggleQuestion(idx)}
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                                >
                                    <span className={`text-base font-medium pr-8 transition-colors ${openQuestionIndex === idx ? 'text-black' : 'text-gray-800'}`}>
                                        {item.q}
                                    </span>
                                    <span className="flex-shrink-0">
                                        <svg 
                                            className={`w-5 h-5 transition-transform duration-300 ${openQuestionIndex === idx ? 'rotate-45 text-black' : 'text-gray-400'}`} 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </span>
                                </button>
                                
                                <div 
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                        openQuestionIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <div className="p-6 pt-0 text-gray-600 leading-relaxed font-light text-sm">
                                        {item.a}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 text-center">
        <p className="text-xs text-gray-400">© 2024 Repos Energy India Pvt Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default FaqPage;
