/**
 * ==========================================================================
 * ESTUDIO JURÍDICO TABBIA - POSADAS, MISIONES
 * Luxury Client Experience & Legal Tech Tools Engine
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initSmoothScroll();
  initScrollReveal();
  initHeroTilt();
  initToolsTabs();
  initLaborCalculator();
  initCaseWizard();
  initFaqAccordion();
  initGuidesModal();
  initContactForm();
});

/**
 * 1. Sticky Navigation with Glass Blur & Scroll Progress
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/**
 * 2. Mobile Menu Drawer
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const closeBtn = document.querySelector('.mobile-nav-close');
  const backdrop = document.querySelector('.mobile-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('show');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/**
 * 3. Smooth Scroll and Active Navigation Highlight
 */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 160;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/**
 * Luxury Scroll Reveal via IntersectionObserver
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.practice-card, .method-step, .testimonial-card, .faq-item, .about-grid, .calculator-card, .wizard-card, .guide-card, .contact-grid');

  revealElements.forEach((el, index) => {
    el.classList.add('reveal');
    if (index % 3 === 1) el.classList.add('reveal-delay-1');
    if (index % 3 === 2) el.classList.add('reveal-delay-2');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/**
 * 4. Interactive 3D Card Tilt for Lawyer Frame & Floating Cards
 */
function initHeroTilt() {
  const frame = document.querySelector('.lawyer-frame');
  const wrapper = document.querySelector('.hero-image-wrapper');
  if (!frame || !wrapper) return;

  // Only tilt on desktop devices with hover support
  if (window.matchMedia('(hover: hover)').matches) {
    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      frame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    wrapper.addEventListener('mouseleave', () => {
      frame.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      frame.style.transition = 'transform 0.5s ease';
    });

    wrapper.addEventListener('mouseenter', () => {
      frame.style.transition = 'none';
    });
  }
}

/**
 * 5. Tools Tabs Switching (Calculadora, Evaluador, Guías)
 */
