/**
 * ROLO'S — Desktop Diner Kiosk + Mobile Neo-Brutalist App Logic
 * Solo 2 Sabores Reales: Carne Ahumada y Pollo a la Mostaza con Verdeo
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Catálogo Único de 2 Sabores Reales
  // =========================================================================
  const FLAVORS = {
    clasico: {
      name: "Rolo Clásico (Carne Ahumada)",
      shortName: "Carne Ahumada",
      handle: "@rolo.clasico",
      img: "assets/img/rolo_clasico.jpg",
      speech: '"¡El rey indiscutido con carne ahumada y queso fundente!"',
      ingredients: "60% cerdo magro braseado + 40% cebolla caramelizada ahumada + 30g queso cremoso en masa casera de 110g.",
      keywords: "carne cerdo bondiola ahumada cebolla queso clasico"
    },
    pollo: {
      name: "Pollo a la Mostaza con Verdeo",
      shortName: "Pollo Mostaza",
      handle: "@rolo.pollo",
      img: "assets/img/rolo_pollo.jpg",
      speech: '"¡Suprema jugosa a la mostaza con verdeo y muzzarella!"',
      ingredients: "Suprema de pollo desmechada en salsa suave de mostaza gourmet, cebollita de verdeo fresca y queso muzzarella fundido.",
      keywords: "pollo mostaza verdeo suprema muzzarella carne blanca"
    }
  };

  let currentFlavor = 'clasico';
  let animationsArmed = false;

  function setTextAnimated(el, nextValue, isHtml = false) {
    if (!el) return;
    const nextStr = String(nextValue);
    const prevStr = isHtml ? el.innerHTML : el.textContent;
    if (prevStr === nextStr) return;

    if (isHtml) {
      el.innerHTML = nextStr;
    } else {
      el.textContent = nextStr;
    }

    if (!animationsArmed || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    el.classList.remove('is-text-popping');
    void el.offsetWidth;
    el.classList.add('is-text-popping');
    clearTimeout(el._popTimerId);
    el._popTimerId = setTimeout(() => el.classList.remove('is-text-popping'), 300);
  }

  function spawnCounterDeltaBadge(flavorKey, delta) {
    if (!delta || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll(`.counter-float-host[data-counter-host="${flavorKey}"]`).forEach(host => {
      if (host.offsetParent === null) return;
      const badge = document.createElement('span');
      badge.className = `qty-float-badge ${delta > 0 ? 'is-plus' : 'is-minus'}`;
      badge.setAttribute('aria-hidden', 'true');
      badge.textContent = delta > 0 ? '+1' : '-1';
      host.appendChild(badge);
      const cleanup = () => badge.remove();
      badge.addEventListener('animationend', cleanup, { once: true });
      setTimeout(cleanup, 750);
    });
  }

  // Estado compartido del carrito (arranca vacío en 0 para que el usuario elija)
  const cart = {
    clasico: 0,
    pollo: 0
  };

  // =========================================================================
  // 2. Router de Vistas (#inicio | #menu | #afiches) + Cortina La Canaca
  // =========================================================================
  const curtainEl = document.getElementById('rolosPageCurtain');
  const viewSections = Array.from(document.querySelectorAll('.app-view[data-view]'));
  const viewSubbar = document.getElementById('viewSubbar');
  const viewSubbarLabel = document.getElementById('viewSubbarLabel');
  const mobileStickyDock = document.getElementById('mobileStickyDock');
  const navViewLinks = document.querySelectorAll('.diner-nav-group a[data-view-target], .mobile-header-links a[data-view-target]');
  let activeView = 'inicio';
  let isViewTransitioning = false;

  function resolveRouteFromHash(rawHash) {
    const clean = (rawHash || '').replace(/^#/, '').toLowerCase();
    if (clean === 'menu' || clean === 'carta-diner' || clean === 'app-neobrutalista') {
      return { view: 'menu', scrollTarget: null };
    }
    if (clean === 'como-calentar') {
      return { view: 'menu', scrollTarget: 'como-calentar' };
    }
    if (clean === 'afiches' || clean === 'galeria-retro') {
      return { view: 'afiches', scrollTarget: null };
    }
    return { view: 'inicio', scrollTarget: null };
  }

  function waitCurtainAnimation(el, fallbackMs = 700) {
    return new Promise((resolve) => {
      if (!el || el.getAnimations().length === 0) {
        resolve();
        return;
      }
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        el.removeEventListener('animationend', onEnd);
        clearTimeout(timerId);
        resolve();
      };
      const onEnd = (e) => {
        if (e.target === el) done();
      };
      const timerId = setTimeout(done, fallbackMs);
      el.addEventListener('animationend', onEnd);
    });
  }

  function applyViewState(viewName, scrollTargetId = null, animateEntrance = true) {
    activeView = viewName;

    viewSections.forEach(sec => {
      const isMatch = sec.dataset.view === viewName;
      sec.classList.remove('is-animating-in');
      if (isMatch) {
        sec.removeAttribute('hidden');
        if (animateEntrance) {
          void sec.offsetWidth;
          sec.classList.add('is-animating-in');
        }
      } else {
        sec.setAttribute('hidden', '');
      }
    });

    document.body.classList.toggle('is-menu-view', viewName === 'menu');
    if (viewSubbar && viewSubbarLabel) {
      if (viewName === 'inicio') {
        viewSubbar.hidden = true;
      } else {
        viewSubbar.hidden = false;
        viewSubbarLabel.textContent = viewName === 'menu'
          ? 'MENÚ & CÓMO CALENTARLO'
          : "AFICHES DE ROLO'S";
      }
    }
    if (mobileStickyDock) {
      mobileStickyDock.hidden = viewName !== 'menu';
    }

    if (viewName === 'menu') {
      activateMobileScreen('catalog');
      setMobileOrderStep('select');
    }

    navViewLinks.forEach(link => {
      const target = link.dataset.viewTarget;
      const isScrollLink = Boolean(link.dataset.scrollTarget);
      if (target === viewName && !isScrollLink) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    if (scrollTargetId) {
      const targetEl = document.getElementById(scrollTargetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'auto', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  async function navigateToView(targetView, scrollTargetId = null, updateHash = true) {
    const viewName = ['inicio', 'menu', 'afiches'].includes(targetView) ? targetView : 'inicio';

    if (viewName === activeView) {
      if (viewName === 'menu') {
        activateMobileScreen('catalog');
        setMobileOrderStep('select');
      }
      const targetId = scrollTargetId || (viewName === 'menu' ? (window.innerWidth >= 768 ? 'carta-diner' : 'app-neobrutalista') : null);
      if (targetId) {
        document.getElementById(targetId)?.scrollIntoView({ behavior: getScrollBehavior(), block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: getScrollBehavior() });
      }
      return;
    }

    if (isViewTransitioning) return;

    const targetHash = scrollTargetId ? `#${scrollTargetId}` : `#${viewName}`;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches || !curtainEl;

    if (reducedMotion) {
      if (updateHash) history.pushState(null, '', targetHash);
      applyViewState(viewName, scrollTargetId, false);
      document.querySelector(`.app-view[data-view="${viewName}"]`)?.focus({ preventScroll: true });
      return;
    }

    isViewTransitioning = true;

    curtainEl.classList.remove('is-entering', 'is-exiting');
    void curtainEl.offsetWidth;
    curtainEl.classList.add('is-exiting');
    await waitCurtainAnimation(curtainEl, 700);

    if (updateHash) {
      history.pushState(null, '', targetHash);
    }
    applyViewState(viewName, scrollTargetId, true);

    curtainEl.classList.remove('is-exiting');
    void curtainEl.offsetWidth;
    curtainEl.classList.add('is-entering');
    await waitCurtainAnimation(curtainEl, 700);

    curtainEl.classList.remove('is-entering');
    isViewTransitioning = false;

    const focusTarget = (scrollTargetId && document.getElementById(scrollTargetId))
      || document.querySelector(`.app-view[data-view="${viewName}"]`);
    focusTarget?.focus({ preventScroll: true });
  }

  document.querySelectorAll('[data-view-target]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToView(trigger.dataset.viewTarget, trigger.dataset.scrollTarget || null, true);
    });
  });

  window.addEventListener('popstate', () => {
    const { view, scrollTarget } = resolveRouteFromHash(window.location.hash);
    navigateToView(view, scrollTarget, false);
  });

  // =========================================================================
  // 3. Motor de Precios Oficial (1x $6000 | 3x $16500 | 5x $25000)
  // =========================================================================
  function calculatePricing(totalUnits) {
    if (totalUnits <= 0) {
      return { finalPrice: 0, oldPrice: 0, label: 'SIN ROLO SELECCIONADO', savings: 0 };
    }

    let rem = totalUnits;
    let finalPrice = 0;
    const oldPrice = totalUnits * 6000;

    const packs5 = Math.floor(rem / 5);
    finalPrice += packs5 * 25000;
    rem %= 5;

    const packs3 = Math.floor(rem / 3);
    finalPrice += packs3 * 16500;
    rem %= 3;

    finalPrice += rem * 6000;

    let label = `${totalUnits} Rolo(s) Individual`;
    if (totalUnits >= 5 && totalUnits % 5 === 0) {
      label = `Pack x${totalUnits} "Semana Resuelta"`;
    } else if (totalUnits >= 3 && totalUnits % 3 === 0) {
      label = `Pack x${totalUnits} "Trío de Turno"`;
    } else if (totalUnits > 1) {
      label = `Combo x${totalUnits} Rolos`;
    }

    return { finalPrice, oldPrice, label, savings: Math.max(0, oldPrice - finalPrice) };
  }

  function getTotalUnits() {
    return (cart.clasico || 0) + (cart.pollo || 0);
  }

  function getCartSummaryStrings() {
    const parts = [];
    if (cart.clasico > 0) parts.push(`${cart.clasico}x ${FLAVORS.clasico.shortName}`);
    if (cart.pollo > 0) parts.push(`${cart.pollo}x ${FLAVORS.pollo.shortName}`);
    return parts;
  }

  // =========================================================================
  // 4. Visor Dinámico de Mascota (Sincronizado Desktop + Mobile)
  // =========================================================================
  const desktopStickerContainer = document.querySelector('.menu-header-sticker');
  const desktopShowcaseAvatars = document.getElementById('desktopShowcaseAvatars');
  const desktopShowcaseTitle = document.getElementById('desktopShowcaseTitle');
  const desktopShowcaseSpeech = document.getElementById('desktopShowcaseSpeech');
  const desktopShowcaseIngredients = document.getElementById('desktopShowcaseIngredients');
  const desktopFlavorRows = document.querySelectorAll('.diner-menu-row[data-desktop-flavor]');

  const mHeaderAvatar1 = document.getElementById('mHeaderAvatar1');
  const mLiveAvatarTop = document.getElementById('mLiveAvatarTop');
  const mLiveHeaderName = document.getElementById('mLiveHeaderName');
  const mLiveHeaderHandle = document.getElementById('mLiveHeaderHandle');
  const mShowcaseImg = document.getElementById('mShowcaseImg');
  const mShowcaseSpeech = document.getElementById('mShowcaseSpeech');
  const mShowcaseIngredients = document.getElementById('mShowcaseIngredients');

  function swapImageSmooth(imgEl, newSrc) {
    if (!imgEl || imgEl.getAttribute('src') === newSrc) return;
    imgEl.classList.add('switching');
    setTimeout(() => {
      imgEl.src = newSrc;
      imgEl.classList.remove('switching');
    }, 130);
  }

  function renderDesktopShowcase() {
    const selectedKeys = ['clasico', 'pollo'].filter(k => (cart[k] || 0) > 0);
    const total = getTotalUnits();

    if (selectedKeys.length === 2) {
      if (desktopShowcaseAvatars) {
        desktopShowcaseAvatars.classList.add('is-duo');
        desktopShowcaseAvatars.innerHTML = selectedKeys.map(k => {
          const fl = FLAVORS[k];
          return `
            <div class="counter-avatar-card">
              <span class="counter-avatar-qty">×${cart[k]}</span>
              <img src="${fl.img}" alt="Mascota ${fl.shortName}">
            </div>
          `;
        }).join('');
      }
      if (desktopStickerContainer) {
        desktopStickerContainer.classList.add('is-duo');
        desktopStickerContainer.innerHTML = `
          <img src="${FLAVORS.clasico.img}" alt="Rolo Clásico">
          <img src="${FLAVORS.pollo.img}" alt="Rolo Pollo">
        `;
      }
      setTextAnimated(desktopShowcaseTitle, 'Carne Ahumada + Pollo a la Mostaza');
      setTextAnimated(desktopShowcaseSpeech, '"¡Combo mixto armado con los dos clásicos de Rolo\'s!"');
      setTextAnimated(desktopShowcaseIngredients, `
          <ul class="counter-ingredients-duo">
            <li><strong>Carne Ahumada (${cart.clasico}×):</strong> ${FLAVORS.clasico.ingredients}</li>
            <li><strong>Pollo Mostaza (${cart.pollo}×):</strong> ${FLAVORS.pollo.ingredients}</li>
          </ul>
        `, true);
    } else {
      const displayKey = selectedKeys.length === 1 ? selectedKeys[0] : currentFlavor;
      const f = FLAVORS[displayKey];
      const qty = cart[displayKey] || 0;
      if (desktopShowcaseAvatars) {
        desktopShowcaseAvatars.classList.remove('is-duo');
        desktopShowcaseAvatars.innerHTML = `
          <div class="counter-avatar-card">
            ${qty > 0 ? `<span class="counter-avatar-qty">×${qty}</span>` : ''}
            <img src="${f.img}" alt="Mascota ${f.shortName}">
          </div>
        `;
      }
      if (desktopStickerContainer) {
        desktopStickerContainer.classList.remove('is-duo');
        desktopStickerContainer.innerHTML = `<img src="${f.img}" alt="${f.shortName} Sticker" id="desktopStickerImg">`;
      }
      setTextAnimated(desktopShowcaseTitle, f.name);
      setTextAnimated(desktopShowcaseSpeech, f.speech);
      setTextAnimated(desktopShowcaseIngredients, `<strong>340g reales:</strong> ${f.ingredients}`, true);
    }

    desktopFlavorRows.forEach(row => {
      const key = row.dataset.desktopFlavor;
      const isSelected = total > 0 ? (cart[key] || 0) > 0 : key === currentFlavor;
      row.classList.toggle('active-flavor', isSelected);
    });
  }

  function selectFlavor(flavorKey, switchMobileToLote = false) {
    const f = FLAVORS[flavorKey];
    if (!f) return;
    currentFlavor = flavorKey;

    renderDesktopShowcase();

    // Mobile sync
    swapImageSmooth(mShowcaseImg, f.img);
    if (mHeaderAvatar1) mHeaderAvatar1.src = f.img;
    if (mLiveAvatarTop) mLiveAvatarTop.src = f.img;
    setTextAnimated(mLiveHeaderName, f.shortName);
    setTextAnimated(mLiveHeaderHandle, f.handle);
    setTextAnimated(mShowcaseSpeech, f.speech);
    setTextAnimated(mShowcaseIngredients, `<strong>Ingredientes (340g):</strong> ${f.ingredients}`, true);

    if (switchMobileToLote && window.innerWidth < 768) {
      activateMobileScreen('lote');
    }
  }

  // =========================================================================
  // 5. Renderizado Unificado de Carrito, Packs y Checkout (Desktop + Mobile)
  // =========================================================================
  const desktopQtyClasico = document.getElementById('desktopQtyClasico');
  const desktopQtyPollo = document.getElementById('desktopQtyPollo');
  const desktopPackPills = document.querySelectorAll('.pack-pill-btn[data-desktop-pack]');
  const desktopPromoNudge = document.getElementById('desktopPromoNudge');
  const desktopTicketTitle = document.getElementById('desktopTicketTitle');
  const desktopTicketItems = document.getElementById('desktopTicketItems');
  const desktopTicketOld = document.getElementById('desktopTicketOld');
  const desktopTicketFinal = document.getElementById('desktopTicketFinal');
  const dSubmitLabel = document.getElementById('dSubmitLabel');

  const mCartBadgeHandle = document.getElementById('mCartBadgeHandle');
  const mMobilePackPills = document.querySelectorAll('.m-tier-pill[data-mobile-pack]');
  const mCardQtyClasico = document.getElementById('mCardQtyClasico');
  const mCardQtyPollo = document.getElementById('mCardQtyPollo');
  const mPromoUpsellText = document.getElementById('mPromoUpsellText');
  const mBtnQuickUpsell = document.getElementById('mBtnQuickUpsell');
  const mCartComboLabel = document.getElementById('mCartComboLabel');
  const mCartSummaryItems = document.getElementById('mCartSummaryItems');
  const mCartOldTotal = document.getElementById('mCartOldTotal');
  const mCartFinalTotal = document.getElementById('mCartFinalTotal');
  const mSelectComboLabel = document.getElementById('mSelectComboLabel');
  const mSelectSummaryItems = document.getElementById('mSelectSummaryItems');
  const mSelectFinalTotal = document.getElementById('mSelectFinalTotal');
  const mSelectStepStatus = document.getElementById('mSelectStepStatus');
  const mNextStepLabel = document.getElementById('mNextStepLabel');
  const mSubmitLabel = document.getElementById('mSubmitLabel');
  const mStickyCheckoutText = document.getElementById('mStickyCheckoutText');

  function renderAll() {
    const totalUnits = getTotalUnits();
    const pricing = calculatePricing(totalUnits);
    const itemsArr = getCartSummaryStrings();
    const itemsText = itemsArr.length ? itemsArr.join(' + ') : 'Elegí al menos 1 Rolo';

    // 1) Desktop UI
    setTextAnimated(desktopQtyClasico, cart.clasico || 0);
    setTextAnimated(desktopQtyPollo, cart.pollo || 0);

    renderDesktopShowcase();

    let activePackTier = 0;
    if (totalUnits >= 5) activePackTier = 5;
    else if (totalUnits >= 3) activePackTier = 3;
    else if (totalUnits >= 1) activePackTier = 1;

    desktopPackPills.forEach(pill => {
      const packSize = parseInt(pill.dataset.desktopPack, 10);
      pill.classList.toggle('active', packSize === activePackTier);
    });

    mMobilePackPills.forEach(pill => {
      const packSize = parseInt(pill.dataset.mobilePack, 10);
      pill.classList.toggle('active', packSize === activePackTier);
    });

    if (desktopPromoNudge) {
      let nudgeHtml = '';
      if (totalUnits === 0) {
        nudgeHtml = `<i class="fas fa-hand-point-up" aria-hidden="true"></i><span>Sumá al menos 1 Rolo de Carne o Pollo arriba para preparar tu pedido.</span>`;
      } else if (totalUnits === 1 || totalUnits === 2) {
        const missing = 3 - totalUnits;
        nudgeHtml = `<i class="fas fa-tag" aria-hidden="true"></i><span>Llevás ${totalUnits} Rolo(s) a $6.000 c/u. Sumá <strong>${missing} más</strong> para activar el <strong>Pack x3 a $16.500</strong> ($5.500 c/u).</span>`;
      } else if (totalUnits === 3 || totalUnits === 4) {
        const missing = 5 - totalUnits;
        nudgeHtml = `<i class="fas fa-fire" aria-hidden="true"></i><span>¡Pack x3 activado! Sumá <strong>${missing} Rolo(s) más</strong> para pasar al <strong>Pack x5 a $25.000</strong> ($5.000 c/u).</span>`;
      } else {
        nudgeHtml = `<i class="fas fa-bolt" aria-hidden="true"></i><span>¡${pricing.label} activado! Estás ahorrando <strong>$${pricing.savings.toLocaleString('es-AR')}</strong> frente al precio por unidad.</span>`;
      }
      setTextAnimated(desktopPromoNudge, nudgeHtml, true);
    }

    setTextAnimated(desktopTicketTitle, pricing.label);
    setTextAnimated(desktopTicketItems, itemsText);
    if (desktopTicketOld) {
      desktopTicketOld.hidden = pricing.savings <= 0;
      if (pricing.savings > 0) {
        setTextAnimated(desktopTicketOld, `$${pricing.oldPrice.toLocaleString('es-AR')}`);
      }
    }
    setTextAnimated(desktopTicketFinal, `$${pricing.finalPrice.toLocaleString('es-AR')}`);
    setTextAnimated(dSubmitLabel, `ENVIAR PEDIDO ($${pricing.finalPrice.toLocaleString('es-AR')})`);

    // 2) Mobile UI (Paso 1 Selector + Paso 2 Checkout)
    setTextAnimated(mCartBadgeHandle, `${totalUnits} Rolo(s) cargados`);
    setTextAnimated(mCardQtyClasico, cart.clasico || 0);
    setTextAnimated(mCardQtyPollo, cart.pollo || 0);
    setTextAnimated(mSelectComboLabel, pricing.label.toUpperCase());
    setTextAnimated(mSelectSummaryItems, itemsText);
    setTextAnimated(mSelectFinalTotal, `$${pricing.finalPrice.toLocaleString('es-AR')}`);
    setTextAnimated(mCartComboLabel, pricing.label.toUpperCase());
    setTextAnimated(mCartSummaryItems, itemsText);
    if (mCartOldTotal) {
      mCartOldTotal.hidden = pricing.savings <= 0;
      if (pricing.savings > 0) {
        setTextAnimated(mCartOldTotal, `$${pricing.oldPrice.toLocaleString('es-AR')}`);
      }
    }
    setTextAnimated(mCartFinalTotal, `$${pricing.finalPrice.toLocaleString('es-AR')}`);
    setTextAnimated(mNextStepLabel, totalUnits > 0 ? `SIGUIENTE · TUS DATOS ($${pricing.finalPrice.toLocaleString('es-AR')})` : 'SIGUIENTE · TUS DATOS');
    setTextAnimated(mSubmitLabel, `ENVIAR POR WHATSAPP ($${pricing.finalPrice.toLocaleString('es-AR')})`);
    setTextAnimated(mStickyCheckoutText, `FINALIZAR (${totalUnits}) · $${pricing.finalPrice.toLocaleString('es-AR')}`);

    if (totalUnits > 0 && mSelectStepStatus) {
      mSelectStepStatus.textContent = '';
    }

    if (mPromoUpsellText && mBtnQuickUpsell) {
      const rem = totalUnits % 5;
      const targetFlavorName = FLAVORS[currentFlavor].shortName;
      if (totalUnits === 0) {
        setTextAnimated(mPromoUpsellText, 'Sumá tu primer Rolo ($6.000) o armá un <strong>Pack x3 ($16.500)</strong>.', true);
        mBtnQuickUpsell.hidden = false;
        mBtnQuickUpsell.textContent = '+1 ROLO';
        mBtnQuickUpsell.setAttribute('aria-label', `Sumar 1 Rolo de ${targetFlavorName}`);
      } else if (rem === 0) {
        setTextAnimated(mPromoUpsellText, `¡<strong>${pricing.label}</strong> activo! Ya ahorrás <strong>$${pricing.savings.toLocaleString('es-AR')}</strong>.`, true);
        mBtnQuickUpsell.hidden = true;
      } else if (rem <= 2) {
        const missing = 3 - rem;
        const unitNoun = missing === 1 ? '1 Rolo' : `${missing} Rolos`;
        const goalText = totalUnits < 3 ? 'el Pack x3 ($5.500 c/u)' : 'sumar otro Trío ($16.500)';
        setTextAnimated(mPromoUpsellText, `¡Te falta${missing === 1 ? '' : 'n'} <strong>${unitNoun}</strong> para ${goalText}!`, true);
        mBtnQuickUpsell.hidden = false;
        mBtnQuickUpsell.textContent = '+1 ROLO';
        mBtnQuickUpsell.setAttribute('aria-label', `Sumar 1 Rolo de ${targetFlavorName} hacia el pack`);
      } else {
        const missing = 5 - rem;
        const unitNoun = missing === 1 ? '1 Rolo' : `${missing} Rolos`;
        const nextPack = totalUnits + missing;
        setTextAnimated(mPromoUpsellText, `¡Te falta${missing === 1 ? '' : 'n'} <strong>${unitNoun}</strong> para el <strong>Pack x${nextPack} ($5.000 c/u)</strong>!`, true);
        mBtnQuickUpsell.hidden = false;
        mBtnQuickUpsell.textContent = '+1 ROLO';
        mBtnQuickUpsell.setAttribute('aria-label', `Sumar 1 Rolo de ${targetFlavorName} para Pack x${nextPack}`);
      }
    }
  }

  function updateFlavorQty(flavorKey, delta) {
    const current = cart[flavorKey] || 0;
    const next = Math.max(0, current + delta);
    cart[flavorKey] = next;
    const actualDelta = next - current;
    if (actualDelta !== 0) {
      spawnCounterDeltaBadge(flavorKey, actualDelta);
    }
    if (delta > 0) selectFlavor(flavorKey, false);
    renderAll();
  }

  // Eventos Desktop: Paso 2 Filas & Steppers [- / +]
  // (Paso 1 Pack Pills son solo indicadores automáticos por tramo)
  desktopFlavorRows.forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.closest('.stepper-btn')) return;
      selectFlavor(row.dataset.desktopFlavor, false);
    });
  });

  document.querySelectorAll('.stepper-btn[data-step]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const delta = btn.dataset.step === 'inc' ? 1 : -1;
      updateFlavorQty(btn.dataset.flavor, delta);
    });
  });

  // Eventos Mobile: Steppers inline + Pantalla 2 (Ver Rolo)
  document.querySelectorAll('.m-btn-preview').forEach(btn => {
    btn.addEventListener('click', () => selectFlavor(btn.dataset.flavor, true));
  });

  document.querySelectorAll('.m-step-btn[data-m-step]').forEach(btn => {
    btn.addEventListener('click', () => {
      const delta = btn.dataset.mStep === 'inc' ? 1 : -1;
      updateFlavorQty(btn.dataset.flavor, delta);
    });
  });

  const mSwitchFlavorQuick = document.getElementById('mSwitchFlavorQuick');
  if (mSwitchFlavorQuick) {
    mSwitchFlavorQuick.addEventListener('click', () => {
      selectFlavor(currentFlavor === 'clasico' ? 'pollo' : 'clasico', false);
    });
  }

  const mBtnBackToCatalog = document.getElementById('mBtnBackToCatalog');
  if (mBtnBackToCatalog) {
    mBtnBackToCatalog.addEventListener('click', () => {
      activateMobileScreen('catalog');
      const section = document.getElementById('app-neobrutalista');
      if (section) section.scrollIntoView({ behavior: getScrollBehavior() });
    });
  }

  const mBtnAddSelected = document.getElementById('mBtnAddSelected');
  if (mBtnAddSelected) {
    mBtnAddSelected.addEventListener('click', () => {
      updateFlavorQty(currentFlavor, 1);
      activateMobileScreen('catalog');
      const section = document.getElementById('app-neobrutalista');
      if (section) section.scrollIntoView({ behavior: getScrollBehavior() });
    });
  }

  const mBtnClearCart = document.getElementById('mBtnClearCart');
  if (mBtnClearCart) {
    mBtnClearCart.addEventListener('click', () => {
      cart.clasico = 0;
      cart.pollo = 0;
      setMobileOrderStep('select');
      renderAll();
    });
  }

  if (mBtnQuickUpsell) {
    mBtnQuickUpsell.addEventListener('click', () => {
      updateFlavorQty(currentFlavor, 1);
    });
  }

  // =========================================================================
  // 6. Mobile Navegación Inferior + Slide Selector/Checkout
  // =========================================================================
  const mobileFrames = document.querySelectorAll('.sepidy-phone-frame');
  const mobileDockBtns = document.querySelectorAll('.mobile-sticky-dock [data-mobile-tab]');
  const mStickyGoCheckout = document.getElementById('mStickyGoCheckout');
  const mOrderStage = document.getElementById('mOrderStage');
  const mStepSelect = document.getElementById('mStepSelect');
  const mStepCheckout = document.getElementById('mStepCheckout');
  const mBtnNextToCheckout = document.getElementById('mBtnNextToCheckout');
  const mBtnBackToSelect = document.getElementById('mBtnBackToSelect');

  function getScrollBehavior() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  }

  function setMobileOrderStep(stepName) {
    if (!mOrderStage) return;
    const isCheckout = stepName === 'checkout';
    mOrderStage.dataset.mobileStep = isCheckout ? 'checkout' : 'select';

    if (mStepSelect) {
      mStepSelect.inert = isCheckout;
      mStepSelect.setAttribute('aria-hidden', String(isCheckout));
    }
    if (mStepCheckout) {
      mStepCheckout.inert = !isCheckout;
      mStepCheckout.setAttribute('aria-hidden', String(!isCheckout));
    }
  }

  function goToMobileCheckout() {
    if (getTotalUnits() <= 0) {
      if (mSelectStepStatus) {
        mSelectStepStatus.textContent = 'Sumá al menos 1 Rolo arriba para pasar a tus datos.';
      }
      document.querySelector('.m-inline-stepper .m-step-btn[data-m-step="inc"]')?.focus();
      return;
    }
    if (mSelectStepStatus) mSelectStepStatus.textContent = '';
    activateMobileScreen('catalog');
    setMobileOrderStep('checkout');
    const section = document.getElementById('app-neobrutalista');
    if (section) section.scrollIntoView({ behavior: getScrollBehavior(), block: 'start' });
  }

  function activateMobileScreen(screenName) {
    mobileFrames.forEach(frame => {
      if (frame.dataset.screen === screenName) {
        frame.removeAttribute('hidden');
      } else {
        frame.setAttribute('hidden', '');
      }
    });

    mobileDockBtns.forEach(btn => {
      btn.setAttribute('aria-pressed', String(btn.dataset.mobileTab === screenName));
    });
  }

  mobileDockBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activateMobileScreen(btn.dataset.mobileTab);
      if (btn.dataset.mobileTab === 'catalog') {
        setMobileOrderStep('select');
      }
      const section = document.getElementById('app-neobrutalista');
      if (section) section.scrollIntoView({ behavior: getScrollBehavior() });
    });
  });

  if (mBtnNextToCheckout) {
    mBtnNextToCheckout.addEventListener('click', goToMobileCheckout);
  }

  if (mBtnBackToSelect) {
    mBtnBackToSelect.addEventListener('click', () => {
      setMobileOrderStep('select');
      const section = document.getElementById('app-neobrutalista');
      if (section) section.scrollIntoView({ behavior: getScrollBehavior(), block: 'start' });
    });
  }

  if (mStickyGoCheckout) {
    mStickyGoCheckout.addEventListener('click', goToMobileCheckout);
  }

  // =========================================================================
  // 8. Validación Accesible de Formularios y Envío por WhatsApp
  // =========================================================================
  const formErrorAnnouncer = document.createElement('div');
  formErrorAnnouncer.setAttribute('aria-live', 'polite');
  formErrorAnnouncer.className = 'visually-hidden';
  document.body.appendChild(formErrorAnnouncer);
  let formAnnounceTimer;

  function linkFieldError(inputEl, shown) {
    const errorId = inputEl.dataset.error;
    if (!errorId) return;
    const ids = (inputEl.getAttribute('aria-describedby') || '')
      .split(/\s+/)
      .filter((id) => id && id !== errorId);
    if (shown) ids.push(errorId);
    if (ids.length) {
      inputEl.setAttribute('aria-describedby', ids.join(' '));
    } else {
      inputEl.removeAttribute('aria-describedby');
    }
  }

  function bindCheckoutForm({ formId, nameId, errorId, zoneId, addrFieldId, addrId, addrErrorId, paymentName, statusId }) {
    const form = document.getElementById(formId);
    const nameInput = document.getElementById(nameId);
    const errorEl = document.getElementById(errorId);
    const zoneEl = document.getElementById(zoneId);
    const addrField = document.getElementById(addrFieldId);
    const addrEl = document.getElementById(addrId);
    const addrErrorEl = document.getElementById(addrErrorId);
    const statusEl = document.getElementById(statusId);

    if (!form || !nameInput) return;

    let touched = false;
    let addrTouched = false;
    nameInput.setAttribute('aria-invalid', 'false');
    if (addrEl) addrEl.setAttribute('aria-invalid', 'false');

    function isHomeDelivery() {
      return Boolean(zoneEl && zoneEl.value.toLowerCase().includes('domicilio'));
    }

    function syncAddressField() {
      if (!addrField || !addrEl) return;
      const show = isHomeDelivery();
      addrField.hidden = !show;
      addrEl.required = show;
      if (!show) {
        addrTouched = false;
        addrEl.value = '';
        addrEl.setCustomValidity('');
        addrEl.setAttribute('aria-invalid', 'false');
        if (addrErrorEl) addrErrorEl.textContent = '';
        linkFieldError(addrEl, false);
      }
    }

    function validateRequiredField(inputEl, errNode, msg, fieldLabel, announce = false) {
      if (!inputEl || !inputEl.required) return true;
      const val = inputEl.value.trim();
      if (!val) {
        inputEl.setCustomValidity(msg);
        inputEl.setAttribute('aria-invalid', 'true');
        if (errNode) errNode.textContent = msg;
        linkFieldError(inputEl, true);
        if (announce) {
          clearTimeout(formAnnounceTimer);
          formErrorAnnouncer.textContent = '';
          formAnnounceTimer = setTimeout(() => {
            formErrorAnnouncer.textContent = `${fieldLabel}: ${msg}`;
          }, 300);
        }
        return false;
      }
      inputEl.setCustomValidity('');
      inputEl.setAttribute('aria-invalid', 'false');
      if (errNode) errNode.textContent = '';
      linkFieldError(inputEl, false);
      clearTimeout(formAnnounceTimer);
      formErrorAnnouncer.textContent = '';
      return true;
    }

    function validateNameField(announce = false) {
      return validateRequiredField(
        nameInput,
        errorEl,
        'Ingresá tu nombre para identificar tu pedido.',
        'Nombre',
        announce
      );
    }

    function validateAddrField(announce = false) {
      return validateRequiredField(
        addrEl,
        addrErrorEl,
        'Ingresá tu dirección para el envío a domicilio.',
        'Dirección',
        announce
      );
    }

    nameInput.addEventListener('blur', () => {
      touched = true;
      validateNameField(true);
    });

    nameInput.addEventListener('input', () => {
      if (touched || nameInput.getAttribute('aria-invalid') === 'true') {
        validateNameField(false);
      }
    });

    if (addrEl) {
      addrEl.addEventListener('blur', () => {
        addrTouched = true;
        validateAddrField(true);
      });

      addrEl.addEventListener('input', () => {
        if (addrTouched || addrEl.getAttribute('aria-invalid') === 'true') {
          validateAddrField(false);
        }
      });
    }

    if (zoneEl) {
      zoneEl.addEventListener('change', syncAddressField);
      syncAddressField();
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      touched = true;
      addrTouched = true;

      const totalUnits = getTotalUnits();
      if (totalUnits <= 0) {
        if (statusEl) statusEl.textContent = 'Sumá al menos 1 Rolo de Carne o Pollo antes de enviar.';
        if (formId === 'mobileOrderForm') {
          setMobileOrderStep('select');
          if (mSelectStepStatus) mSelectStepStatus.textContent = 'Sumá al menos 1 Rolo de Carne o Pollo arriba para continuar.';
        }
        const firstStepper = formId === 'desktopOrderForm'
          ? document.querySelector('.desktop-stepper .stepper-btn[data-step="inc"]')
          : document.querySelector('.m-inline-stepper .m-step-btn[data-m-step="inc"]');
        firstStepper?.focus();
        return;
      }

      if (!validateNameField(false)) {
        nameInput.focus();
        return;
      }

      if (!validateAddrField(false)) {
        addrEl?.focus();
        return;
      }

      const pricing = calculatePricing(totalUnits);
      const itemsList = getCartSummaryStrings().join(' + ');
      const name = nameInput.value.trim();
      const zone = zoneEl ? zoneEl.value : 'Santa Fe';
      const delivery = isHomeDelivery();
      const addr = delivery && addrEl ? addrEl.value.trim() : '';
      const paymentRadio = form.querySelector(`input[name="${paymentName}"]:checked`);
      const payment = paymentRadio ? paymentRadio.value : 'Transferencia / Alias';

      const phone = '5493425516258';
      const priceNote = pricing.savings > 0
        ? ` _(Antes $${pricing.oldPrice.toLocaleString('es-AR')})_`
        : '';
      let msg = `¡Hola Rolo's! 🌯 Quiero reservar para el lote de esta semana:\n\n`;
      msg += `👑 *Modalidad:* ${pricing.label}\n`;
      msg += `🌯 *Sabores:* ${itemsList}\n`;
      msg += `💰 *Total:* $${pricing.finalPrice.toLocaleString('es-AR')}${priceNote}\n\n`;
      msg += `👤 *Nombre:* ${name}\n`;
      msg += `📍 *Zona/Retiro:* ${zone}\n`;
      if (addr) msg += `🏠 *Dirección:* ${addr}\n`;
      msg += `💳 *Medio de Pago:* ${payment}\n\n`;
      msg += `¡Cocinar o descansar: el debate ya no existe!`;

      if (statusEl) {
        statusEl.textContent = '¡Listo! Abriendo WhatsApp con el detalle de tu pedido...';
      }

      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    });
  }

  bindCheckoutForm({
    formId: 'desktopOrderForm',
    nameId: 'dClientName',
    errorId: 'dNameError',
    zoneId: 'dClientZone',
    addrFieldId: 'dAddressField',
    addrId: 'dClientAddress',
    addrErrorId: 'dAddrError',
    paymentName: 'd_payment',
    statusId: 'dFormStatus'
  });

  bindCheckoutForm({
    formId: 'mobileOrderForm',
    nameId: 'mClientName',
    errorId: 'mNameError',
    zoneId: 'mClientZone',
    addrFieldId: 'mAddressField',
    addrId: 'mClientAddress',
    addrErrorId: 'mAddrError',
    paymentName: 'm_payment',
    statusId: 'mFormStatus'
  });

  // =========================================================================
  // 9. Reloj Countdown hacia el Cierre del Miércoles 23:59hs
  // =========================================================================
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMins = document.getElementById('cdMins');
  const desktopCountdownText = document.getElementById('desktopCountdownText');

  function updateCountdown() {
    const now = new Date();
    const day = now.getDay();
    let daysUntilWed = (3 - day + 7) % 7;
    if (daysUntilWed === 0 && now.getHours() >= 23) {
      daysUntilWed = 7;
    }
    const target = new Date(now);
    target.setDate(now.getDate() + daysUntilWed);
    target.setHours(23, 59, 59, 0);

    const diffMs = Math.max(0, target - now);
    const totalMinutes = Math.floor(diffMs / 60000);
    const d = String(Math.floor(totalMinutes / (60 * 24))).padStart(2, '0');
    const h = String(Math.floor((totalMinutes % (60 * 24)) / 60)).padStart(2, '0');
    const m = String(totalMinutes % 60).padStart(2, '0');

    setTextAnimated(cdDays, d);
    setTextAnimated(cdHours, h);
    setTextAnimated(cdMins, m);
    setTextAnimated(desktopCountdownText, `${d}d : ${h}h : ${m}m`);
  }

  updateCountdown();
  setInterval(updateCountdown, 30000);

  // =========================================================================
  // 10. Lightbox Nativo <dialog closedby="any"> para Flyers 70s
  // =========================================================================
  const flyerDialog = document.getElementById('flyerDialog');
  const dialogImgSlot = document.getElementById('dialogImgSlot');
  const dialogTitle = document.getElementById('dialogTitle');

  document.querySelectorAll('.nb-flyer-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      if (!flyerDialog) return;
      if (dialogImgSlot) {
        const img = document.createElement('img');
        img.id = 'dialogImg';
        img.src = trigger.dataset.flyerImg;
        img.alt = trigger.dataset.flyerTitle || "Flyer Rolo's Ampliado";
        img.style.cssText = 'width: 100%; border-radius: 14px; border: 2.5px solid var(--nb-black); display: block;';
        dialogImgSlot.replaceChildren(img);
      }
      if (dialogTitle) dialogTitle.textContent = trigger.dataset.flyerTitle;
      flyerDialog.showModal();
    });
  });

  if (flyerDialog) {
    flyerDialog.addEventListener('close', () => {
      dialogImgSlot?.replaceChildren();
    });
  }

  if (flyerDialog && !('closedBy' in HTMLDialogElement.prototype)) {
    const outside = (e, dialog) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    let pressedOutside = false;
    flyerDialog.addEventListener('pointerdown', (e) => {
      pressedOutside = outside(e, flyerDialog);
    });
    flyerDialog.addEventListener('pointerup', (e) => {
      if (pressedOutside && outside(e, flyerDialog)) flyerDialog.close();
    });
  }

  // Inicializar estado y vista inicial
  selectFlavor('clasico', false);
  renderAll();
  const initialRoute = resolveRouteFromHash(window.location.hash);
  applyViewState(initialRoute.view, initialRoute.scrollTarget, true);
  animationsArmed = true;
});
