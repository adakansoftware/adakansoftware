import assert from 'node:assert/strict'
import test from 'node:test'
import { validatePublicSnapshot } from './public-content-snapshot.mjs'
const project = { title: 'Published', category: 'Web', description: 'Public description', year: '2026', href: '/projects/example', color: '#000000' }
test('build snapshot accepts only public presentation fields', () => {
  const snapshot = validatePublicSnapshot({ projects: { tr: [{ ...project, id: 'private-id', draft: true, secret: 'test-secret-placeholder' }], en: [] }, logos: { tr: [], en: [] }, credentials: 'must-not-publish' })
  assert.deepEqual(snapshot.projects.tr, [project])
  assert.ok(!JSON.stringify(snapshot).includes('must-not-publish'))
  assert.ok(!JSON.stringify(snapshot).includes('test-secret-placeholder'))
  assert.ok(!JSON.stringify(snapshot).includes('private-id'))
})
test('invalid snapshots cannot silently replace published content', () => {
  for (const value of [null, {}, { projects: { tr: [], en: [] }, logos: {} }, { projects: { tr: [{}], en: [] }, logos: { tr: [], en: [] } }]) assert.throws(() => validatePublicSnapshot(value))
})
