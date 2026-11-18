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
      if (viewName === 'menu') activateMobileScreen('catalog');
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
  // 3. Motor de Precios Oficial de Octubre (1x $5000 | 3x $13500 | 5x $21000)
  // =========================================================================
  function calculatePricing(totalUnits) {
    if (totalUnits <= 0) {
      return { finalPrice: 0, oldPrice: 0, label: 'SIN ROLO SELECCIONADO', savings: 0 };
    }

    let rem = totalUnits;
    let finalPrice = 0;
    let oldPrice = 0;

    const packs5 = Math.floor(rem / 5);
    finalPrice += packs5 * 21000;
    oldPrice += packs5 * 25000;
    rem %= 5;

    const packs3 = Math.floor(rem / 3);
    finalPrice += packs3 * 13500;
    oldPrice += packs3 * 16500;
    rem %= 3;

    finalPrice += rem * 5000;
    oldPrice += rem * 6000;

    let label = `${totalUnits} Rolo(s) Individual`;
    if (totalUnits >= 5 && totalUnits % 5 === 0) {
      label = `Pack x${totalUnits} "Semana Resuelta"`;
    } else if (totalUnits >= 3 && totalUnits % 3 === 0) {
      label = `Pack x${totalUnits} "Trío de Turno"`;
    } else if (totalUnits > 1) {
      label = `Combo x${totalUnits} Rolos`;
    }

    return { finalPrice, oldPrice, label, savings: oldPrice - finalPrice };
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
  const desktopStickerImg = document.getElementById('desktopStickerImg');
  const desktopShowcaseImg = document.getElementById('desktopShowcaseImg');
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

  function selectFlavor(flavorKey, switchMobileToLote = false) {
    const f = FLAVORS[flavorKey];
    if (!f) return;
    currentFlavor = flavorKey;

    // Desktop sync
    swapImageSmooth(desktopShowcaseImg, f.img);
    if (desktopStickerImg) desktopStickerImg.src = f.img;
    if (desktopShowcaseTitle) desktopShowcaseTitle.textContent = f.name;
    if (desktopShowcaseSpeech) desktopShowcaseSpeech.textContent = f.speech;
    if (desktopShowcaseIngredients) {
      desktopShowcaseIngredients.innerHTML = `<strong>340g reales:</strong> ${f.ingredients}`;
    }

    desktopFlavorRows.forEach(row => {
      row.classList.toggle('active-flavor', row.dataset.desktopFlavor === flavorKey);
    });

    // Mobile sync
    swapImageSmooth(mShowcaseImg, f.img);
    if (mHeaderAvatar1) mHeaderAvatar1.src = f.img;
    if (mLiveAvatarTop) mLiveAvatarTop.src = f.img;
    if (mLiveHeaderName) mLiveHeaderName.textContent = f.shortName;
    if (mLiveHeaderHandle) mLiveHeaderHandle.textContent = f.handle;
    if (mShowcaseSpeech) mShowcaseSpeech.textContent = f.speech;
    if (mShowcaseIngredients) {
      mShowcaseIngredients.innerHTML = `<strong>Ingredientes (340g):</strong> ${f.ingredients}`;
    }

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
  const mCardQtyClasico = document.getElementById('mCardQtyClasico');
  const mCardQtyPollo = document.getElementById('mCardQtyPollo');
  const mPromoUpsellText = document.getElementById('mPromoUpsellText');
  const mBtnQuickUpsell = document.getElementById('mBtnQuickUpsell');
  const mCartComboLabel = document.getElementById('mCartComboLabel');
  const mCartSummaryItems = document.getElementById('mCartSummaryItems');
  const mCartOldTotal = document.getElementById('mCartOldTotal');
  const mCartFinalTotal = document.getElementById('mCartFinalTotal');
  const mSubmitLabel = document.getElementById('mSubmitLabel');
  const mStickyCheckoutText = document.getElementById('mStickyCheckoutText');

  function renderAll() {
    const totalUnits = getTotalUnits();
    const pricing = calculatePricing(totalUnits);
    const itemsArr = getCartSummaryStrings();
    const itemsText = itemsArr.length ? itemsArr.join(' + ') : 'Elegí al menos 1 Rolo';

    // 1) Desktop UI
    if (desktopQtyClasico) desktopQtyClasico.textContent = cart.clasico || 0;
    if (desktopQtyPollo) desktopQtyPollo.textContent = cart.pollo || 0;

    desktopPackPills.forEach(btn => {
      const packSize = parseInt(btn.dataset.desktopPack, 10);
      btn.classList.toggle('active', totalUnits === packSize);
    });

    if (desktopPromoNudge) {
      if (totalUnits === 0) {
        desktopPromoNudge.innerHTML = `<i class="fas fa-hand-point-up"></i><span>Sumá al menos 1 Rolo de Carne o Pollo arriba para preparar tu pedido.</span>`;
      } else if (totalUnits === 1 || totalUnits === 2) {
        const missing = 3 - totalUnits;
        desktopPromoNudge.innerHTML = `<i class="fas fa-tag"></i><span>¡Estás llevando ${totalUnits} Rolo(s)! Sumá <strong>${missing} más</strong> y activás el <strong>Pack x3 a $13.500</strong> ($4.500 c/u).</span>`;
      } else if (totalUnits === 3 || totalUnits === 4) {
        const missing = 5 - totalUnits;
        desktopPromoNudge.innerHTML = `<i class="fas fa-fire"></i><span>¡Descuento Trío activado! Sumá <strong>${missing} Rolo(s) más</strong> para pasar al <strong>Pack x5 a $21.000</strong> ($4.200 c/u).</span>`;
      } else {
        desktopPromoNudge.innerHTML = `<i class="fas fa-bolt"></i><span>¡${pricing.label} activado! Estás ahorrando <strong>$${pricing.savings.toLocaleString('es-AR')}</strong> con precios de lanzamiento.</span>`;
      }
    }

    if (desktopTicketTitle) desktopTicketTitle.textContent = pricing.label;
    if (desktopTicketItems) desktopTicketItems.textContent = itemsText;
    if (desktopTicketOld) desktopTicketOld.textContent = `$${pricing.oldPrice.toLocaleString('es-AR')}`;
    if (desktopTicketFinal) desktopTicketFinal.textContent = `$${pricing.finalPrice.toLocaleString('es-AR')}`;
    if (dSubmitLabel) dSubmitLabel.textContent = `ENVIAR PEDIDO ($${pricing.finalPrice.toLocaleString('es-AR')})`;

    // 2) Mobile UI (Vista 1 combinada)
    if (mCartBadgeHandle) mCartBadgeHandle.textContent = `${totalUnits} Rolo(s) cargados`;
    if (mCardQtyClasico) mCardQtyClasico.textContent = cart.clasico || 0;
    if (mCardQtyPollo) mCardQtyPollo.textContent = cart.pollo || 0;
    if (mCartComboLabel) mCartComboLabel.textContent = pricing.label.toUpperCase();
    if (mCartSummaryItems) mCartSummaryItems.textContent = itemsText;
    if (mCartOldTotal) mCartOldTotal.textContent = `$${pricing.oldPrice.toLocaleString('es-AR')}`;
    if (mCartFinalTotal) mCartFinalTotal.textContent = `$${pricing.finalPrice.toLocaleString('es-AR')}`;
    if (mSubmitLabel) mSubmitLabel.textContent = `ENVIAR POR WHATSAPP ($${pricing.finalPrice.toLocaleString('es-AR')})`;
    if (mStickyCheckoutText) mStickyCheckoutText.textContent = `CHECKOUT (${totalUnits}) · $${pricing.finalPrice.toLocaleString('es-AR')}`;

    if (mPromoUpsellText && mBtnQuickUpsell) {
      const rem = totalUnits % 5;
      const targetFlavorName = FLAVORS[currentFlavor].shortName;
      if (totalUnits === 0) {
        mPromoUpsellText.innerHTML = 'Sumá tu primer Rolo o armá un <strong>Pack x3 ($13.500)</strong>.';
        mBtnQuickUpsell.hidden = false;
        mBtnQuickUpsell.textContent = '+1 ROLO';
        mBtnQuickUpsell.setAttribute('aria-label', `Sumar 1 Rolo de ${targetFlavorName}`);
      } else if (rem === 0) {
        mPromoUpsellText.innerHTML = `¡<strong>${pricing.label}</strong> activo! Ya ahorrás <strong>$${pricing.savings.toLocaleString('es-AR')}</strong>.`;
        mBtnQuickUpsell.hidden = true;
      } else if (rem <= 2) {
        const missing = 3 - rem;
        const unitNoun = missing === 1 ? '1 Rolo' : `${missing} Rolos`;
        const goalText = totalUnits < 3 ? 'el Pack x3 ($4.500 c/u)' : 'sumar otro Trío ($13.500)';
        mPromoUpsellText.innerHTML = `¡Te falta${missing === 1 ? '' : 'n'} <strong>${unitNoun}</strong> para ${goalText}!`;
        mBtnQuickUpsell.hidden = false;
        mBtnQuickUpsell.textContent = '+1 ROLO';
        mBtnQuickUpsell.setAttribute('aria-label', `Sumar 1 Rolo de ${targetFlavorName} hacia el pack`);
      } else {
        const missing = 5 - rem;
        const unitNoun = missing === 1 ? '1 Rolo' : `${missing} Rolos`;
        const nextPack = totalUnits + missing;
        mPromoUpsellText.innerHTML = `¡Te falta${missing === 1 ? '' : 'n'} <strong>${unitNoun}</strong> para el <strong>Pack x${nextPack} ($4.200 c/u)</strong>!`;
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
    if (delta > 0) selectFlavor(flavorKey, false);
    renderAll();
  }

  // Eventos Desktop: Paso 1 Pack Pills
  desktopPackPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const size = parseInt(pill.dataset.desktopPack, 10);
      if (size === 1) {
        cart.clasico = 1;
        cart.pollo = 0;
      } else if (size === 3) {
        cart.clasico = 2;
        cart.pollo = 1;
      } else {
        cart.clasico = 3;
        cart.pollo = 2;
      }
      renderAll();
    });
  });

  // Eventos Desktop: Paso 2 Filas & Steppers [- / +]
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
      renderAll();
    });
  }

  if (mBtnQuickUpsell) {
    mBtnQuickUpsell.addEventListener('click', () => {
      updateFlavorQty(currentFlavor, 1);
    });
  }

  // =========================================================================
  // 6. Mobile Buscador + Tabs de Filtro Accesibles (focusgroup + Arrow fallback)
  // =========================================================================
  const mSearchInput = document.getElementById('mSearchInput');
  const mFocusSearchBtn = document.getElementById('mFocusSearchBtn');
  const mFilterTabs = Array.from(document.querySelectorAll('.sepidy-tab-btn[data-m-filter]'));
  const mCatalogPanel = document.getElementById('mCatalogPanel');
  const mFlavorCards = document.querySelectorAll('.sepidy-challenge-item[data-m-card]');
  let activeMobileFilter = 'all';

  if (mFocusSearchBtn && mSearchInput) {
    mFocusSearchBtn.addEventListener('click', () => mSearchInput.focus());
  }

  function applyMobileFilter() {
    const q = (mSearchInput ? mSearchInput.value : '').toLowerCase().trim();
    mFlavorCards.forEach(card => {
      const key = card.dataset.mCard;
      const f = FLAVORS[key];
      const matchTab = activeMobileFilter === 'all' || key === activeMobileFilter;
      const matchSearch = !q || f.name.toLowerCase().includes(q) || f.keywords.includes(q);
      card.style.display = (matchTab && matchSearch) ? 'block' : 'none';
    });
  }

  if (mSearchInput) {
    mSearchInput.addEventListener('input', applyMobileFilter);
  }

  function selectMobileFilterTab(selectedTab) {
    mFilterTabs.forEach(tab => {
      const isSelected = tab === selectedTab;
      tab.setAttribute('aria-selected', String(isSelected));
      tab.toggleAttribute('focusgroupstart', isSelected);
    });
    if (mCatalogPanel) {
      mCatalogPanel.setAttribute('aria-labelledby', selectedTab.id);
    }
    activeMobileFilter = selectedTab.dataset.mFilter;
    selectedTab.scrollIntoView({ block: 'nearest', inline: 'nearest', container: 'nearest' });
    applyMobileFilter();
  }

  mFilterTabs.forEach((tab, idx) => {
    tab.addEventListener('click', () => selectMobileFilterTab(tab));
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const dir = e.key === 'ArrowRight' ? 1 : -1;
        const nextIdx = (idx + dir + mFilterTabs.length) % mFilterTabs.length;
        mFilterTabs[nextIdx].focus();
        selectMobileFilterTab(mFilterTabs[nextIdx]);
      }
    });
  });

  // =========================================================================
  // 7. Mobile Navegación Inferior + Botón Sticky hacia el Checkout
  // =========================================================================
  const mobileFrames = document.querySelectorAll('.sepidy-phone-frame');
  const mobileDockBtns = document.querySelectorAll('.mobile-sticky-dock [data-mobile-tab]');
  const mStickyGoCheckout = document.getElementById('mStickyGoCheckout');
  const mobileCheckoutSection = document.getElementById('mobileCheckoutSection');

  function getScrollBehavior() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
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
      const section = document.getElementById('app-neobrutalista');
      if (section) section.scrollIntoView({ behavior: getScrollBehavior() });
    });
  });

  if (mStickyGoCheckout && mobileCheckoutSection) {
    mStickyGoCheckout.addEventListener('click', () => {
      activateMobileScreen('catalog');
      mobileCheckoutSection.scrollIntoView({ behavior: getScrollBehavior(), block: 'start' });
    });
  }

  // =========================================================================
  // 8. Validación Accesible de Formularios y Envío por WhatsApp
  // =========================================================================
  function bindCheckoutForm({ formId, nameId, errorId, zoneId, addrId, paymentName, statusId }) {
    const form = document.getElementById(formId);
    const nameInput = document.getElementById(nameId);
    const errorEl = document.getElementById(errorId);
    const zoneEl = document.getElementById(zoneId);
    const addrEl = document.getElementById(addrId);
    const statusEl = document.getElementById(statusId);

    if (!form || !nameInput) return;

    let touched = false;

    function validateNameField() {
      const val = nameInput.value.trim();
      if (!val) {
        nameInput.setCustomValidity('Ingresá tu nombre para identificar tu pedido.');
        nameInput.setAttribute('aria-invalid', 'true');
        if (errorEl) errorEl.textContent = 'Ingresá tu nombre para identificar tu pedido.';
        return false;
      }
      nameInput.setCustomValidity('');
      nameInput.removeAttribute('aria-invalid');
      if (errorEl) errorEl.textContent = '';
      return true;
    }

    nameInput.addEventListener('blur', () => {
      touched = true;
      validateNameField();
    });

    nameInput.addEventListener('input', () => {
      if (touched || nameInput.hasAttribute('aria-invalid')) {
        validateNameField();
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      touched = true;

      const totalUnits = getTotalUnits();
      if (totalUnits <= 0) {
        if (statusEl) statusEl.textContent = 'Sumá al menos 1 Rolo de Carne o Pollo antes de enviar.';
        return;
      }

      if (!validateNameField()) {
        nameInput.focus();
        return;
      }

      const pricing = calculatePricing(totalUnits);
      const itemsList = getCartSummaryStrings().join(' + ');
      const name = nameInput.value.trim();
      const zone = zoneEl ? zoneEl.value : 'Santa Fe';
      const addr = addrEl ? addrEl.value.trim() : '';
      const paymentRadio = form.querySelector(`input[name="${paymentName}"]:checked`);
      const payment = paymentRadio ? paymentRadio.value : 'Transferencia / Alias';

      const phone = '5493425516258';
      let msg = `¡Hola Rolo's! 🌯 Quiero reservar para el lote de esta semana:\n\n`;
      msg += `👑 *Modalidad:* ${pricing.label}\n`;
      msg += `🌯 *Sabores:* ${itemsList}\n`;
      msg += `💰 *Total Promo Octubre:* $${pricing.finalPrice.toLocaleString('es-AR')} _(Antes $${pricing.oldPrice.toLocaleString('es-AR')})_\n\n`;
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
    addrId: 'dClientAddress',
    paymentName: 'd_payment',
    statusId: 'dFormStatus'
  });

  bindCheckoutForm({
    formId: 'mobileOrderForm',
    nameId: 'mClientName',
    errorId: 'mNameError',
    zoneId: 'mClientZone',
    addrId: 'mClientAddress',
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

    if (cdDays) cdDays.textContent = d;
    if (cdHours) cdHours.textContent = h;
    if (cdMins) cdMins.textContent = m;
    if (desktopCountdownText) desktopCountdownText.textContent = `${d}d : ${h}h : ${m}m`;
  }

  updateCountdown();
  setInterval(updateCountdown, 30000);

  // =========================================================================
  // 10. Lightbox Nativo <dialog closedby="any"> para Flyers 70s
  // =========================================================================
  const flyerDialog = document.getElementById('flyerDialog');
  const dialogImg = document.getElementById('dialogImg');
  const dialogTitle = document.getElementById('dialogTitle');

  document.querySelectorAll('.nb-flyer-card').forEach(card => {
    card.addEventListener('click', () => {
      if (!flyerDialog) return;
      if (dialogImg) dialogImg.src = card.dataset.flyerImg;
      if (dialogTitle) dialogTitle.textContent = card.dataset.flyerTitle;
      flyerDialog.showModal();
    });
  });

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
});
