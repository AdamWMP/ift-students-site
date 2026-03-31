import { redirect } from 'next/navigation'

const COURSE_REDIRECTS: Record<string, string> = {
  sc: '/courses/strength-conditioning#checkout',
  ppn: '/courses/pre-post-natal#checkout',
  nutricert: '/courses/nutricert#checkout',
}

export default function AddonCheckoutPage({
  searchParams,
}: {
  searchParams: { course?: string }
}) {
  const courseId = searchParams.course || ''
  const destination = COURSE_REDIRECTS[courseId]

  if (!destination) {
    redirect('/courses')
  }

  redirect(destination)
}
