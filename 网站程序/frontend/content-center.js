(function () {
  const state = {
    data: null
  };

  const CASE_SLOT_LABELS = {
    factory: "厂房案例图",
    store: "门店案例图",
    office: "办公室案例图"
  };

  const PDF_SLOT_LABELS = {
    commercialStartGuide: "开工流程总指引",
    factoryStartChecklist: "厂房开工清单",
    storeOpeningGuide: "门店开业指引",
    officeRenovationGuide: "办公室装修指引",
    casePhotoUploadChecklist: "案例拍摄清单",
    realCaseRecordTemplate: "案例记录模板",
    serviceAgreementTemplate: "服务协议模板",
    clientIntakeFormTemplate: "客户资料收集表",
    delivery199ReviewTemplate: "199初审样张",
    delivery999DateTimeTemplate: "999日期时辰样张",
    delivery2980FullProcessTemplate: "2980完整流程样张"
  };

  function $(id) {
    return document.getElementById(id);
  }

  function showToast(message) {
    const toast = $("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.contentCenterToastTimer);
    window.contentCenterToastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2800);
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function (char) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char];
    });
  }

  async function requestJson(url, options) {
    const response = await fetch(url, options || {});
    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }
    return await response.json();
  }

  async function loadState() {
    const payload = await requestJson("/api/content-center/state");
    state.data = payload.state;
    renderAll();
  }

  function renderSummary() {
    const summary = $("contentCenterSummary");
    const status = $("contentCenterStatus");
    if (!summary || !state.data) return;
    const active = state.data.activeAssets;
    summary.innerHTML = [
      summaryCard("二维码", active.qrImage || "未设置"),
      summaryCard("老师照片", active.teacherImage || "未设置"),
      summaryCard("案例图", [active.cases.factory, active.cases.store, active.cases.office].filter(Boolean).length + " / 3 已设置"),
      summaryCard("PDF资料", Object.values(active.pdfs || {}).filter(Boolean).length + " 项已绑定"),
      summaryCard("联系方式", state.data.contact.footerLine || "未设置")
    ].join("");
    if (status) {
      status.textContent = "当前已加载内容中心状态，修改后保存即可影响前台显示。";
    }
  }

  function summaryCard(label, value) {
    return '<div class="crm-stat"><strong>' + escapeHtml(value) + '</strong><span>' + escapeHtml(label) + '</span></div>';
  }

  function renderCurrentImageCard(containerId, label, url, fileName) {
    const container = $(containerId);
    if (!container) return;
    if (!fileName) {
      container.innerHTML = '<div class="content-empty">当前未设置' + escapeHtml(label) + '</div>';
      return;
    }
    container.innerHTML = '' +
      '<div class="content-active-card">' +
      '<div class="content-image-preview">' +
      '<img src="' + escapeHtml(url) + '" alt="' + escapeHtml(label) + '">' +
      '</div>' +
      '<div class="content-meta"><strong>当前使用</strong><span>' + escapeHtml(fileName) + '</span></div>' +
      '</div>';
  }

  function renderLibrary(containerId, files, kind, currentFile, slot) {
    const container = $(containerId);
    if (!container) return;
    if (!files.length) {
      container.innerHTML = '<div class="content-empty">素材库还没有文件</div>';
      return;
    }
    container.innerHTML = files.map(function (file) {
      const isActive = file.fileName === currentFile;
      const activateText = kind === "case"
        ? "设为" + escapeHtml(CASE_SLOT_LABELS[slot] || "当前案例")
        : kind === "pdf"
          ? "绑定到当前资料位"
          : "设为当前使用";
      return '' +
        '<div class="content-library-item">' +
        (kind === "pdf"
          ? '<div class="content-file-badge">PDF</div>'
          : '<div class="content-library-thumb"><img src="' + escapeHtml(file.url) + '" alt="' + escapeHtml(file.fileName) + '"></div>') +
        '<div class="content-library-body">' +
        '<strong>' + escapeHtml(file.fileName) + '</strong>' +
        '<span>' + escapeHtml(file.updatedAt.replace("T", " ").slice(0, 16)) + '</span>' +
        '</div>' +
        (isActive
          ? '<span class="status-pill status-won">当前使用中</span>'
          : '<button class="btn btn-outline btn-small activate-file-btn" data-kind="' + escapeHtml(kind) + '" data-file-name="' + escapeHtml(file.fileName) + '"' + (slot ? ' data-slot="' + escapeHtml(slot) + '"' : "") + '>' + activateText + '</button>') +
        '</div>';
    }).join("");
  }

  function renderCaseSlots() {
    const wrap = $("caseSlots");
    if (!wrap || !state.data) return;
    const active = state.data.activeAssets.cases || {};
    const files = state.data.files.cases || [];
    wrap.innerHTML = Object.keys(CASE_SLOT_LABELS).map(function (slot) {
      const currentFile = active[slot] || "";
      const currentUrl = currentFile ? '/content-media/case-images/' + encodeURIComponent(currentFile) : "";
      return '' +
        '<div class="content-slot-card">' +
        '<h3>' + escapeHtml(CASE_SLOT_LABELS[slot]) + '</h3>' +
        (currentFile
          ? '<div class="content-image-preview compact"><img src="' + escapeHtml(currentUrl) + '" alt="' + escapeHtml(CASE_SLOT_LABELS[slot]) + '"></div><p class="content-slot-file">' + escapeHtml(currentFile) + '</p>'
          : '<div class="content-empty">当前未设置</div>') +
        '<div class="content-library embedded" id="caseLibrary-' + escapeHtml(slot) + '"></div>' +
        '</div>';
    }).join("");
    Object.keys(CASE_SLOT_LABELS).forEach(function (slot) {
      renderLibrary('caseLibrary-' + slot, files, "case", active[slot] || "", slot);
    });
  }

  function renderPdfSlots() {
    const wrap = $("pdfSlots");
    if (!wrap || !state.data) return;
    const active = state.data.activeAssets.pdfs || {};
    const files = state.data.files.pdfs || [];
    wrap.innerHTML = Object.keys(PDF_SLOT_LABELS).map(function (slot) {
      const currentFile = active[slot] || "";
      return '' +
        '<div class="content-slot-card">' +
        '<h3>' + escapeHtml(PDF_SLOT_LABELS[slot]) + '</h3>' +
        '<p class="content-slot-file">' + escapeHtml(currentFile || "当前未绑定") + '</p>' +
        '<div class="content-library embedded" id="pdfLibrary-' + escapeHtml(slot) + '"></div>' +
        '</div>';
    }).join("");
    Object.keys(PDF_SLOT_LABELS).forEach(function (slot) {
      renderLibrary('pdfLibrary-' + slot, files, "pdf", active[slot] || "", slot);
    });
  }

  function renderForms() {
    if (!state.data) return;
    fillForm($("contactSettingsForm"), state.data.contact);
    fillForm($("teacherSettingsForm"), state.data.teacherProfile);
  }

  function fillForm(form, values) {
    if (!form) return;
    Object.keys(values || {}).forEach(function (key) {
      const field = form.elements.namedItem(key);
      if (field) field.value = values[key] || "";
    });
  }

  function renderAll() {
    if (!state.data) return;
    renderSummary();
    renderCurrentImageCard("qrCurrentCard", "二维码", state.data.publicUrls.qrImage, state.data.activeAssets.qrImage);
    renderCurrentImageCard("teacherCurrentCard", "老师照片", state.data.publicUrls.teacherImage, state.data.activeAssets.teacherImage);
    renderLibrary("qrLibrary", state.data.files.qr || [], "qr", state.data.activeAssets.qrImage);
    renderLibrary("teacherLibrary", state.data.files.teacher || [], "teacher", state.data.activeAssets.teacherImage);
    renderLibrary("caseLibrary", state.data.files.cases || [], "case", "", "");
    renderLibrary("pdfLibrary", state.data.files.pdfs || [], "pdf", "", "");
    renderCaseSlots();
    renderPdfSlots();
    renderForms();
    bindDynamicActions();
  }

  function bindDynamicActions() {
    document.querySelectorAll(".activate-file-btn").forEach(function (button) {
      button.onclick = async function () {
        const payload = {
          kind: button.getAttribute("data-kind"),
          slot: button.getAttribute("data-slot") || "",
          fileName: button.getAttribute("data-file-name")
        };
        try {
          await requestJson("/api/content-center/activate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          showToast("已切换当前使用内容");
          await loadState();
        } catch (error) {
          showToast("切换失败，请稍后重试");
        }
      };
    });
  }

  async function handleUpload(form) {
    const fileInput = form.querySelector('input[type="file"]');
    const file = fileInput && fileInput.files ? fileInput.files[0] : null;
    if (!file) {
      showToast("请先选择文件");
      return;
    }
    const formData = new FormData();
    formData.append("kind", form.getAttribute("data-kind"));
    formData.append("file", file);
    try {
      await requestJson("/api/content-center/upload", {
        method: "POST",
        body: formData
      });
      form.reset();
      showToast("文件已上传，请决定是否启用");
      await loadState();
    } catch (error) {
      showToast("上传失败，请确认文件类型和大小");
    }
  }

  async function handleTextSave(form, endpoint) {
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      await requestJson(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      showToast("设置已保存");
      await loadState();
    } catch (error) {
      showToast("保存失败，请稍后重试");
    }
  }

  document.querySelectorAll(".content-upload-form").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      handleUpload(form);
    });
  });

  const contactForm = $("contactSettingsForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      handleTextSave(contactForm, "/api/content-center/text/contact");
    });
  }

  const teacherForm = $("teacherSettingsForm");
  if (teacherForm) {
    teacherForm.addEventListener("submit", function (event) {
      event.preventDefault();
      handleTextSave(teacherForm, "/api/content-center/text/teacher");
    });
  }

  loadState().catch(function () {
    const status = $("contentCenterStatus");
    if (status) status.textContent = "内容中心暂时无法读取，请确认网站服务已启动。";
  });
})();
