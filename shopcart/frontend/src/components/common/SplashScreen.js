import React, { useEffect, useState } from 'react';
import logo from '../../assets/images/logo2.png';
import './SplashScreen.css';

const BRAND_NAME = 'Shopix';

const SplashScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState('init');
  const [typedText, setTypedText] = useState('');
  const [navPos, setNavPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Get navbar logo position for fly animation
    const getNavPos = () => {
      const navLogo = document.querySelector('.navbar-logo');
      if (navLogo) {
        const rect = navLogo.getBoundingClientRect();
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        setNavPos({
          x: rect.left + rect.width / 2 - centerX,
          y: rect.top + rect.height / 2 - centerY,
        });
      }
    };

    getNavPos();
    window.addEventListener('resize', getNavPos);

    const timers = [];

    // Phase: logo pops in
    timers.push(setTimeout(() => setPhase('logo-in'), 100));

    // Phase: start typing
    let charIndex = 0;
    let typingInterval;
    timers.push(setTimeout(() => {
      setPhase('typing');
      typingInterval = setInterval(() => {
        charIndex++;
        setTypedText(BRAND_NAME.slice(0, charIndex));
        if (charIndex === BRAND_NAME.length) {
          clearInterval(typingInterval);
        }
      }, 110);
    }, 900));

    // Phase: hold full text
    timers.push(setTimeout(() => setPhase('holding'), 2200));

    // Phase: delete text
    let deleteInterval;
    timers.push(setTimeout(() => {
      setPhase('deleting');
      let delIndex = BRAND_NAME.length;
      deleteInterval = setInterval(() => {
        delIndex--;
        setTypedText(BRAND_NAME.slice(0, delIndex));
        if (delIndex === 0) clearInterval(deleteInterval);
      }, 75);
    }, 2800));

    // Phase: logo flies to navbar
    timers.push(setTimeout(() => setPhase('flying'), 3700));

    // Phase: complete
    timers.push(setTimeout(() => {
      onComplete();
    }, 4500));

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(typingInterval);
      clearInterval(deleteInterval);
      window.removeEventListener('resize', getNavPos);
    };
  }, []);

  const isFlying = phase === 'flying';

  return (
    <div className={`splash-overlay ${isFlying ? 'splash-unblur' : ''}`}>

      {/* Blurred background */}
      <div className={`splash-blur-bg ${isFlying ? 'blur-exit' : ''}`} />

      {/* Animated particles */}
      <div className="splash-particles">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`} />
        ))}
      </div>

      {/* Center content */}
      <div
        className={`splash-center ${phase === 'init' ? 'hidden' : ''} ${isFlying ? 'splash-flying' : ''}`}
        style={isFlying ? {
          '--fly-x': `${navPos.x}px`,
          '--fly-y': `${navPos.y}px`,
        } : {}}
      >
        {/* Glow ring behind logo */}
        <div className={`logo-glow-ring ${phase !== 'init' ? 'ring-visible' : ''}`} />

        {/* Logo */}
        <div className={`splash-logo-container ${phase === 'logo-in' || phase === 'typing' || phase === 'holding' || phase === 'deleting' ? 'logo-animate-in' : ''}`}>
          <img src={logo} alt="Shopix" className="splash-big-logo" />
        </div>

        {/* Brand text */}
        <div className="splash-text-wrap">
          <span className="splash-brand-text">
            {typedText.split('').map((char, i) => (
              <span
                key={i}
                className="splash-char"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {char}
              </span>
            ))}
            {(phase === 'typing' || phase === 'deleting') && (
              <span className="splash-cursor">|</span>
            )}
          </span>
        </div>

        {/* Tagline */}
        <div className={`splash-tagline ${phase === 'holding' ? 'tagline-visible' : ''}`}>
          Explore More. Shop Better.
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
