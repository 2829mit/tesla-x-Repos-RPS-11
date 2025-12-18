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
    setOpenQuestionIndex(null);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      <Header 
        navItems={['Home', 'Build Your Own RPS', 'About Us']}
        onHomeClick={onBack}
        onNavItemClick={(item) => {
            if (item === 'Home') onBack();
            if (item === 'Build Your Own RPS') onBack();
            if (item === 'About Us') onAboutClick();
        }}
        showRoi={false}
      />

      <main className="flex-grow">
        <div className="bg-black text-white py-20 px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">Frequently Asked Questions</h1>
            <p className="text-gray-400 text-sm tracking-widest uppercase">Everything you need to know about RPS</p>
        </div>

        <div className="max-w-7xl mx-auto py-16 px-6">
            <div className="flex flex-col lg:flex-row gap-12">
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

                <div className="lg:w-2/3 min-h-[500px]">
                    <h2 className="text-2xl font-light text-black mb-8 pb-4 border-b border-gray-100">
                        {FAQ_DATA[activeCategoryIndex].category}
                    </h2>

                    <div className="space-y-4">
                        {FAQ_DATA[activeCategoryIndex].items.map((item, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => toggleQuestion(idx)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className="text-base font-medium pr-8">{item.q}</span>
                                </button>
                                {openQuestionIndex === idx && (
                                    <div className="p-6 pt-0 text-gray-600 leading-relaxed font-light text-sm">
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default FaqPage;