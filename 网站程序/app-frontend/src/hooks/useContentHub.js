import { useEffect, useMemo, useState } from 'react'
import {
  fetchContentHubState,
  getContentHubLinks,
  resolveContentAssetUrl,
} from '../lib/contentHub'

const defaultState = {
  contact: {
    footerLine: '',
    wechatId: '',
    phone: '',
    qrCaption: '',
    note: '',
  },
  teacherProfile: {
    heroTitle: '',
    heroIntro: '',
    displayName: '',
    summary: '',
    serviceNote: '',
  },
  homepageHero: {
    logoText: '',
    title: '',
    subtitle: '',
    detail: '',
    primaryButton: '',
    secondaryButton: '',
    image: '',
    imageMode: '',
  },
  publicUrls: {
    qrImage: '',
    teacherImage: '',
    cases: {
      factory: '',
      store: '',
      office: '',
    },
    pdfs: {
      commercialStartGuide: '',
    },
  },
  files: {
    qr: [],
    teacher: [],
    cases: [],
    pdfs: [],
  },
}

const pdfSlotMeta = [
  { key: 'commercialStartGuide', label: '商业开工流程总指引' },
  { key: 'factoryStartChecklist', label: '厂房开工检查清单' },
  { key: 'storeOpeningGuide', label: '门店开业指南' },
  { key: 'officeRenovationGuide', label: '办公室装修开工指南' },
  { key: 'casePhotoUploadChecklist', label: '案例图片上传说明' },
  { key: 'realCaseRecordTemplate', label: '真实案例记录模板' },
  { key: 'serviceAgreementTemplate', label: '服务协议模板' },
  { key: 'clientIntakeFormTemplate', label: '客户资料收集表' },
  { key: 'delivery199ReviewTemplate', label: '199 元资料初审模板' },
  { key: 'delivery999DateTimeTemplate', label: '999 元日期与时辰模板' },
  { key: 'delivery2980FullProcessTemplate', label: '2980 元完整方案模板' },
]

function normalizeValue(value) {
  return typeof value === 'string' ? value.trim() : ''
}

export function useContentHub() {
  const [state, setState] = useState(defaultState)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function load() {
      try {
        setLoading(true)
        const nextState = await fetchContentHubState()
        if (!active) return
        setState({
          ...defaultState,
          ...nextState,
        })
        setError('')
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : 'content-hub load failed')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [])

  const derived = useMemo(() => {
    const links = getContentHubLinks()
    const qrCount = state.files?.qr?.length ?? 0
    const teacherCount = state.files?.teacher?.length ?? 0
    const caseCount = state.files?.cases?.length ?? 0
    const pdfCount = state.files?.pdfs?.length ?? 0

    return {
      contactLine:
        normalizeValue(state.contact?.footerLine) ||
        '老师一对一咨询｜微信预约',
      wechatId: normalizeValue(state.contact?.wechatId),
      phone: normalizeValue(state.contact?.phone),
      qrCaption:
        normalizeValue(state.contact?.qrCaption) || '长按识别二维码添加微信',
      note: normalizeValue(state.contact?.note),
      teacherHeroTitle:
        normalizeValue(state.teacherProfile?.heroTitle) ||
        '专注商业开工场景的日期与流程顾问',
      teacherHeroIntro:
        normalizeValue(state.teacherProfile?.heroIntro) ||
        '围绕资料确认、日期参考、时辰建议、流程准备、现场注意事项与后续答疑，提供更贴近商业场景的顾问建议。',
      teacherName:
        normalizeValue(state.teacherProfile?.displayName) || '顾问介绍素材位',
      teacherSummary:
        normalizeValue(state.teacherProfile?.summary) ||
        '顾问介绍海报和详细说明后续可继续通过 content-hub 更新。',
      teacherServiceNote:
        normalizeValue(state.teacherProfile?.serviceNote) ||
        '服务边界、资质说明与介绍长文案继续预留在后续版本接入。',
      homepageHero: {
        logoText: normalizeValue(state.homepageHero?.logoText) || 'LOGO',
        title: normalizeValue(state.homepageHero?.title) || '知远择吉',
        subtitle:
          normalizeValue(state.homepageHero?.subtitle) ||
          '门店开业、企业开工、工程奠基、商业开市 专业择吉顾问服务',
        detail:
          normalizeValue(state.homepageHero?.detail) || '广东500家商铺开业择吉的首选！',
        primaryButton:
          normalizeValue(state.homepageHero?.primaryButton) || '免费领取商业开工指南',
        secondaryButton:
          normalizeValue(state.homepageHero?.secondaryButton) || '预约顾问',
        image: resolveContentAssetUrl(
          normalizeValue(state.homepageHero?.image) ||
            'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        ),
        imageMode: normalizeValue(state.homepageHero?.imageMode) || 'split',
      },
      qrImageUrl: resolveContentAssetUrl(normalizeValue(state.publicUrls?.qrImage)),
      teacherImageUrl: resolveContentAssetUrl(
        normalizeValue(state.publicUrls?.teacherImage),
      ),
      caseImages: [
        {
          key: 'factory',
          label: '工厂开工案例位',
          imageUrl: resolveContentAssetUrl(
            normalizeValue(state.publicUrls?.cases?.factory),
          ),
        },
        {
          key: 'store',
          label: '门店开业案例位',
          imageUrl: resolveContentAssetUrl(
            normalizeValue(state.publicUrls?.cases?.store),
          ),
        },
        {
          key: 'office',
          label: '办公室装修案例位',
          imageUrl: resolveContentAssetUrl(
            normalizeValue(state.publicUrls?.cases?.office),
          ),
        },
      ],
      guidePdfUrl: resolveContentAssetUrl(
        normalizeValue(state.publicUrls?.pdfs?.commercialStartGuide),
      ),
      pdfSlots: pdfSlotMeta.map((slot) => {
        const relativeUrl = normalizeValue(state.publicUrls?.pdfs?.[slot.key])
        return {
          ...slot,
          url: resolveContentAssetUrl(relativeUrl),
          ready: Boolean(relativeUrl),
        }
      }),
      assetCounts: {
        qr: qrCount,
        teacher: teacherCount,
        cases: caseCount,
        pdfs: pdfCount,
      },
      links,
    }
  }, [state])

  return {
    rawState: state,
    content: derived,
    loading,
    error,
  }
}
