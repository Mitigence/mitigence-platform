export const SITE_DOMAIN = 'mitigence.com'
export const SITE_URL = `https://${SITE_DOMAIN}`
export const WORKSPACE_SUBDOMAIN = `workspace.${SITE_DOMAIN}`
export const BUSINESS_EMAIL = `business@${SITE_DOMAIN}`
export const HR_EMAIL = `hr@${SITE_DOMAIN}`
export const NOREPLY_EMAIL = `noreply@${SITE_DOMAIN}`

export function clientEmailForSlug(slug: string): string {
  return `${slug}@${SITE_DOMAIN}`
}