function initToolsTabs() {
  const tabButtons = document.querySelectorAll('.tool-tab-btn');
  const panels = document.querySelectorAll('.tool-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tool-target');

      tabButtons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/**
 * 6. Calculadora de Indemnización Laboral (Ley de Contrato de Trabajo N° 20.744)
 */
function initLaborCalculator() {
  const salaryInput = document.getElementById('calc-salary');
  const yearsInput = document.getElementById('calc-years');
  const noticeSelect = document.getElementById('calc-notice');
  const calculateBtn = document.getElementById('btn-calculate-labor');
  const whatsappCalcBtn = document.getElementById('btn-calc-whatsapp');

  if (!calculateBtn) return;

  function calculate() {
    const salary = parseFloat(salaryInput.value) || 0;
    const years = parseInt(yearsInput.value) || 0;
    const noticeType = noticeSelect.value;

    if (salary <= 0 || years <= 0) {
      showToast('Por favor ingrese el sueldo y los años trabajados');
      return;
    }

    // Art. 245 LCT: 1 mes de sueldo por cada año de servicio o fracción mayor a 3 meses
    const indemnity245 = salary * years;

    // Art. 231/232 LCT (Falta de Preaviso):
    // Si antigüedad < 5 años: 1 mes; si >= 5 años: 2 meses (si no fue otorgado)
    let preaviso = 0;
    if (noticeType === 'sin-preaviso') {
      preaviso = years >= 5 ? salary * 2 : salary * 1;
    }

    // SAC sobre preaviso (1/12)
    const sacPreaviso = preaviso > 0 ? preaviso / 12 : 0;

    // Integración de mes de despido estimado promedio
    const integracionMes = noticeType === 'sin-preaviso' ? salary * 0.5 : 0;

    // Vacaciones proporcionales y SAC estimativo
    const liquidacionFinal = salary * 0.4;

    const totalEstimado = indemnity245 + preaviso + sacPreaviso + integracionMes + liquidacionFinal;

    // Formatter
    const fmt = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

    document.getElementById('res-total').textContent = fmt.format(totalEstimado);
    document.getElementById('res-art245').textContent = fmt.format(indemnity245);
    document.getElementById('res-preaviso').textContent = fmt.format(preaviso + sacPreaviso);
    document.getElementById('res-integracion').textContent = fmt.format(integracionMes);
    document.getElementById('res-liquidacion').textContent = fmt.format(liquidacionFinal);

    // Update WhatsApp Consultation link with calculated parameters
    if (whatsappCalcBtn) {
      const msg = encodeURIComponent(
        `Hola Dr. Daniel Tabbia. Calculé una indemnización laboral en su plataforma web con los siguientes datos:\n` +
        `• Mejor Sueldo: ${fmt.format(salary)}\n` +
        `• Antigüedad: ${years} año(s)\n` +
        `• Preaviso: ${noticeType === 'sin-preaviso' ? 'No otorgado' : 'Otorgado'}\n` +
        `• Total Estimado: ${fmt.format(totalEstimado)}\n` +
        `Quisiera coordinar una consulta legal en Posadas para auditar mi caso.`
      );
      whatsappCalcBtn.href = `https://wa.me/5493764428900?text=${msg}`;
    }
  }

  calculateBtn.addEventListener('click', calculate);
  // Initial calculate
  calculate();
}

/**
 * 7. Evaluador Express de Viabilidad de Casos (Wizard)
 */
function initCaseWizard() {
  let currentStep = 1;
  const wizardAnswers = {
    area: '',
    time: '',
    docs: ''
  };

  const steps = [
    document.getElementById('wizard-step-1'),
    document.getElementById('wizard-step-2'),
    document.getElementById('wizard-step-3'),
    document.getElementById('wizard-step-result')
  ];

  const nodes = document.querySelectorAll('.wizard-step-node');

  function goToStep(step) {
    steps.forEach((s, idx) => {
      if (s) s.style.display = (idx + 1 === step) ? 'block' : 'none';
    });

    nodes.forEach((node, idx) => {
      node.classList.remove('active', 'completed');
      if (idx + 1 === step) {
        node.classList.add('active');
      } else if (idx + 1 < step) {
        node.classList.add('completed');
      }
    });

    currentStep = step;
    if (step === 4) {
      renderWizardResult();
    }
  }

  // Handle options click in steps
  document.querySelectorAll('.wizard-option-card').forEach(card => {
    card.addEventListener('click', () => {
      const parentStep = card.closest('.wizard-step');
      const stepIndex = parseInt(parentStep.getAttribute('data-step'));
      const value = card.getAttribute('data-value');

      // Unselect siblings
      parentStep.querySelectorAll('.wizard-option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      if (stepIndex === 1) wizardAnswers.area = value;
      if (stepIndex === 2) wizardAnswers.time = value;
      if (stepIndex === 3) wizardAnswers.docs = value;

      // Small delay for smooth perception
      setTimeout(() => {
        goToStep(stepIndex + 1);
      }, 220);
    });
  });

  // Reset wizard button
  const resetBtn = document.getElementById('btn-wizard-restart');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      wizardAnswers.area = '';
      wizardAnswers.time = '';
      wizardAnswers.docs = '';
      document.querySelectorAll('.wizard-option-card').forEach(c => c.classList.remove('selected'));
      goToStep(1);
    });
  }

  function renderWizardResult() {
    const verdictTitle = document.getElementById('wizard-verdict-title');
    const verdictDesc = document.getElementById('wizard-verdict-desc');
    const whatsappAction = document.getElementById('btn-wizard-whatsapp');

    let viability = 'ALTA VIABILIDAD JURÍDICA';
    let urgencyText = 'Su situación se encuentra dentro de los plazos legales óptimos de prescripción en la Provincia de Misiones. Resulta fundamental preservar las pruebas y no firmar ningún acuerdo sin patrocinio letrado.';

    if (wizardAnswers.time === 'mas-2-anios') {
      viability = 'REQUIERE EVALUACIÓN DE PRESCRIPCIÓN INMEDIATA';
      urgencyText = 'Al haber transcurrido más de 2 años, es imperativo analizar si operó la prescripción liberatoria según el Código Civil y Comercial o la LCT, o si existieron actos interruptivos.';
    }

    if (verdictTitle) verdictTitle.textContent = viability;
    if (verdictDesc) verdictDesc.textContent = urgencyText;

    if (whatsappAction) {
      const message = encodeURIComponent(
        `Hola Dr. Daniel Tabbia. Realicé el test de viabilidad de mi caso en su web:\n` +
        `• Materia: ${wizardAnswers.area}\n` +
        `• Tiempo transcurrido: ${wizardAnswers.time}\n` +
        `• Documentación: ${wizardAnswers.docs}\n` +
        `• Diagnóstico: ${viability}\n` +
        `Deseo coordinar una consulta para avanzar formalmente.`
      );
      whatsappAction.href = `https://wa.me/5493764428900?text=${message}`;
    }
  }
}

/**
 * 8. FAQ Accordion
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(i => i.classList.remove('active'));

      // If wasn't active, activate it
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/**
 * 9. Practical Legal Guides Modal
 */
