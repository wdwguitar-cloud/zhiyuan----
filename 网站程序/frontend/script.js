
(function(){
  const CONFIG = window.KAIGONG_CONFIG || {
    FORM_ENDPOINT: "/api/leads",
    FORM_METHOD: "POST",
    REDIRECT_AFTER_SUBMIT: "thanks.html",
    ENABLE_LOCAL_BACKUP: true,
    ENABLE_COPY_WECHAT_TEXT: true
  };

  const SCRIPT_TEMPLATES = {
    first_reply: {
      title: "首次回复",
      text: `您好，收到您的资料了。

我先帮您确认一下：您这个属于【{projectType}】场景，城市在【{city}】，计划开工时间是【{startTime}】。

这类项目不建议只简单问“哪天好”，最好先把几个关键点确认清楚：
1. 老板或负责人是否到场；
2. 施工方/物业/员工能否配合时间；
3. 开工位置、物品、人员分工是否明确；
4. 是只需要日期时辰，还是需要完整开工流程。

您可以先补充一下：这个项目是装修开工、动土、开业、搬迁，还是施工进场？`
    },
    ask_missing_info: {
      title: "催补资料",
      text: `为了避免只看一个日子但现场执行不了，我需要您再补充 4 个信息：

1. 项目具体类型：厂房/门店/办公室/工地/乔迁？
2. 计划开工时间范围：几天内，还是某个固定日期前后？
3. 老板或负责人当天是否能到场？
4. 施工方、物业或现场负责人是否已经确定能配合？

这几个信息确认后，我才能判断适合做 199 资料初审、999 日期时辰咨询，还是 2980 完整流程方案。`
    },
    intro_199: {
      title: "199 资料初审",
      text: `您这个项目我建议先做【199 元资料初审】。

资料初审不是正式择日，主要帮您先判断：
1. 项目属于哪类开工场景；
2. 资料是否完整；
3. 只做日期时辰是否够用；
4. 是否需要完整开工流程；
5. 后续适合走 999 还是 2980。

如果后面继续做正式方案，199 可以抵扣对应服务费用。这样对您也更稳，不会一上来就做高价方案。`
    },
    intro_999: {
      title: "999 日期时辰咨询",
      text: `如果您这个项目现场比较简单，只需要确认日期和时辰，可以做【999 元日期与时辰咨询】。

包含：
1. 推荐开工日期；
2. 推荐开工时段；
3. 备选时间建议；
4. 基础注意事项；
5. 简要答疑。

适合：项目不复杂、施工方和负责人已经确认、现场流程不需要我详细拆解的情况。`
    },
    intro_2980: {
      title: "2980 完整流程方案",
      text: `您这个项目如果涉及厂房、门店、办公室、施工方、负责人、物品准备和当天流程，我更建议做【2980 元完整开工流程方案】。

它不是只给一个日子，而是包含：
1. 日期与时辰建议；
2. 开工前准备清单；
3. 当天流程安排；
4. 供品/物料建议；
5. 人员分工建议；
6. 现场注意事项；
7. 项目内答疑确认。

这样您拿到后，可以直接转发给老板、负责人、施工方或员工执行，现场会清楚很多。`
    },
    price_objection: {
      title: "客户嫌贵",
      text: `理解，您觉得贵很正常。

如果只是随便查一个黄历日子，确实不需要这个费用。但商业开工比较麻烦的地方不是“哪天”，而是当天能不能执行：
施工方能不能到、老板是否到场、物品是否准备、现场谁负责、流程怎么走。

所以我这里分了几个档位：
- 199：先帮您看资料，判断需不需要做正式方案；
- 999：只做日期和时辰；
- 2980：完整流程方案，适合重要项目。

如果您现在还不确定，我建议先做 199 初审，成本低，也能避免直接做错方向。`
    },
    delay_followup: {
      title: "客户犹豫未回复",
      text: `您好，我这边再提醒一下。

如果您这个项目确实近期要开工，建议不要拖到前一天再确认。因为开工日期、时辰、负责人、施工方、物品和现场流程都需要提前协调。

您现在可以先不用直接做完整方案，先把项目类型、城市、计划时间、负责人是否到场这几个信息发我，我先帮您判断适合哪一档。`
    },
    after_payment: {
      title: "成交后交付说明",
      text: `收到，接下来我会按您的项目资料开始整理。

请您确认以下资料是否完整：
1. 项目类型；
2. 所在城市；
3. 计划开工时间范围；
4. 老板或负责人是否到场；
5. 施工方/物业是否能配合；
6. 是否需要供品、流程和人员分工；
7. 现场是否有特殊限制。

我会根据资料给您整理对应方案。需要说明的是：我提供的是传统民俗日期与商业开工流程建议，工程施工、安全、消防、物业等部分仍以施工方和相关负责人确认为准。`
    },
    lost_recover: {
      title: "流失客户回访",
      text: `您好，之前您咨询过【{projectType}】开工相关事项。

如果项目已经完成，祝您开工顺利。后续如果还有门店、办公室、厂房、搬迁、入驻等开工节点，也可以提前几天发资料给我，我帮您判断适合做日期咨询还是完整流程方案。

如果这次还没开工，也建议至少提前 3-7 天确认，避免临时赶时间。`
    }
  };

  Object.assign(SCRIPT_TEMPLATES, window.KAIGONG_SCRIPT_TEMPLATES || {});

  let allLeads = [];

  function getTrackingData(){
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const tracking = {
      landingPage: sessionStorage.getItem('landingPage') || location.href,
      utmSource: params.get('utm_source') || sessionStorage.getItem('utmSource') || '',
      utmMedium: params.get('utm_medium') || sessionStorage.getItem('utmMedium') || '',
      utmCampaign: params.get('utm_campaign') || sessionStorage.getItem('utmCampaign') || '',
      utmTerm: params.get('utm_term') || sessionStorage.getItem('utmTerm') || '',
      utmContent: params.get('utm_content') || sessionStorage.getItem('utmContent') || '',
      channelCode: params.get('channel') || params.get('ref') || sessionStorage.getItem('channelCode') || '',
      pageViewPath: ''
    };
    if(!sessionStorage.getItem('landingPage')) sessionStorage.setItem('landingPage', location.href);
    ['utmSource','utmMedium','utmCampaign','utmTerm','utmContent','channelCode'].forEach(k=>{
      if(tracking[k]) sessionStorage.setItem(k, tracking[k]);
    });
    const pathList = JSON.parse(sessionStorage.getItem('pageViewPath') || '[]');
    pathList.push(location.pathname + location.search);
    const slim = pathList.slice(-12);
    sessionStorage.setItem('pageViewPath', JSON.stringify(slim));
    tracking.pageViewPath = slim.join(' -> ');
    return tracking;
  }

  let currentSource = "";

  async function loadPublicContent(){
    try{
      const res = await fetch('/api/content/public');
      if(!res.ok) return null;
      const data = await res.json();
      return data && data.ok ? data : null;
    }catch(e){
      return null;
    }
  }

  function applyFooterContent(content){
    if(!content) return;
    const contact = content.contact || {};
    const publicUrls = content.publicUrls || {};
    document.querySelectorAll('footer .brand').forEach(brand=>{
      const parent = brand.parentElement;
      const line = parent ? parent.querySelector('p') : null;
      if(line && contact.footerLine) line.textContent = contact.footerLine;
    });
    document.querySelectorAll('.qr').forEach(box=>{
      if(publicUrls.qrImage){
        box.classList.add('has-image');
        box.innerHTML = '<img src="'+publicUrls.qrImage+'" alt="微信二维码">';
      }
      const caption = box.parentElement ? box.parentElement.querySelector('p') : null;
      if(caption){
        if(contact.qrCaption) caption.textContent = contact.qrCaption;
        else if(contact.wechatId) caption.textContent = '微信：' + contact.wechatId;
      }
    });
  }

  function applyTeacherContent(content){
    if(!content) return;
    const teacher = content.teacherProfile || {};
    const publicUrls = content.publicUrls || {};
    const teacherPhoto = document.querySelector('.teacher-photo');
    if(teacherPhoto && publicUrls.teacherImage){
      teacherPhoto.classList.add('has-image');
      teacherPhoto.style.backgroundImage = 'url("' + publicUrls.teacherImage + '")';
    }
    const heroWrap = teacherPhoto && teacherPhoto.parentElement ? teacherPhoto.parentElement : null;
    const heroTitle = heroWrap ? heroWrap.querySelector('h1') : null;
    const heroIntro = heroWrap ? heroWrap.querySelector('.sub') : null;
    if(heroTitle && teacher.heroTitle) heroTitle.textContent = teacher.heroTitle;
    if(heroIntro && teacher.heroIntro) heroIntro.textContent = teacher.heroIntro;
  }

  function applyGuideFormContent(content){
    if(!content) return;
    const contact = content.contact || {};

    document.querySelectorAll('[data-contact-line]').forEach(el=>{
      if(contact.footerLine) el.textContent = contact.footerLine;
    });

    document.querySelectorAll('[data-wechat-id]').forEach(el=>{
      if(contact.wechatId){
        el.hidden = false;
        el.textContent = '微信号：' + contact.wechatId;
      }else{
        el.hidden = true;
      }
    });

    document.querySelectorAll('[data-phone-line]').forEach(el=>{
      if(contact.phone){
        el.hidden = false;
        el.textContent = '手机号：' + contact.phone;
      }else{
        el.hidden = true;
      }
    });

    document.querySelectorAll('[data-note-line]').forEach(el=>{
      if(contact.note){
        el.hidden = false;
        el.textContent = contact.note;
      }else{
        el.hidden = true;
      }
    });

    document.querySelectorAll('[data-qr-caption]').forEach(el=>{
      if(contact.qrCaption) el.textContent = contact.qrCaption;
    });
  }

  function showToast(msg){
    const t=document.getElementById('toast');
    if(!t)return;
    t.textContent=msg;
    t.classList.add('show');
    clearTimeout(window.toastTimer);
    window.toastTimer=setTimeout(()=>t.classList.remove('show'),3200);
  }

  function openModal(id){ const m=document.getElementById(id); if(m)m.classList.add('show'); }
  function closeModal(id){ const m=document.getElementById(id); if(m)m.classList.remove('show'); }
  document.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',()=>closeModal(el.getAttribute('data-close'))));

  function getData(form){ return Object.fromEntries(new FormData(form).entries()); }

  function appendHoneypot(form){
    if(form.querySelector('input[name="website"]')) return;
    const wrap = document.createElement('div');
    wrap.style.position='absolute';
    wrap.style.left='-9999px';
    wrap.style.opacity='0';
    wrap.innerHTML = '<label>Website</label><input name="website" tabindex="-1" autocomplete="off">';
    form.appendChild(wrap);
  }


  function scoreLead(d){
    let s=0;
    const commercial = ['厂房 / 工厂','门店 / 商铺','办公室 / 公司','工地 / 工程项目','酒店 / 餐饮 / 会所','公司乔迁 / 搬厂'];
    const keyCities = ['广州','深圳','佛山','东莞','中山','惠州','珠海','江门'];
    const highRoles = ['老板本人','公司负责人'];
    if(commercial.includes(d.projectType))s+=20;
    if(['7 天内','15 天内','30 天内'].includes(d.startTime))s+=20;
    if(highRoles.includes(d.role))s+=20;
    if(keyCities.includes(d.city))s+=10;
    if((d.contact||'').trim().length>=2)s+=10;
    if(d.need && !d.need.includes('只想领取'))s+=20;
    let g='D 类线索';
    if(s>=80)g='A 类线索';
    else if(s>=60)g='B 类线索';
    else if(s>=40)g='C 类线索';
    return {score:s,grade:g};
  }

  function fillTemplate(text, lead){
    return String(text || '')
      .replaceAll('{projectType}', lead.projectType || '您的项目')
      .replaceAll('{city}', lead.city || '本地')
      .replaceAll('{startTime}', lead.startTime || '近期')
      .replaceAll('{role}', lead.role || '负责人')
      .replaceAll('{need}', lead.need || '开工咨询')
      .replaceAll('{contact}', lead.contact || '');
  }

  function buildMsg(d,l){
    return [
      '您好，我想咨询商业开工日期与流程。',
      '项目类型：'+(d.projectType||''),
      '所在城市：'+(d.city||''),
      '计划开工时间：'+(d.startTime||''),
      '咨询人身份：'+(d.role||''),
      '目前需要：'+(d.need||''),
      '联系方式：'+(d.contact||''),
      '补充说明：'+(d.note||'无'),
      '系统初步线索评分：'+l.score+' 分 / '+l.grade
    ].join('\\n');
  }

  function copyText(text){
    if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(text);
    const t=document.createElement('textarea');
    t.value=text;
    document.body.appendChild(t);
    t.select();
    try{ document.execCommand('copy'); document.body.removeChild(t); return Promise.resolve(); }
    catch(e){ document.body.removeChild(t); return Promise.reject(e); }
  }

  document.querySelectorAll('[data-copy-wechat]').forEach(btn=>{
    btn.addEventListener('click', async function(){
      const wechatId = btn.getAttribute('data-copy-wechat') || '';
      if(!wechatId) return;
      try{
        await copyText(wechatId);
        showToast('微信号已复制，请打开微信手动添加。');
        setTimeout(()=>{
          try{ window.location.href='weixin://'; }catch(e){}
        },220);
      }catch(e){
        showToast('复制失败，请手动添加微信号：'+wechatId);
      }
    });
  });

  function saveLocalLead(record){
    if(!CONFIG.ENABLE_LOCAL_BACKUP)return;
    const list=JSON.parse(localStorage.getItem('kaigong_v9_leads')||'[]');
    list.unshift(record);
    localStorage.setItem('kaigong_v9_leads',JSON.stringify(list.slice(0,500)));
  }

  async function submitLead(record){
    if(!CONFIG.FORM_ENDPOINT)return {ok:false, skipped:true};
    try{
      const res = await fetch(CONFIG.FORM_ENDPOINT, {
        method: CONFIG.FORM_METHOD || "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(record)
      });
      const payload = await res.json().catch(()=>({}));
      return {ok:res.ok, status:res.status, payload};
    }catch(e){ return {ok:false, error:String(e)}; }
  }

  document.querySelectorAll('form.lead-form').forEach(form=>{
    appendHoneypot(form);
    form.addEventListener('submit',async function(e){
      e.preventDefault();
      const d=getData(form);
      const l=scoreLead(d);
      const record={...d,score:l.score,grade:l.grade,status:'新线索',followNote:'',tag:'',dealAmount:0,nextFollowUp:'',page:location.pathname.split('/').pop() || 'index.html',...getTrackingData(),referrer:document.referrer || '',userAgent:navigator.userAgent || '',createdAt:new Date().toISOString()};
      saveLocalLead(record);
      sessionStorage.setItem('lastLead',JSON.stringify(record));
      const message=buildMsg(d,l);
      if(CONFIG.ENABLE_COPY_WECHAT_TEXT){ try{ await copyText(message); }catch(e){} }
      const result = await submitLead(record);
      if(result.ok) showToast('线索已进入后台，咨询话术已复制。');
      else showToast('后台提交失败，本机已备份，咨询话术已复制。');
      setTimeout(()=>{ location.href = form.getAttribute('data-thanks') || CONFIG.REDIRECT_AFTER_SUBMIT || 'thanks.html'; },350);
    });

    const btn=form.querySelector('.copyWechat');
    if(btn)btn.addEventListener('click',function(){
      const d=getData(form), l=scoreLead(d);
      copyText(buildMsg(d,l)).then(()=>showToast('微信咨询话术已复制')).catch(()=>showToast('复制失败'));
    });
  });

  const thanksBox=document.getElementById('thanksSummary');
  if(thanksBox){
    try{
      const d=JSON.parse(sessionStorage.getItem('lastLead')||'{}');
      thanksBox.innerHTML='<p><strong>项目类型：</strong>'+(d.projectType||'-')+'</p><p><strong>所在城市：</strong>'+(d.city||'-')+'</p><p><strong>计划开工时间：</strong>'+(d.startTime||'-')+'</p><p><strong>当前需求：</strong>'+(d.need||'-')+'</p><p><strong>补充说明：</strong>'+(d.note||'无')+'</p><p><strong>系统判断：</strong>'+(d.score||0)+' 分 / '+(d.grade||'-')+'</p>';
    }catch(e){}
  }

  function getToken(){ const el=document.getElementById('adminToken'); const val = el ? el.value.trim() : ''; return val || localStorage.getItem('kaigong_admin_token') || ''; }

  async function loadServerLeads(){
    const token = getToken();
    const headers = token ? {'X-Admin-Token': token} : {};
    try{
      const res = await fetch('/api/leads', {headers});
      if(!res.ok) throw new Error('HTTP '+res.status);
      return await res.json();
    }catch(e){ return null; }
  }

  function loadLocalLeads(){
    const v9 = JSON.parse(localStorage.getItem('kaigong_v9_leads')||'[]');
    const v6 = JSON.parse(localStorage.getItem('kaigong_v6_leads')||'[]');
    const v5 = JSON.parse(localStorage.getItem('kaigong_v5_leads')||'[]');
    const v4 = JSON.parse(localStorage.getItem('kaigong_v4_leads')||'[]');
    return v9.length ? v9 : (v6.length ? v6 : (v5.length ? v5 : v4));
  }

  function statusClass(status){
    if(status==='新线索')return 'status-pill status-new';
    if(status==='已加微信')return 'status-pill status-wechat';
    if(status==='已报价')return 'status-pill status-quoted';
    if(status==='已成交')return 'status-pill status-won';
    if(status==='已流失')return 'status-pill status-lost';
    if(status==='待回访')return 'status-pill status-follow';
    if(status==='无效线索')return 'status-pill status-lost';
    return 'status-pill';
  }

  function escapeHtml(str){
    return String(str || '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }

  function filteredLeads(){
    const status = document.getElementById('filterStatus')?.value || '';
    const grade = document.getElementById('filterGrade')?.value || '';
    const q = (document.getElementById('searchText')?.value || '').trim().toLowerCase();
    return allLeads.filter(x=>{
      if(status && (x.status || '新线索') !== status)return false;
      if(grade && (x.grade || '') !== grade)return false;
      if(q){
        const text = [x.projectType,x.city,x.startTime,x.role,x.need,x.contact,x.note,x.followNote,x.tag].join(' ').toLowerCase();
        if(!text.includes(q))return false;
      }
      return true;
    });
  }

  function updateSummary(){
    const total = allLeads.length;
    const a = allLeads.filter(x=>x.grade==='A 类线索').length;
    const n = allLeads.filter(x=>(x.status||'新线索')==='新线索').length;
    const w = allLeads.filter(x=>x.status==='已加微信').length;
    const won = allLeads.filter(x=>x.status==='已成交').length;
    const amount = allLeads.reduce((sum,x)=>sum + Number(x.dealAmount || 0), 0);
    const set=(id,val)=>{const el=document.getElementById(id); if(el)el.textContent=val;};
    set('sumTotal',total); set('sumA',a); set('sumNew',n); set('sumWechat',w); set('sumWon',won); set('sumAmount',amount);
  }

  function renderLeads(){
    const list=filteredLeads();
    const body=document.getElementById('leadsBody');
    const source=document.getElementById('leadSource');
    if(source)source.textContent=currentSource;
    updateSummary();
    if(!body)return;
    if(!list.length){ body.innerHTML='<tr><td colspan="13">暂无线索记录，或当前筛选条件下没有数据。</td></tr>'; return; }

    body.innerHTML=list.map((x,i)=>{
      const id=escapeHtml(x.id||'');
      const status=escapeHtml(x.status||'新线索');
      const optionHtml = Object.keys(SCRIPT_TEMPLATES).map(k=>'<option value="'+k+'">'+SCRIPT_TEMPLATES[k].title+'</option>').join('');
      return '<tr>'
      +'<td>'+(i+1)+'</td>'
      +'<td>'+escapeHtml(x.createdAt||'')+'</td>'
      +'<td><span class="'+statusClass(status)+'">'+status+'</span></td>'
      +'<td>'+escapeHtml(x.grade||'')+'</td>'
      +'<td>'+escapeHtml(x.score||0)+'</td>'
      +'<td>'+escapeHtml(x.projectType||'')+'</td>'
      +'<td>'+escapeHtml(x.city||'')+'</td>'
      +'<td>'+escapeHtml(x.startTime||'')+'</td>'
      +'<td>'+escapeHtml(x.role||'')+'</td>'
      +'<td>'+escapeHtml(x.need||'')+'</td>'
      +'<td>'+escapeHtml(x.contact||'')+'</td>'
      +'<td class="note-cell">'+escapeHtml(x.note||'无')+'</td>'
      +'<td class="crm-actions"><div class="crm-mini-form" data-id="'+id+'">'
      +'<select class="crm-status">'+['新线索','已加微信','已报价','已成交','已流失','待回访','无效线索'].map(s=>'<option '+(s===(x.status||'新线索')?'selected':'')+'>'+s+'</option>').join('')+'</select>'
      +'<input class="crm-tag" placeholder="客户标签，例如：厂房/急单/高意向" value="'+escapeHtml(x.tag||'')+'">'
      +'<input class="crm-amount" type="number" placeholder="成交金额" value="'+escapeHtml(x.dealAmount||'')+'">'
      +'<input class="crm-next" placeholder="下次回访，例如：2026-07-05" value="'+escapeHtml(x.nextFollowUp||'')+'">'
      +'<textarea class="crm-note" placeholder="跟进备注">'+escapeHtml(x.followNote||'')+'</textarea>'
      +'<button class="btn btn-gold btn-small crm-save" type="button">保存跟进</button>'
      +'<div class="script-mini-panel" data-lead-index="'+i+'"><select class="script-select">'+optionHtml+'</select><textarea class="script-preview"></textarea><button class="btn btn-outline btn-small script-copy" type="button">复制选中话术</button></div>'
      +'</div></td>'
      +'</tr>';
    }).join('');

    document.querySelectorAll('.crm-save').forEach(btn=>btn.addEventListener('click', saveCrmRow));
    document.querySelectorAll('.script-mini-panel').forEach(panel=>{
      const select = panel.querySelector('.script-select');
      const preview = panel.querySelector('.script-preview');
      const row = panel.closest('.crm-mini-form');
      const id = row?.getAttribute('data-id');
      const lead = allLeads.find(x=>String(x.id||'')===String(id)) || {};
      function updatePreview(){
        const key = select.value;
        preview.value = fillTemplate(SCRIPT_TEMPLATES[key].text, lead);
      }
      select.addEventListener('change', updatePreview);
      updatePreview();
      panel.querySelector('.script-copy').addEventListener('click',()=>copyText(preview.value).then(()=>showToast('话术已复制')).catch(()=>showToast('复制失败')));
    });
  }

  async function refreshLeads(){
    const server = await loadServerLeads();
    if(server && Array.isArray(server.leads)){ allLeads=server.leads; currentSource='当前显示：后端服务器数据'; renderLeads(); return; }
    allLeads=loadLocalLeads(); currentSource='当前显示：本机 localStorage 数据。服务器未运行或密钥错误。'; renderLeads();
  }

  async function saveCrmRow(e){
    const box=e.target.closest('.crm-mini-form');
    const id=box?.getAttribute('data-id');
    if(!id){ showToast('缺少线索 ID，无法保存。'); return; }
    const payload={status:box.querySelector('.crm-status')?.value||'新线索',tag:box.querySelector('.crm-tag')?.value||'',dealAmount:box.querySelector('.crm-amount')?.value||0,nextFollowUp:box.querySelector('.crm-next')?.value||'',followNote:box.querySelector('.crm-note')?.value||''};
    const token=getToken();
    const headers={'Content-Type':'application/json'};
    if(token)headers['X-Admin-Token']=token;
    try{
      const res=await fetch('/api/leads/'+encodeURIComponent(id),{method:'PATCH',headers,body:JSON.stringify(payload)});
      if(!res.ok) throw new Error('HTTP '+res.status);
      showToast('跟进记录已保存。');
      await refreshLeads();
    }catch(err){ showToast('保存失败：请确认后端运行，或后台密钥是否正确。'); }
  }

  const leadsBody=document.getElementById('leadsBody');
  if(leadsBody)refreshLeads();

  ['filterStatus','filterGrade','searchText'].forEach(id=>{
    const el=document.getElementById(id);
    if(el){ el.addEventListener('input', renderLeads); el.addEventListener('change', renderLeads); }
  });


  const saveAdminTokenBtn = document.getElementById('saveAdminToken');
  if(saveAdminTokenBtn){
    const tokenInput = document.getElementById('adminToken');
    if(tokenInput && localStorage.getItem('kaigong_admin_token')) tokenInput.value = localStorage.getItem('kaigong_admin_token');
    saveAdminTokenBtn.addEventListener('click',()=>{
      const token = tokenInput ? tokenInput.value.trim() : '';
      if(token){
        localStorage.setItem('kaigong_admin_token', token);
        showToast('后台密钥已保存到本机浏览器。');
      }else{
        localStorage.removeItem('kaigong_admin_token');
        showToast('已清空本机后台密钥。');
      }
    });
  }

  const reloadBtn=document.getElementById('reloadLeads');
  if(reloadBtn)reloadBtn.addEventListener('click', refreshLeads);

  const exportBtn=document.getElementById('exportCsv');
  if(exportBtn)exportBtn.addEventListener('click',()=>{ const token=getToken(); window.location.href = token ? '/api/leads.csv?token='+encodeURIComponent(token) : '/api/leads.csv'; });

  const clearBtn=document.getElementById('clearLeads');
  if(clearBtn)clearBtn.addEventListener('click',()=>{ if(confirm('确认清空本机备份？服务器数据不会被清空。')){ ['kaigong_v9_leads','kaigong_v6_leads','kaigong_v5_leads','kaigong_v4_leads'].forEach(k=>localStorage.removeItem(k)); refreshLeads(); } });

  document.querySelectorAll('.copy-static-script').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const target=document.getElementById(btn.getAttribute('data-target'));
      if(target)copyText(target.innerText).then(()=>showToast('话术已复制')).catch(()=>showToast('复制失败'));
    });
  });

  loadPublicContent().then(content=>{
    if(!content) return;
    applyFooterContent(content);
    applyTeacherContent(content);
    applyGuideFormContent(content);
  });
})();
