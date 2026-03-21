export type WorkCategoryDefinition = {
  apiLabel: string
  assetSlug: string
  description: string
}

export const WORK_CATEGORY_DEFINITIONS: WorkCategoryDefinition[] = [
  {
    apiLabel: 'Conducting Research',
    assetSlug: 'conducting',
    description:
      'Research shapes better decisions. You dig for facts, compare sources, and turn uncertainty into clarity the whole team can use.',
  },
  {
    apiLabel: 'Creating Content and Visuals',
    assetSlug: 'content',
    description:
      'You turn ideas into something people can see and share. Strong visuals and clear content help everyone stay aligned and motivated.',
  },
  {
    apiLabel: 'Task Assignment and Scheduling',
    assetSlug: 'scheduling',
    description:
      'Keeping work ordered and on time is a superpower. You balance priorities, set expectations, and help the team ship without burning out.',
  },
  {
    apiLabel: 'Programming',
    assetSlug: 'programming',
    description:
      'You build the systems that make the product real. Clear code, steady problem-solving, and iteration turn specs into working software.',
  },
  {
    apiLabel: 'Working with Spreadsheets and Data',
    assetSlug: 'spreadsheets',
    description:
      'Numbers tell stories when someone organizes them. You make data trustworthy, easy to read, and actionable for the rest of the team.',
  },
  {
    apiLabel: 'Reviewing and Providing Feedback',
    assetSlug: 'feedback',
    description:
      'Good feedback raises everyone’s bar. You spot gaps early, explain what matters, and help teammates improve with respect and precision.',
  },
  {
    apiLabel: 'Documentation',
    assetSlug: 'documentation',
    description:
      'What isn’t written is soon forgotten. You capture how things work so onboarding, handoffs, and future you all have an easier path.',
  },
  {
    apiLabel: 'Testing',
    assetSlug: 'testing',
    description:
      'Even without strong coding skill, testing is a good role. You learn how things work, work with many teams, and help make better products.',
  },
  {
    apiLabel: 'Translation',
    assetSlug: 'translate',
    description:
      'You bridge languages and cultures so the same message lands everywhere. Accuracy and tone keep collaboration global and inclusive.',
  },
  {
    apiLabel: 'Sending Emails and Communication',
    assetSlug: 'email',
    description:
      'Clear updates keep projects moving. You choose the right channel, say what matters, and make sure stakeholders stay in the loop.',
  },
  {
    apiLabel: 'Finalizing and Submitting Work',
    assetSlug: 'finalizing',
    description:
      'The last mile counts. You polish deliverables, check details, and hand off work that’s ready for the world—no loose ends.',
  },
]

const ASSET_BASE = '/assets/work_cate'

/** Default when label is missing or not in the registry */
export const WORK_CATEGORY_FALLBACK: Omit<WorkCategoryDefinition, 'apiLabel'> & {
  displayTitle: string
} = {
  displayTitle: 'Your contribution',
  assetSlug: 'content',
  description:
    'Keep logging varied tasks and reviews so we can highlight your strongest work patterns in the next project wrap-up.',
}

function normalizeLabel(s: string): string {
  return s.trim().replace(/\s+/g, ' ')
}

/**
 * Resolve artwork URL for a slug under public/assets/work_cate.
 */
export function workCategoryImageSrc(assetSlug: string): string {
  return `${ASSET_BASE}/${assetSlug}.png`
}

export type ResolvedWorkCategory = {
  /** Title shown in UI (usually same as API label) */
  title: string
  description: string
  imageSrc: string
  /** True if we matched the registry */
  isKnown: boolean
}

/**
 * Map API `strength` / work category string to copy + image.
 * Matching is case-insensitive; unknown strings still return a sensible fallback.
 */
export function resolveWorkCategory(strength: string | null | undefined): ResolvedWorkCategory {
  const raw = strength == null ? '' : normalizeLabel(String(strength))
  if (!raw || /^unknown category$/i.test(raw)) {
    return {
      title: WORK_CATEGORY_FALLBACK.displayTitle,
      description: WORK_CATEGORY_FALLBACK.description,
      imageSrc: workCategoryImageSrc(WORK_CATEGORY_FALLBACK.assetSlug),
      isKnown: false,
    }
  }

  const exact = WORK_CATEGORY_DEFINITIONS.find((d) => d.apiLabel === raw)
  if (exact) {
    return {
      title: exact.apiLabel,
      description: exact.description,
      imageSrc: workCategoryImageSrc(exact.assetSlug),
      isKnown: true,
    }
  }

  const lower = raw.toLowerCase()
  const fuzzy = WORK_CATEGORY_DEFINITIONS.find((d) => d.apiLabel.toLowerCase() === lower)
  if (fuzzy) {
    return {
      title: fuzzy.apiLabel,
      description: fuzzy.description,
      imageSrc: workCategoryImageSrc(fuzzy.assetSlug),
      isKnown: true,
    }
  }

  return {
    title: raw,
    description: WORK_CATEGORY_FALLBACK.description,
    imageSrc: workCategoryImageSrc(WORK_CATEGORY_FALLBACK.assetSlug),
    isKnown: false,
  }
}