const guideContents = {
  sucesiones: {
    title: 'Guía Completa de Sucesiones en Posadas y Misiones',
    content: `
      <p><strong>1. ¿Dónde se inicia el trámite?</strong><br>
      Ante los Juzgados de Primera Instancia en lo Civil y Comercial de la Primera Circunscripción Judicial de Posadas (Palacio de Justicia, Av. Santa Catalina).</p>
      
      <p><strong>2. Documentación inicial necesaria:</strong><br>
      • Partida de defunción original debidamente legalizada.<br>
      • Partidas de nacimiento de los herederos y/o libreta de matrimonio.<br>
      • Títulos de propiedad de los inmuebles, vehículos o títulos de marcas/yerbales.<br>
      • DNI de los herederos intervinientes.</p>

      <p><strong>3. Etapas procesales clave:</strong><br>
      • Publicación de edictos en el Boletín Oficial de Misiones por 30 días para citar acreedores y otros herederos.<br>
      • Declaratoria de Herederos emitida por el Juez.<br>
      • Denuncia de bienes, valuación fiscal (Dirección General de Rentas de Misiones - DGR) y pago de tasa de justicia.<br>
      • Partición o inscripción directa por tracto abreviado ante el Registro de la Propiedad Inmueble de Misiones.</p>

      <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(212,175,55,0.1); border-left: 3px solid #d4af37; border-radius: 4px;">
        <p style="font-size: 0.88rem; color: #fff; margin: 0;"><strong>Recomendación del Dr. Tabbia:</strong> Si hay acuerdo unánime entre los herederos, el trámite se agiliza drásticamente mediante el sistema digital SIGED de Misiones.</p>
      </div>
    `
  },
  despidos: {
    title: 'Protocolo de Acción ante Despido o Accidente ART',
    content: `
      <p><strong>1. ¿Recibió una Carta Documento de despido?</strong><br>
      NO firme la copia del cartero sin antes leerla. Conserve el duplicado con fecha y sello de imposición exactos. Tiene un plazo legal de 48 horas hábiles para rechazar los términos mediante Telegrama Laboral Gratuito (Ley 23.789).</p>

      <p><strong>2. ¿Qué reclamar si el despido fue injustificado?</strong><br>
      • Indemnización por antigüedad (Art. 245 LCT).<br>
      • Indemnización sustitutiva de preaviso e integración del mes de despido.<br>
      • Días trabajados del mes, SAC proporcional y vacaciones no gozadas.<br>
      • Multas por falta de entrega de certificados de trabajo (Art. 80 LCT) o por registro deficiente de fecha de ingreso / sueldo real.</p>

      <p><strong>3. En caso de Accidente de Trabajo o In itinere:</strong><br>
      Exija la denuncia inmediata ante la aseguradora (ART). Si el alta médica otorgada por la ART es prematura o no le reconocen secuelas incapacitantes, intervenimos ante la Comisión Médica N° 35 de Posadas para obtener la indemnización legal correspondiente.</p>
    `
  },
  tierras: {
    title: 'Checklist para Contratos Inmobiliarios y Agrarios en Misiones',
    content: `
      <p><strong>1. Estudio de Títulos y Estado Dominial:</strong><br>
      Antes de señar o firmar boleto, requerimos informe de dominio e inhibición ante el Registro de la Propiedad Inmueble de Misiones para descartar embargos, hipotecas o quiebras del vendedor.</p>

      <p><strong>2. Zonificación y Catastro Provincial:</strong><br>
      Verificación de planos de mensura aprobados por la Dirección Provincial de Catastro y regularidad de linderos, especialmente en lotes suburbanos y chacras de la provincia.</p>

      <p><strong>3. Contratos Forestales, Yerbateros y Arrendamientos:</strong><br>
      Redacción de cláusulas sólidas de precio fijado en kilos de hoja verde o metros cúbicos de madera, índices de ajuste, plazo de explotación y garantías reales de cumplimiento.</p>
    `
  }
};

function initGuidesModal() {
  const modal = document.getElementById('guide-modal');
  const modalTitle = document.getElementById('modal-guide-title');
  const modalBody = document.getElementById('modal-guide-body');
  const modalClose = document.getElementById('modal-guide-close');

  if (!modal) return;

  document.querySelectorAll('.btn-open-guide').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const guideKey = btn.getAttribute('data-guide');
      const data = guideContents[guideKey];

      if (data) {
        modalTitle.textContent = data.title;
        modalBody.innerHTML = data.content;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/**
 * 10. Contact Form with Interactive Feedback & WhatsApp Sync
 */
function initContactForm() {
  const form = document.getElementById('consultation-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const phone = document.getElementById('form-phone').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const area = document.getElementById('form-area').value;
    const mode = document.getElementById('form-mode').value;
    const notes = document.getElementById('form-notes').value.trim();

    if (!name || !phone || !area) {
      showToast('Por favor complete los campos obligatorios (*)');
      return;
    }

    // Build WhatsApp message
    const msg = encodeURIComponent(
      `*SOLICITUD DE CONSULTA LEGAL - ESTUDIO TABBIA*\n\n` +
      `👤 *Cliente:* ${name}\n` +
      `📱 *Teléfono:* ${phone}\n` +
      `✉️ *Email:* ${email || 'No especificado'}\n` +
      `⚖️ *Área Jurídica:* ${area}\n` +
      `🏢 *Modalidad Deseada:* ${mode}\n` +
      `📝 *Breve Resumen:* ${notes || 'Consulta directa'}\n\n` +
      `_Enviado desde el portal web oficial en Posadas, Misiones._`
    );

    showToast('¡Redirigiendo a WhatsApp con el Dr. Daniel Tabbia!');

    setTimeout(() => {
      window.open(`https://wa.me/5493764428900?text=${msg}`, '_blank');
      form.reset();
    }, 900);
  });
}

/**
 * Toast Notification Utility
 */
function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #d4af37;"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
